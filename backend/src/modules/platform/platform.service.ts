import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Tenant } from '../tenant/tenant.entity';
import { User } from '../staff/user.entity';
import { Member } from '../member/member.entity';
import { Order } from '../order/order.entity';

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepo: Repository<Tenant>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    private jwtService: JwtService,
  ) {}

  /**
   * 平台管理员登录
   * 只有 role = super_admin 的用户才能登录平台后台
   */
  async login(username: string, password: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('账号不存在');
    }

    // 平台管理员必须是 super_admin 角色
    if (user.role !== 'super_admin') {
      throw new UnauthorizedException('无权登录平台管理后台');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('密码错误');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      tenantId: user.tenantId,
      isPlatform: true,
    };

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        realName: user.realName,
      },
    };
  }

  /**
   * 全平台统计数据
   */
  async getPlatformStats() {
    // 总店铺数
    const totalTenants = await this.tenantRepo.count();
    // 正常营业店铺
    const activeTenants = await this.tenantRepo.count({ where: { status: 1 } });
    // 总会员数（跨所有租户）
    const totalMembers = await this.memberRepo.count();
    // 总营收（所有订单）
    const totalRevenueResult = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.payAmount)', 'total')
      .where('order.status = :status', { status: 'completed' })
      .getRawOne();

    // 本月新增店铺
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const newTenantsThisMonth = await this.tenantRepo
      .createQueryBuilder('tenant')
      .where('tenant.createdAt >= :start', { start: monthStart })
      .getCount();

    return {
      totalTenants,
      activeTenants,
      totalMembers,
      totalRevenue: parseFloat(totalRevenueResult.total || 0),
      newTenantsThisMonth,
    };
  }

  /**
   * 所有租户列表（分页）
   */
  async getTenantList(query: { page?: number; pageSize?: number; keyword?: string }) {
    const { page = 1, pageSize = 20, keyword } = query;
    const where: any = {};

    if (keyword) {
      where.name = `LIKE '%${keyword}%'`;
    }

    const [list, total] = await this.tenantRepo
      .createQueryBuilder('tenant')
      .where(where)
      .orderBy('tenant.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total, page, pageSize };
  }

  /**
   * 开通新店铺（创建租户+管理员账号）
   */
  async createTenant(data: {
    name: string;
    phone?: string;
    address?: string;
    adminUsername: string;
    adminPassword: string;
    adminName: string;
    plan: string;
    validDays: number;
  }) {
    // 1. 创建租户
    const tenant = await this.tenantRepo.save({
      name: data.name,
      phone: data.phone,
      address: data.address,
      plan: data.plan,
      planExpireAt: new Date(Date.now() + data.validDays * 24 * 60 * 60 * 1000),
      status: 1,
    });

    // 2. 创建管理员账号
    const hashedPassword = await bcrypt.hash(data.adminPassword, 10);
    const admin = await this.userRepo.save({
      tenantId: tenant.id,
      username: data.adminUsername,
      password: hashedPassword,
      realName: data.adminName,
      role: 'admin',
      status: 1,
    });

    return {
      tenant,
      admin: {
        id: admin.id,
        username: admin.username,
        realName: admin.realName,
      },
    };
  }

  /**
   * 更新租户套餐/到期时间
   */
  async updateTenant(id: number, data: { plan?: string; validDays?: number; status?: number }) {
    const tenant = await this.tenantRepo.findOne({ where: { id } });
    if (!tenant) throw new NotFoundException('店铺不存在');

    if (data.plan) tenant.plan = data.plan;
    if (data.status !== undefined) tenant.status = data.status;
    if (data.validDays) {
      // 从当前到期时间续期，如果已过期则从今天开始
      const baseDate = tenant.planExpireAt && tenant.planExpireAt > new Date()
        ? tenant.planExpireAt
        : new Date();
      tenant.planExpireAt = new Date(baseDate.getTime() + data.validDays * 24 * 60 * 60 * 1000);
    }

    return this.tenantRepo.save(tenant);
  }

  /**
   * 店铺详情（含数据概览）
   */
  async getTenantDetail(id: number) {
    const tenant = await this.tenantRepo.findOne({ where: { id } });
    if (!tenant) throw new NotFoundException('店铺不存在');

    // 该店铺的会员数
    const memberCount = await this.memberRepo.count({ where: { tenantId: id } });
    // 该店铺的营收
    const revenueResult = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.payAmount)', 'total')
      .where('order.tenantId = :tenantId', { tenantId: id })
      .andWhere('order.status = :status', { status: 'completed' })
      .getRawOne();

    return {
      ...tenant,
      memberCount,
      revenue: parseFloat(revenueResult.total || 0),
    };
  }
}
