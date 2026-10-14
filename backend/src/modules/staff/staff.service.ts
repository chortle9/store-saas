import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './staff.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,
  ) {}

  async findAll(tenantId: number) {
    return this.staffRepo.find({
      where: { tenantId, status: 1 },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(tenantId: number, id: number) {
    const staff = await this.staffRepo.findOne({ where: { id, tenantId } });
    if (!staff) throw new NotFoundException('员工不存在');
    return staff;
  }

  async create(tenantId: number, data: Partial<Staff>) {
    const staff = this.staffRepo.create({ ...data, tenantId });
    return this.staffRepo.save(staff);
  }

  async update(tenantId: number, id: number, data: Partial<Staff>) {
    const staff = await this.findOne(tenantId, id);
    Object.assign(staff, data);
    return this.staffRepo.save(staff);
  }

  async remove(tenantId: number, id: number) {
    await this.staffRepo.update({ id, tenantId }, { status: 0 });
    return { success: true };
  }
}
