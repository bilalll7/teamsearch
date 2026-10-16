import { createHash } from 'crypto';
import { AuthService } from './auth.service';
jest.mock('../prisma.service', () => ({
  PrismaService: class PrismaService {},
}));
jest.mock('@nestjs/config', () => ({ ConfigService: class ConfigService {} }));
jest.mock('@nestjs/jwt', () => ({ JwtService: class JwtService {} }));

describe('Session flow', () => {
  let db: any;
  let service: AuthService;
  const stored = {
    id: 'r',
    userId: 'u',
    familyId: 'family',
    revokedAt: null,
    expiresAt: new Date(Date.now() + 100000),
  };
  beforeEach(() => {
    db = {
      refreshToken: {
        findUnique: jest.fn().mockResolvedValue(stored),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        create: jest.fn().mockResolvedValue({}),
      },
    };
    db.$transaction = (fn: any) => fn(db);
    service = new AuthService(
      db,
      { sign: jest.fn().mockReturnValue('new-token') } as any,
      { get: jest.fn().mockReturnValue('secret') } as any,
    );
  });
  it('looks up the stable token digest and rotates within the family', async () => {
    const tokens = await service.refresh('u', 'old-token');
    expect(tokens.refreshToken).toBe('new-token');
    expect(db.refreshToken.findUnique).toHaveBeenCalledWith({
      where: {
        tokenHash: createHash('sha256').update('old-token').digest('hex'),
      },
    });
    expect(db.refreshToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ familyId: 'family', userId: 'u' }),
      }),
    );
  });
  it('revokes the family when a consumed token is reused', async () => {
    db.refreshToken.findUnique.mockResolvedValue({
      ...stored,
      revokedAt: new Date(),
    });
    await expect(service.refresh('u', 'old-token')).rejects.toThrow(
      'Session expired',
    );
    expect(db.refreshToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { familyId: 'family' } }),
    );
    expect(db.refreshToken.create).not.toHaveBeenCalled();
  });
  it('refuses rotation if another request already consumed the token', async () => {
    db.refreshToken.updateMany.mockResolvedValue({ count: 0 });
    await expect(service.refresh('u', 'old-token')).rejects.toThrow(
      'Session expired',
    );
    expect(db.refreshToken.create).not.toHaveBeenCalled();
  });
  it('logout revokes the current session family', async () => {
    await service.logout('u', 'old-token');
    expect(db.refreshToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'u', familyId: 'family' } }),
    );
  });
});
