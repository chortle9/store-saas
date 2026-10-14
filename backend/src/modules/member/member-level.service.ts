import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberLevel } from './member-level.entity';

@Injectable()
export class MemberLevelService {
  constructor(
    @InjectRepository(MemberLevel)
    private levelRepo: Repository<MemberLevel>,
  ) {}

  async findAll(tenantId: number) {
    return this.levelRepo.find({ where: { tenantId }, order: { level: 'ASC' } });
  }

  async create(tenantId: number, data: Partial<MemberLevel>) {
    const level = this.levelRepo.create({ ...data, tenantId });
    return this.levelRepo.save(level);
  }

  async update(tenantId: number, id: number, data: Partial<MemberLevel>) {
    await this.levelRepo.update({ id, tenantId }, data);
    return this.levelRepo.findOne({ where: { id, tenantId } });
  }

  async delete(tenantId: number, id: number) {
    await this.levelRepo.delete({ id, tenantId });
    return { success: true };
  }
}
