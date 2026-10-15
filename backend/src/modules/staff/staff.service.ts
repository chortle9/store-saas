import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Staff } from './staff.entity';
import { User } from './user.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findAll(tenantId: number) {
    const staffs = await this.staffRepo.find({
      where: { tenantId, status: 1 },
      order: { createdAt: 'DESC' },
    });

    // 同时查询每个员工对应的登录账号信息
    const users = await this.userRepo.find({ where: { tenantId } });

    // 把user信息合并到staff里
    return staffs.map(staff => {
      // 简单通过realName匹配（实际应该用staffId关联，先这么用）
      const user = users.find(u => u.realName === staff.name);
      return {
        ...staff,
        username: user?.username,
        role: user?.role,
        menus: user?.menus,
      };
    });
  }

  async findOne(tenantId: number, id: number) {
    const staff = await this.staffRepo.findOne({ where: { id, tenantId } });
    if (!staff) throw new NotFoundException('员工不存在');
    return staff;
  }

  async create(tenantId: number, data: Partial<Staff> & { username?: string; password?: string; role?: string }) {
    const staff = this.staffRepo.create({ ...data, tenantId });
    const savedStaff = await this.staffRepo.save(staff);

    // 如果传了登录账号，同时创建user账号
    if (data.username && data.password) {
      await this.userRepo.save({
        tenantId,
        username: data.username,
        password: await bcrypt.hash(data.password, 10),
        realName: data.name,
        phone: data.phone,
        role: data.role || '店员',
        status: 1,
      });
    }

    return savedStaff;
  }

  async update(tenantId: number, id: number, data: Partial<Staff> & { username?: string; password?: string; role?: string; menus?: string[] }) {
    const staff = await this.findOne(tenantId, id);
    Object.assign(staff, data);
    const savedStaff = await this.staffRepo.save(staff);

    // 如果传了登录信息，同时更新user账号
    if (data.username) {
      const user = await this.userRepo.findOne({ where: { tenantId, username: data.username } });
      if (user) {
        user.realName = data.name;
        user.phone = data.phone;
        if (data.role) user.role = data.role;
        if (data.menus) user.menus = data.menus;
        if (data.password) user.password = await bcrypt.hash(data.password, 10);
        await this.userRepo.save(user);
      }
    }

    return savedStaff;
  }

  async remove(tenantId: number, id: number) {
    await this.staffRepo.update({ id, tenantId }, { status: 0 });
    return { success: true };
  }
}
