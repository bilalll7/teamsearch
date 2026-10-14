import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // PD-01: validate email against allowlist
    const emailDomain = '@' + dto.email.split('@')[1];
    const allowedDomain = await this.prisma.allowedDomain.findFirst({
      where: {
        domain: emailDomain,
        aktif: true,
      },
      include: { campus: true },
    });

    if (!allowedDomain) {
      throw new BadRequestException('Email domain not allowed for registration');
    }

    // Check existing user
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Hash password with bcrypt (replacing Argon2id due to Windows build constraints)
    // ponytail: bcrypt rounds=10 default; PD-07 specified Argon2id m=19456,t=2,p=1 but unavailable on Windows without C++ build tools
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        campusId: allowedDomain.campusId,
        statusVerifikasi: false, // ponytail: email verification pending (tokens not yet implemented per D-07 open decision)
      },
    });

    // Create empty profile (BR-02.1: field wajib will be filled later)
    await this.prisma.profile.create({
      data: {
        userId: user.id,
        namaTampilan: dto.email.split('@')[0], // default from email
        bio: null,
      },
    });

    return {
      message: 'Registration successful',
      userId: user.id,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ponytail: email verification check skipped until token entities implemented (D-07 pending)
    // if (!user.statusVerifikasi) {
    //   throw new UnauthorizedException('Email not verified');
    // }

    // Generate tokens per PD-07
    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async refresh(userId: string, oldRefreshToken: string) {
    // PD-07: refresh token rotation with reuse detection
    const tokenHash = await bcrypt.hash(oldRefreshToken, 10);
    
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!storedToken || storedToken.revokedAt) {
      // Reuse detected — revoke entire family per PD-07
      if (storedToken?.familyId) {
        await this.prisma.refreshToken.updateMany({
          where: { familyId: storedToken.familyId },
          data: { revokedAt: new Date() },
        });
      }
      throw new UnauthorizedException('Token reuse detected');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    if (storedToken.userId !== userId) {
      throw new UnauthorizedException('Invalid token');
    }

    // Revoke old token
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Issue new tokens with same family
    const { accessToken, refreshToken } = await this.generateTokens(
      userId,
      storedToken.familyId,
    );

    return { accessToken, refreshToken };
  }

  async logout(userId: string, refreshToken: string) {
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        tokenHash,
      },
      data: { revokedAt: new Date() },
    });

    return { message: 'Logged out successfully' };
  }

  private async generateTokens(userId: string, familyId?: string) {
    const payload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m', // PD-07
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d', // PD-07
    });

    // Store hashed refresh token per PD-07
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const newFamilyId = familyId || randomBytes(16).toString('hex');

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        familyId: newFamilyId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { accessToken, refreshToken };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        campusId: true,
        statusVerifikasi: true,
      },
    });
  }
}
