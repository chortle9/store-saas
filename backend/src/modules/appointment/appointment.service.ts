import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Appointment } from './appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  /**
   * 预约列表（按日期范围）
   */
  async findAll(tenantId: number, query: { startDate?: string; endDate?: string; status?: string; page?: number; pageSize?: number }) {
    const { startDate, endDate, status, page = 1, pageSize = 50 } = query;
    const where: any = { tenantId };

    if (status) where.status = status;
    if (startDate && endDate) {
      where.appointmentTime = Between(new Date(startDate), new Date(endDate));
    }

    const [list, total] = await this.appointmentRepo.findAndCount({
      where,
      order: { appointmentTime: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { list, total, page, pageSize };
  }

  /**
   * 今日预约
   */
  async getTodayAppointments(tenantId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.appointmentRepo.find({
      where: {
        tenantId,
        appointmentTime: Between(today, tomorrow),
      },
      order: { appointmentTime: 'ASC' },
    });
  }

  /**
   * 预约详情
   */
  async findOne(tenantId: number, id: number) {
    const appointment = await this.appointmentRepo.findOne({ where: { id, tenantId } });
    if (!appointment) throw new NotFoundException('预约不存在');
    return appointment;
  }

  /**
   * 创建预约
   */
  async create(tenantId: number, data: Partial<Appointment>) {
    const appointment = this.appointmentRepo.create({ ...data, tenantId });
    return this.appointmentRepo.save(appointment);
  }

  /**
   * 更新预约状态
   */
  async updateStatus(tenantId: number, id: number, status: string, remark?: string) {
    const appointment = await this.findOne(tenantId, id);
    appointment.status = status;
    if (remark) appointment.cancelReason = remark;
    return this.appointmentRepo.save(appointment);
  }
}
