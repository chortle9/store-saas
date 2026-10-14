import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantWebsite } from './website.entity';

@Injectable()
export class WebsiteService {
  constructor(
    @InjectRepository(TenantWebsite)
    private websiteRepo: Repository<TenantWebsite>,
  ) {}

  async getWebsite(tenantId: number) {
    let website = await this.websiteRepo.findOne({ where: { tenantId } });
    if (!website) {
      // 自动创建默认网站
      website = this.websiteRepo.create({
        tenantId,
        title: '我的店铺',
        subtitle: '欢迎光临',
        enableBooking: 1,
        primaryColor: '#1a1a2e',
        accentColor: '#c9a96e',
      });
      website = await this.websiteRepo.save(website);
    }
    return website;
  }

  async updateWebsite(tenantId: number, data: Partial<TenantWebsite>) {
    let website = await this.websiteRepo.findOne({ where: { tenantId } });
    
    // 处理数组字段：转成JSON字符串
    if (Array.isArray(data.banners)) {
      data.banners = JSON.stringify(data.banners);
    }
    if (Array.isArray(data.environmentImages)) {
      data.environmentImages = JSON.stringify(data.environmentImages);
    }
    if (Array.isArray(data.testimonials)) {
      data.testimonials = JSON.stringify(data.testimonials);
    }
    
    if (!website) {
      website = this.websiteRepo.create({ tenantId, ...data });
    } else {
      Object.assign(website, data);
    }
    return this.websiteRepo.save(website);
  }

  async getPublicWebsite(tenantId: number) {
    const website = await this.websiteRepo.findOne({ where: { tenantId } });
    if (!website) return null;
    // 同时返回店铺名、服务项目
    return {
      ...website,
    };
  }
}
