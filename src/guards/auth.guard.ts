import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';

export type AuthPayload = {
  email: string;
  sub: string;
};

export type Ctx = {
  user: AuthPayload;
  req: Request;
};

export const IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private ref: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);

    const isPublic = this.ref.getAllAndOverride<boolean>(IS_PUBLIC, [
      ctx.getHandler(),
    ]);
    if (isPublic) return true;
    const gqlContext = ctx.getContext<Ctx>();
    const token = this.extractTokenFromHeader(gqlContext.req);
    if (!token)
      throw new UnauthorizedException({
        mesage: 'Please login. Token not found',
      });
    try {
      const payload = await this.jwtService.verifyAsync<AuthPayload>(token);
      gqlContext.user = payload;
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException({ message: 'Token expired' });
      throw new UnauthorizedException({
        message: 'Please authenticate. Inavlid token',
      });
    }

    return true;
  }

  extractTokenFromHeader(req: Request): string | undefined {
    const authHeader = req.headers.authorization;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ') || [];
    return type === 'Bearer' ? token : undefined;
  }
}
