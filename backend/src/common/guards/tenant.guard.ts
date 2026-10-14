import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      throw new ForbiddenException('用户信息缺失');
    }

    // 平台管理员（isPlatform=true）跨租户，不强制 tenantId
    if (user.isPlatform) {
      return true;
    }

    if (!user.tenantId) {
      throw new ForbiddenException('租户信息缺失');
    }

    // 将 tenantId 注入请求对象，后续 service 层自动使用
    request.tenantId = user.tenantId;
    return true;
  }
}
