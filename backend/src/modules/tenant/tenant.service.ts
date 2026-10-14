import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepo: Repository<Tenant>,
  ) {}

  async findOne(id: number) {
    return this.tenantRepo.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Tenant>) {
    await this.tenantRepo.update(id, data);
    return this.findOne(id);
  }
}
