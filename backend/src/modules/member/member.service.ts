import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThan } from 'typeorm';
import { Member } from './member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
  ) {}

  /**
   * 会员列表（分页+搜索）
   */
  async findAll(tenantId: number, query: { page?: number; pageSize?: number; keyword?: string; tag?: string }) {
    const { page = 1, pageSize = 20, keyword, tag } = query;
    const where: any = { tenantId };

    if (keyword) {
      where.name = Like(`%${keyword}%`);
    }

    const [list, total] = await this.memberRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { list, total, page, pageSize };
  }

  /**
   * 会员详情
   */
  async findOne(tenantId: number, id: number) {
    const member = await this.memberRepo.findOne({ where: { id, tenantId } });
    if (!member) throw new NotFoundException('会员不存在');
    return member;
  }

  /**
   * 新增会员
   */
  async create(tenantId: number, data: Partial<Member>) {
    const member = this.memberRepo.create({ ...data, tenantId });
    return this.memberRepo.save(member);
  }

  /**
   * 更新会员
   */
  async update(tenantId: number, id: number, data: Partial<Member>) {
    const member = await this.findOne(tenantId, id);
    Object.assign(member, data);
    return this.memberRepo.save(member);
  }

  /**
   * 删除会员（软删除：标记黑名单）
   */
  async remove(tenantId: number, id: number) {
    await this.update(tenantId, id, { status: 0 });
    return { success: true };
  }

  /**
   * 待回访会员列表
   */
  async getFollowList(tenantId: number) {
    return this.memberRepo.find({
      where: {
        tenantId,
        nextFollowAt: MoreThan(new Date()),
        status: 1,
      },
      order: { nextFollowAt: 'ASC' },
      take: 50,
    });
  }
}
