import '../config/load-env';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AuthPayload, AuthTokens, AuthUser } from './auth.types';

const adminUser = {
  sub: 'admin-1',
  name: process.env.ADMIN_NAME || 'Site Admin',
  email: process.env.ADMIN_EMAIL || 'admin@shop.dev',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  role: 'admin' as const,
};

@Injectable()
export class AuthService {
  private readonly accessSecret =
    process.env.JWT_ACCESS_SECRET || 'dev-access-secret';
  private readonly refreshSecret =
    process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';

  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<AuthTokens> {
    if (
      loginDto.email !== adminUser.email ||
      loginDto.password !== adminUser.password
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens({
      sub: adminUser.sub,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
    });
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const payload = await this.verifyRefreshToken(refreshToken);
    return this.issueTokens({
      sub: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    });
  }

  async verifyAccessToken(token: string): Promise<AuthPayload> {
    const payload = await this.jwtService.verifyAsync<AuthPayload>(token, {
      secret: this.accessSecret,
    });

    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    return payload;
  }

  async verifyRefreshToken(token: string): Promise<AuthPayload> {
    const payload = await this.jwtService.verifyAsync<AuthPayload>(token, {
      secret: this.refreshSecret,
    });

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    return payload;
  }

  async getProfile(token: string): Promise<AuthUser> {
    const payload = await this.verifyAccessToken(token);
    return {
      sub: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  }

  private async issueTokens(user: AuthUser): Promise<AuthTokens> {
    const accessPayload: AuthPayload = { ...user, type: 'access' };
    const refreshPayload: AuthPayload = { ...user, type: 'refresh' };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.accessSecret,
        expiresIn: '2h',
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.refreshSecret,
        expiresIn: '7d',
      }),
    ]);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
