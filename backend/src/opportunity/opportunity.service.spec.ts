import { Test, TestingModule } from '@nestjs/testing';
import { OpportunityService } from './opportunity.service';
import { PrismaService } from '../prisma.service';

jest.mock('../prisma.service', () => ({ PrismaService: class PrismaService {} }));

describe('OpportunityService - Matching Algorithm', () => {
  let service: OpportunityService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpportunityService,
        {
          provide: PrismaService,
          useValue: {
            position: { findUnique: jest.fn() },
            user: { findUnique: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<OpportunityService>(OpportunityService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should calculate 100% match when candidate has all must_have skills', async () => {
    // Arrange: Position requires React (must_have, weight=5) and TypeScript (must_have, weight=5)
    const mockPosition = {
      id: 'pos1',
      skillRequirements: [
        { skillId: 'skill1', bobot: 5, jenis: 'must_have', skill: { nama: 'React' } },
        { skillId: 'skill2', bobot: 5, jenis: 'must_have', skill: { nama: 'TypeScript' } },
      ],
    };

    const mockCandidate = {
      id: 'user1',
      profile: {
        userSkills: [
          { skillId: 'skill1', skill: { nama: 'React' } },
          { skillId: 'skill2', skill: { nama: 'TypeScript' } },
        ],
      },
    };

    jest.spyOn(prisma.position, 'findUnique').mockResolvedValue(mockPosition as any);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockCandidate as any);

    // Act
    const result = await service.calculateMatchScore('pos1', 'user1');

    // Assert: S = 100 × (5×1.0 + 5×1.0) / (5 + 5) = 100 × 10 / 10 = 100
    expect(result.score).toBe(100);
    expect(result.matched.length).toBe(2);
    expect(result.missing.length).toBe(0);
  });

  it('should calculate 0% match when candidate has no required skills', async () => {
    const mockPosition = {
      id: 'pos1',
      skillRequirements: [
        { skillId: 'skill1', bobot: 5, jenis: 'must_have', skill: { nama: 'React' } },
      ],
    };

    const mockCandidate = {
      id: 'user1',
      profile: {
        userSkills: [
          { skillId: 'skill999', skill: { nama: 'Python' } }, // Different skill
        ],
      },
    };

    jest.spyOn(prisma.position, 'findUnique').mockResolvedValue(mockPosition as any);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockCandidate as any);

    const result = await service.calculateMatchScore('pos1', 'user1');

    // S = 100 × (5×0) / 5 = 0
    expect(result.score).toBe(0);
    expect(result.matched.length).toBe(0);
    expect(result.missing.length).toBe(1);
  });

  it('should apply PD-05 fixed weights: must_have=5, nice_to_have=2', async () => {
    // Position: React (must, w=5), Docker (nice, w=2)
    // Candidate: has React only
    const mockPosition = {
      id: 'pos1',
      skillRequirements: [
        { skillId: 'skill1', bobot: 5, jenis: 'must_have', skill: { nama: 'React' } },
        { skillId: 'skill2', bobot: 2, jenis: 'nice_to_have', skill: { nama: 'Docker' } },
      ],
    };

    const mockCandidate = {
      id: 'user1',
      profile: {
        userSkills: [
          { skillId: 'skill1', skill: { nama: 'React' } },
        ],
      },
    };

    jest.spyOn(prisma.position, 'findUnique').mockResolvedValue(mockPosition as any);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockCandidate as any);

    const result = await service.calculateMatchScore('pos1', 'user1');

    // S = 100 × (5×1.0 + 2×0) / (5 + 2) = 100 × 5 / 7 ≈ 71.43
    expect(result.score).toBeCloseTo(71.43, 2);
    expect(result.totalWeight).toBe(7);
    expect(result.weightedScore).toBe(5);
  });

  it('does not grant credit below the minimum required level', async () => {
    jest.spyOn(prisma.position, 'findUnique').mockResolvedValue({
      id: 'p', skillRequirements: [{ skillId: 'react', bobot: 5, jenis: 'must_have', levelMinimum: 3, skill: { nama: 'React' } }],
    } as any);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'u', profile: { userSkills: [{ skillId: 'react', level: 1 }] },
    } as any);
    const result = await service.calculateMatchScore('p', 'u');
    expect(result.score).toBe(0);
    expect(result.missing).toHaveLength(1);
  });

  it('should return null score with reason when position has no requirements', async () => {
    const mockPosition = {
      id: 'pos1',
      skillRequirements: [], // No requirements
    };

    const mockCandidate = {
      id: 'user1',
      profile: { userSkills: [] },
    };

    jest.spyOn(prisma.position, 'findUnique').mockResolvedValue(mockPosition as any);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockCandidate as any);

    const result = await service.calculateMatchScore('pos1', 'user1');

    expect(result.score).toBeNull();
    expect(result.reason).toBe('no_requirements');
    expect(result.message).toContain('no skill requirements');
  });
});
