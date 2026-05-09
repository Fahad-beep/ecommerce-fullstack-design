import { SetMetadata } from '@nestjs/common';
import { AUTH_ROLE_KEY } from './auth.constants';

export const AdminRoute = () => SetMetadata(AUTH_ROLE_KEY, 'admin');
