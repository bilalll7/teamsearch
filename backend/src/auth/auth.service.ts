import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { createHash, randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const allowedDomain = await this.prisma.allowedDomain.findFirst({
      where: { domain: '@' + email.split('@')[1], aktif: true },
    });
    if (!allowedDomain)
      throw new BadRequestException(
        'Email domain not allowed for registration',
      );
    const existing = await this.prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });
    if (existing) throw new ConflictException('Email already registered');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          passwordHash,
          campusId: allowedDomain.campusId,
          statusVerifikasi: false,
          profile: { create: { namaTampilan: email.split('@')[0] } },
        },
      });
      return { message: 'Registration successful', userId: user.id };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ConflictException('Email already registered');
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: dto.email.trim(), mode: 'insensitive' } },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash)))
      throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.generateTokens(user.id);
    return { ...tokens, user: { id: user.id, email: user.email } };
  }

  private digest(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  async refresh(userId: string, token: string) {
    // SHA-256 gives a stable lookup for high-entropy JWTs. Previously issued
    // bcrypt records cannot be looked up reliably; those sessions sign in again.
    const outcome = await this.prisma.$transaction(async (tx) => {
      const stored = await tx.refreshToken.findUnique({
        where: { tokenHash: this.digest(token) },
      });
      if (!stored || stored.userId !== userId || stored.expiresAt < new Date())
        return null;
      if (stored.revokedAt) {
        await tx.refreshToken.updateMany({
          where: { familyId: stored.familyId },
          data: { revokedAt: new Date() },
        });
        return null;
      }
      const consumed = await tx.refreshToken.updateMany({
        where: { id: stored.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      if (consumed.count !== 1) {
        await tx.refreshToken.updateMany({
          where: { familyId: stored.familyId },
          data: { revokedAt: new Date() },
        });
        return null;
      }
      return this.generateTokens(userId, stored.familyId, tx);
    });
    if (!outcome)
      throw new UnauthorizedException('Session expired. Please sign in again.');
    return outcome;
  }

  async logout(userId: string, token: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.digest(token) },
    });
    if (stored?.userId === userId) {
      await this.prisma.refreshToken.updateMany({
        where: { userId, familyId: stored.familyId },
        data: { revokedAt: new Date() },
      });
    } else {
      // Retire legacy bcrypt-backed sessions for this user on explicit logout.
      await this.prisma.refreshToken.updateMany({
        where: { userId, tokenHash: { startsWith: '$2' } },
        data: { revokedAt: new Date() },
      });
    }
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(
    userId: string,
    familyId: string = randomUUID(),
    client: Prisma.TransactionClient = this.prisma,
  ) {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );
    const refreshToken = this.jwtService.sign(
      { sub: userId, jti: randomUUID() },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );
    await client.refreshToken.create({
      data: {
        userId,
        tokenHash: this.digest(refreshToken),
        familyId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    return { accessToken, refreshToken };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, campusId: true, statusVerifikasi: true },
    });
  }
}
