import { OpportunityService } from './opportunity.service';
jest.mock('../prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('Adding positions to existing opportunities', () => {
  const dto = {
    nama: 'Developer',
    jumlahSlot: 1,
    requirements: [{ skillId: 'react', jenis: 'must_have', levelMinimum: 2 }],
  };
  let db: any;
  let service: OpportunityService;
  beforeEach(() => {
    db = {
      opportunity: {
        findUnique: jest.fn().mockResolvedValue({ ownerId: 'owner' }),
      },
      skill: { count: jest.fn().mockResolvedValue(1) },
      position: { create: jest.fn().mockResolvedValue({ id: 'p' }) },
    };
    service = new OpportunityService(db);
  });
  it('creates the position and its requirements in one nested write', async () => {
    await service.createPosition('owner', 'o', dto);
    expect(db.position.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        opportunityId: 'o',
        skillRequirements: {
          create: [
            { skillId: 'react', jenis: 'must_have', levelMinimum: 2, bobot: 5 },
          ],
        },
      }),
    });
  });
  it('does not create a position for an inactive skill', async () => {
    db.skill.count.mockResolvedValue(0);
    await expect(service.createPosition('owner', 'o', dto)).rejects.toThrow(
      'tidak tersedia',
    );
    expect(db.position.create).not.toHaveBeenCalled();
  });
  it('requires the opportunity owner', async () => {
    await expect(service.createPosition('other', 'o', dto)).rejects.toThrow(
      'own opportunities',
    );
    expect(db.position.create).not.toHaveBeenCalled();
  });
});
