import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../staff/user.entity';
import { Tenant } from '../tenant/tenant.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Tenant)
    private tenantRepo: Repository<Tenant>,
    private jwtService: JwtService,
  ) {}

  /**
   * 账号密码登录
   */
  async login(username: string, password: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user || user.status !== 1) {
      throw new UnauthorizedException('账号不存在或已禁用');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('密码错误');
    }

    // 检查租户是否正常
    const tenant = await this.tenantRepo.findOne({ where: { id: user.tenantId, status: 1 } });
    if (!tenant) {
      throw new UnauthorizedException('店铺账号已停用');
    }

    // 检查套餐是否过期
    if (tenant.planExpireAt && new Date() > tenant.planExpireAt) {
      throw new UnauthorizedException('套餐已过期，请续费后使用');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      realName: user.realName,
      role: user.role,
      tenantId: user.tenantId,
    };

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        realName: user.realName,
        role: user.role,
        tenantId: user.tenantId,
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        logo: tenant.logo,
        plan: tenant.plan,
        planExpireAt: tenant.planExpireAt,
      },
    };
  }

  /**
   * 获取当前用户信息
   */
  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('用户不存在');

    const tenant = await this.tenantRepo.findOne({ where: { id: user.tenantId } });

    return {
      id: user.id,
      username: user.username,
      realName: user.realName,
      role: user.role,
      phone: user.phone,
      tenantId: user.tenantId,
      tenant: tenant ? {
        id: tenant.id,
        name: tenant.name,
        logo: tenant.logo,
        address: tenant.address,
        phone: tenant.phone,
        businessHours: tenant.businessHours,
        plan: tenant.plan,
        planExpireAt: tenant.planExpireAt,
      } : null,
    };
  }
}
