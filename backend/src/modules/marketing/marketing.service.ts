import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './coupon.entity';
import { MemberCoupon } from './member-coupon.entity';

@Injectable()
export class MarketingService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepo: Repository<Coupon>,
    @InjectRepository(MemberCoupon)
    private memberCouponRepo: Repository<MemberCoupon>,
  ) {}

  // ========== 优惠券模板 ==========
  async findAllCoupons(tenantId: number) {
    return this.couponRepo.find({ where: { tenantId } });
  }

  async createCoupon(tenantId: number, data: Partial<Coupon>) {
    const coupon = this.couponRepo.create({ ...data, tenantId });
    return this.couponRepo.save(coupon);
  }

  async updateCoupon(tenantId: number, id: number, data: Partial<Coupon>) {
    await this.couponRepo.update({ id, tenantId }, data);
    return this.couponRepo.findOne({ where: { id, tenantId } });
  }

  // ========== 会员领券 ==========
  async receiveCoupon(tenantId: number, memberId: number, couponId: number) {
    const coupon = await this.couponRepo.findOne({ where: { id: couponId, tenantId } });
    if (!coupon) throw new NotFoundException('优惠券不存在');

    const now = new Date();
    const expireDate = new Date(now);
    expireDate.setDate(expireDate.getDate() + coupon.validDays);

    const memberCoupon = this.memberCouponRepo.create({
      tenantId,
      memberId,
      couponId: coupon.id,
      couponName: coupon.name,
      receivedAt: now,
      expireAt: expireDate,
      status: 'unused',
    });

    coupon.receivedCount += 1;
    await this.couponRepo.save(coupon);

    return this.memberCouponRepo.save(memberCoupon);
  }

  async getMemberCoupons(tenantId: number, memberId: number, status?: string) {
    const where: any = { tenantId, memberId };
    if (status) where.status = status;
    return this.memberCouponRepo.find({ where, order: { createdAt: 'DESC' } });
  }
}
