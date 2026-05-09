import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_ROLE_KEY } from './auth.constants';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<string>(
      AUTH_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
      user?: { role?: string };
    }>();

    const authorization = request.headers.authorization;
    const token = Array.isArray(authorization)
      ? authorization[0]
      : authorization?.startsWith('Bearer ')
        ? authorization.slice(7)
        : undefined;

    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    const payload = await this.authService.verifyAccessToken(token);
    request.user = payload;

    if (requiredRole && payload.role !== requiredRole) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
