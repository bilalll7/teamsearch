import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateProfileDto, CreatePortfolioLinkDto, UpdatePortfolioLinkDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        portfolioLinks: true,
        userSkills: {
          include: {
            skill: {
              include: {
                kategori: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async getPublicProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        portfolioLinks: true,
        userSkills: { include: { skill: { include: { kategori: true } } } },
      },
    });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.profile.update({
      where: { userId },
      data: dto,
    });
  }

  async getPortfolioLinks(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.portfolioLink.findMany({
      where: { profileId: profile.id },
    });
  }

  async createPortfolioLink(userId: string, dto: CreatePortfolioLinkDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // BR-02.2: Validate https
    if (!dto.url.startsWith('https://')) {
      throw new ForbiddenException('Portfolio URL must use HTTPS');
    }

    return this.prisma.portfolioLink.create({
      data: {
        profileId: profile.id,
        label: dto.label,
        url: dto.url,
        tipe: dto.tipe,
      },
    });
  }

  async updatePortfolioLink(userId: string, linkId: string, dto: UpdatePortfolioLinkDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const link = await this.prisma.portfolioLink.findUnique({
      where: { id: linkId },
    });

    if (!link) {
      throw new NotFoundException('Portfolio link not found');
    }

    if (link.profileId !== profile.id) {
      throw new ForbiddenException('You can only update your own portfolio links');
    }

    // BR-02.2: Validate https if url is being updated
    if (dto.url && !dto.url.startsWith('https://')) {
      throw new ForbiddenException('Portfolio URL must use HTTPS');
    }

    return this.prisma.portfolioLink.update({
      where: { id: linkId },
      data: dto,
    });
  }

  async deletePortfolioLink(userId: string, linkId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const link = await this.prisma.portfolioLink.findUnique({
      where: { id: linkId },
    });

    if (!link) {
      throw new NotFoundException('Portfolio link not found');
    }

    if (link.profileId !== profile.id) {
      throw new ForbiddenException('You can only delete your own portfolio links');
    }

    await this.prisma.portfolioLink.delete({
      where: { id: linkId },
    });

    return { message: 'Portfolio link deleted' };
  }
}
