import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const jwtService = {
    signAsync: jest
      .fn()
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token')
      .mockResolvedValueOnce('next-access-token')
      .mockResolvedValueOnce('next-refresh-token'),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('issues tokens for the demo admin account', async () => {
    const result = await service.login({
      email: process.env.ADMIN_EMAIL ?? 'admin@shop.dev',
      password: process.env.ADMIN_PASSWORD ?? 'admin123',
    });

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(result.user.role).toBe('admin');
  });

  it('refreshes a valid refresh token', async () => {
    jwtService.verifyAsync.mockResolvedValueOnce({
      sub: 'admin-1',
      name: 'Site Admin',
      email: 'admin@shop.dev',
      role: 'admin',
      type: 'refresh',
    });

    const result = await service.refresh('refresh-token');

    expect(result.accessToken).toBe('next-access-token');
    expect(result.refreshToken).toBe('next-refresh-token');
  });
});
