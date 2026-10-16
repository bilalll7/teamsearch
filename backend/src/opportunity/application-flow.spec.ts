import { OpportunityService } from './opportunity.service';
jest.mock('../prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('Application decisions', () => {
  let tx: any;
  let service: OpportunityService;
  const app = {
    id: 'a',
    applicantId: 'candidate',
    positionId: 'p',
    status: 'pending',
    position: {
      nama: 'Developer',
      opportunityId: 'o',
      jumlahSlot: 1,
      opportunity: { ownerId: 'owner' },
    },
  };
  beforeEach(() => {
    tx = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      application: {
        findUnique: jest.fn().mockResolvedValue(app),
        count: jest.fn().mockResolvedValue(0),
        update: jest.fn().mockResolvedValue({ ...app, status: 'accepted' }),
      },
      teamMembership: {
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn().mockResolvedValue({}),
      },
    };
    service = new OpportunityService({
      $transaction: (fn: any) => fn(tx),
    } as any);
  });
  it('accepts within a transaction and creates membership', async () => {
    await service.updateApplicationStatus('owner', 'a', { status: 'accepted' });
    expect(tx.$queryRaw).toHaveBeenCalledTimes(1);
    expect(tx.teamMembership.upsert).toHaveBeenCalledTimes(1);
    expect(tx.application.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'accepted' }),
      }),
    );
  });
  it('rejects acceptance when the position is full without changing membership', async () => {
    tx.application.count.mockResolvedValue(1);
    await expect(
      service.updateApplicationStatus('owner', 'a', { status: 'accepted' }),
    ).rejects.toThrow('Slot posisi penuh');
    expect(tx.teamMembership.upsert).not.toHaveBeenCalled();
    expect(tx.application.update).not.toHaveBeenCalled();
  });
  it('does not reopen a decided application', async () => {
    tx.application.findUnique.mockResolvedValue({ ...app, status: 'accepted' });
    await expect(
      service.updateApplicationStatus('owner', 'a', { status: 'rejected' }),
    ).rejects.toThrow('sudah diputuskan');
    expect(tx.application.update).not.toHaveBeenCalled();
  });
  it('requires ownership for decisions', async () => {
    await expect(
      service.updateApplicationStatus('stranger', 'a', { status: 'accepted' }),
    ).rejects.toThrow('Only the owner');
  });
  it('allows the applicant to withdraw without creating membership', async () => {
    await service.updateApplicationStatus('candidate', 'a', {
      status: 'withdrawn',
    });
    expect(tx.teamMembership.upsert).not.toHaveBeenCalled();
    expect(tx.application.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { status: 'withdrawn', decidedAt: null },
      }),
    );
  });
  it('prevents accepting the same person into a second position', async () => {
    tx.teamMembership.findUnique.mockResolvedValue({
      status: 'aktif',
      positionId: 'other',
    });
    await expect(
      service.updateApplicationStatus('owner', 'a', { status: 'accepted' }),
    ).rejects.toThrow('posisi lain');
    expect(tx.application.update).not.toHaveBeenCalled();
  });
});
