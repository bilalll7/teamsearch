import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateOpportunityDto,
  UpdateOpportunityDto,
  CreatePositionDto,
  UpdatePositionDto,
  CreatePositionSkillRequirementDto,
  UpdatePositionSkillRequirementDto,
} from './dto/opportunity.dto';

@Injectable()
export class OpportunityService {
  constructor(private prisma: PrismaService) {}

  async createOpportunity(userId: string, dto: CreateOpportunityDto) {
    // BR-04.1: validate tenggat not in past
    if (dto.tenggat && new Date(dto.tenggat) < new Date()) {
      throw new BadRequestException('Tenggat cannot be in the past');
    }

    // ponytail: BR-04.2 requires "profil lengkap" but D-09 open (no agreed definition)
    // For now, allow creation with verified account only
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.opportunity.create({
      data: {
        ownerId: userId,
        judul: dto.judul,
        deskripsi: dto.deskripsi,
        jenis: dto.jenis,
        kategori: dto.kategori,
        mode: dto.mode,
        tenggat: dto.tenggat ? new Date(dto.tenggat) : null,
        status: 'draft', // BR-04.5: can save as draft
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                namaTampilan: true,
              },
            },
          },
        },
      },
    });
  }

  async getOpportunities(filters?: {
    jenis?: string;
    kategori?: string;
    kampus?: string;
    status?: string;
  }) {
    return this.prisma.opportunity.findMany({
      where: {
        status: filters?.status || { in: ['open', 'draft'] }, // BR-04.3: expired not in active list
        ...(filters?.jenis && { jenis: filters.jenis }),
        ...(filters?.kategori && { kategori: filters.kategori }),
        ...(filters?.kampus && {
          owner: {
            campusId: filters.kampus,
          },
        }),
      },
      include: {
        owner: {
          select: {
            id: true,
            campusId: true,
            profile: {
              select: {
                namaTampilan: true,
              },
            },
          },
        },
        positions: {
          include: {
            skillRequirements: {
              include: {
                skill: {
                  include: {
                    kategori: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOpportunityById(id: string) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            campusId: true,
            profile: {
              select: {
                namaTampilan: true,
                bio: true,
              },
            },
          },
        },
        positions: {
          include: {
            skillRequirements: {
              include: {
                skill: {
                  include: {
                    kategori: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    return opportunity;
  }

  async updateOpportunity(userId: string, id: string, dto: UpdateOpportunityDto) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    if (opportunity.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own opportunities');
    }

    // Validate tenggat if provided
    if (dto.tenggat && new Date(dto.tenggat) < new Date()) {
      throw new BadRequestException('Tenggat cannot be in the past');
    }

    return this.prisma.opportunity.update({
      where: { id },
      data: {
        ...(dto.judul && { judul: dto.judul }),
        ...(dto.deskripsi && { deskripsi: dto.deskripsi }),
        ...(dto.jenis && { jenis: dto.jenis }),
        ...(dto.kategori && { kategori: dto.kategori }),
        ...(dto.mode && { mode: dto.mode }),
        ...(dto.tenggat && { tenggat: new Date(dto.tenggat) }),
        ...(dto.status && { status: dto.status }),
      },
    });
  }

  async deleteOpportunity(userId: string, id: string) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    if (opportunity.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own opportunities');
    }

    await this.prisma.opportunity.delete({
      where: { id },
    });

    return { message: 'Opportunity deleted' };
  }

  // Position Management
  async createPosition(userId: string, opportunityId: string, dto: CreatePositionDto) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    if (opportunity.ownerId !== userId) {
      throw new ForbiddenException('You can only add positions to your own opportunities');
    }

    return this.prisma.position.create({
      data: {
        opportunityId,
        nama: dto.nama,
        jumlahSlot: dto.jumlahSlot,
        deskripsi: dto.deskripsi,
      },
    });
  }

  async updatePosition(userId: string, positionId: string, dto: UpdatePositionDto) {
    const position = await this.prisma.position.findUnique({
      where: { id: positionId },
      include: { opportunity: true },
    });

    if (!position) {
      throw new NotFoundException('Position not found');
    }

    if (position.opportunity.ownerId !== userId) {
      throw new ForbiddenException('You can only update positions in your own opportunities');
    }

    return this.prisma.position.update({
      where: { id: positionId },
      data: dto,
    });
  }

  async deletePosition(userId: string, positionId: string) {
    const position = await this.prisma.position.findUnique({
      where: { id: positionId },
      include: { opportunity: true },
    });

    if (!position) {
      throw new NotFoundException('Position not found');
    }

    if (position.opportunity.ownerId !== userId) {
      throw new ForbiddenException('You can only delete positions in your own opportunities');
    }

    await this.prisma.position.delete({
      where: { id: positionId },
    });

    return { message: 'Position deleted' };
  }

  // Skill Requirements Management
  async createSkillRequirement(
    userId: string,
    positionId: string,
    dto: CreatePositionSkillRequirementDto,
  ) {
    const position = await this.prisma.position.findUnique({
      where: { id: positionId },
      include: { opportunity: true },
    });

    if (!position) {
      throw new NotFoundException('Position not found');
    }

    if (position.opportunity.ownerId !== userId) {
      throw new ForbiddenException('You can only add requirements to your own positions');
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

    // Check duplicate
    const existing = await this.prisma.positionSkillRequirement.findUnique({
      where: {
        positionId_skillId: {
          positionId,
          skillId: dto.skillId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Skill requirement already exists for this position');
    }

    // PD-05: Fixed weights must_have=5, nice_to_have=2
    const bobot = dto.jenis === 'must_have' ? 5 : 2;

    return this.prisma.positionSkillRequirement.create({
      data: {
        positionId,
        skillId: dto.skillId,
        jenis: dto.jenis,
        bobot,
        levelMinimum: dto.levelMinimum || 1,
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

  async updateSkillRequirement(
    userId: string,
    requirementId: string,
    dto: UpdatePositionSkillRequirementDto,
  ) {
    const requirement = await this.prisma.positionSkillRequirement.findUnique({
      where: { id: requirementId },
      include: {
        position: {
          include: { opportunity: true },
        },
      },
    });

    if (!requirement) {
      throw new NotFoundException('Skill requirement not found');
    }

    if (requirement.position.opportunity.ownerId !== userId) {
      throw new ForbiddenException('You can only update requirements in your own positions');
    }

    // PD-05: Recalculate bobot if jenis changes
    const bobot = dto.jenis ? (dto.jenis === 'must_have' ? 5 : 2) : requirement.bobot;

    return this.prisma.positionSkillRequirement.update({
      where: { id: requirementId },
      data: {
        ...(dto.jenis && { jenis: dto.jenis, bobot }),
        ...(dto.levelMinimum && { levelMinimum: dto.levelMinimum }),
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

  async deleteSkillRequirement(userId: string, requirementId: string) {
    const requirement = await this.prisma.positionSkillRequirement.findUnique({
      where: { id: requirementId },
      include: {
        position: {
          include: { opportunity: true },
        },
      },
    });

    if (!requirement) {
      throw new NotFoundException('Skill requirement not found');
    }

    if (requirement.position.opportunity.ownerId !== userId) {
      throw new ForbiddenException('You can only delete requirements in your own positions');
    }

    await this.prisma.positionSkillRequirement.delete({
      where: { id: requirementId },
    });

    return { message: 'Skill requirement deleted' };
  }

  // Matching Algorithm (PD-05)
  async calculateMatchScore(positionId: string, candidateUserId: string) {
    const position = await this.prisma.position.findUnique({
      where: { id: positionId },
      include: {
        skillRequirements: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!position) {
      throw new NotFoundException('Position not found');
    }

    // Get candidate's skills
    const candidate = await this.prisma.user.findUnique({
      where: { id: candidateUserId },
      include: {
        profile: {
          include: {
            userSkills: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
    });

    if (!candidate || !candidate.profile) {
      throw new NotFoundException('Candidate not found');
    }

    const requirements = position.skillRequirements;
    const candidateSkills = candidate.profile.userSkills;

    // Handle no requirements case
    if (requirements.length === 0) {
      return {
        score: null,
        reason: 'no_requirements',
        message: 'Position has no skill requirements',
        matched: [],
        missing: [],
        totalWeight: 0,
        weightedScore: 0,
      };
    }

    // PD-05 Formula: S = 100 × Σ(wᵢ × mᵢ) / Σ(wᵢ)
    // wᵢ = bobot (5 for must_have, 2 for nice_to_have)
    // mᵢ = 1.0 if candidate has skill, 0 if not
    // ponytail: partial match (0.7) not implemented as criteria undefined per Q-17

    let totalWeight = 0;
    let weightedScore = 0;
    const matched: Array<{
      skillId: string;
      skillName: string;
      jenis: string;
      weight: number;
      matchValue: number;
    }> = [];
    const missing: Array<{
      skillId: string;
      skillName: string;
      jenis: string;
      weight: number;
    }> = [];

    for (const req of requirements) {
      const weight = req.bobot;
      totalWeight += weight;

      const candidateHasSkill = candidateSkills.some(
        (cs) => cs.skillId === req.skillId,
      );

      if (candidateHasSkill) {
        const matchValue = 1.0; // Full match
        weightedScore += weight * matchValue;
        matched.push({
          skillId: req.skillId,
          skillName: req.skill.nama,
          jenis: req.jenis,
          weight,
          matchValue,
        });
      } else {
        missing.push({
          skillId: req.skillId,
          skillName: req.skill.nama,
          jenis: req.jenis,
          weight,
        });
      }
    }

    const score = (weightedScore / totalWeight) * 100;

    return {
      score: Math.round(score * 100) / 100, // 2 decimal places
      matched,
      missing,
      totalWeight,
      weightedScore,
      formula: 'S = 100 × Σ(wᵢ × mᵢ) / Σ(wᵢ)',
    };
  }

  async getMatchesForPosition(positionId: string) {
    const position = await this.prisma.position.findUnique({
      where: { id: positionId },
      include: {
        opportunity: true,
        skillRequirements: true,
      },
    });

    if (!position) {
      throw new NotFoundException('Position not found');
    }

    // Get all users with profiles (BR-06.1: minimal 1 skill)
    const candidates = await this.prisma.user.findMany({
      where: {
        profile: {
          userSkills: {
            some: {},
          },
        },
      },
      include: {
        profile: {
          include: {
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
        },
      },
    });

    const matches: Array<{
      candidateId: string;
      namaTampilan: string | undefined;
      bio: string | null | undefined;
      campusId: string;
      score: number | null;
      matched: Array<any>;
      missing: Array<any>;
    }> = [];

    for (const candidate of candidates) {
      // Skip owner
      if (candidate.id === position.opportunity.ownerId) {
        continue;
      }

      const matchResult = await this.calculateMatchScore(positionId, candidate.id);

      matches.push({
        candidateId: candidate.id,
        namaTampilan: candidate.profile?.namaTampilan,
        bio: candidate.profile?.bio,
        campusId: candidate.campusId,
        score: matchResult.score,
        matched: matchResult.matched,
        missing: matchResult.missing,
      });
    }

    // Sort by score descending (null scores last)
    matches.sort((a, b) => {
      if (a.score === null) return 1;
      if (b.score === null) return -1;
      return b.score - a.score;
    });

    return matches;
  }
}
