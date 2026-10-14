import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddUserSkillDto, UpdateUserSkillDto } from './dto/skills.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async getCategories() {
    return this.prisma.skillCategory.findMany({
      orderBy: { nama: 'asc' },
    });
  }

  async getSkills(kategoriId?: string, search?: string) {
    return this.prisma.skill.findMany({
      where: {
        status: 'aktif', // PD-03: only show active skills
        ...(kategoriId && { kategoriSkillId: kategoriId }),
        ...(search && {
          nama: {
            contains: search,
            mode: 'insensitive',
          },
        }),
      },
      include: {
        kategori: true,
      },
      orderBy: { nama: 'asc' },
    });
  }

  async getUserSkills(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.userSkill.findMany({
      where: { profileId: profile.id },
      include: {
        skill: {
          include: {
            kategori: true,
          },
        },
      },
      orderBy: { skill: { nama: 'asc' } },
    });
  }

  async addUserSkill(userId: string, dto: AddUserSkillDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Verify skill exists and is active
    const skill = await this.prisma.skill.findUnique({
      where: { id: dto.skillId },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    if (skill.status !== 'aktif') {
      throw new BadRequestException('Skill is not active');
    }

    // Check if already exists
    const existing = await this.prisma.userSkill.findUnique({
      where: {
        profileId_skillId: {
          profileId: profile.id,
          skillId: dto.skillId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Skill already added');
    }

    // Check max 20 skills (BR-02.1: implied from schema constraint)
    const count = await this.prisma.userSkill.count({
      where: { profileId: profile.id },
    });

    if (count >= 20) {
      throw new ForbiddenException('Maximum 20 skills allowed');
    }

    return this.prisma.userSkill.create({
      data: {
        profileId: profile.id,
        skillId: dto.skillId,
        level: dto.level,
      },
      include: {
        skill: {
          include: {
            kategori: true,
          },
        },
      },
    });
  }

  async updateUserSkill(userId: string, userSkillId: string, dto: UpdateUserSkillDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const userSkill = await this.prisma.userSkill.findUnique({
      where: { id: userSkillId },
    });

    if (!userSkill) {
      throw new NotFoundException('User skill not found');
    }

    if (userSkill.profileId !== profile.id) {
      throw new ForbiddenException('You can only update your own skills');
    }

    return this.prisma.userSkill.update({
      where: { id: userSkillId },
      data: { level: dto.level },
      include: {
        skill: {
          include: {
            kategori: true,
          },
        },
      },
    });
  }

  async deleteUserSkill(userId: string, userSkillId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const userSkill = await this.prisma.userSkill.findUnique({
      where: { id: userSkillId },
    });

    if (!userSkill) {
      throw new NotFoundException('User skill not found');
    }

    if (userSkill.profileId !== profile.id) {
      throw new ForbiddenException('You can only delete your own skills');
    }

    await this.prisma.userSkill.delete({
      where: { id: userSkillId },
    });

    return { message: 'Skill removed' };
  }
}
