import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { StaffSchedule } from './schedule.entity';
import { Staff } from './staff.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(StaffSchedule)
    private scheduleRepo: Repository<StaffSchedule>,
    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,
  ) {}

  /**
   * 获取某周的排班表
   */
  async getWeekSchedule(tenantId: number, weekStart: string) {
    // 计算这周的7天
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const schedules = await this.scheduleRepo.find({
      where: {
        tenantId,
        workDate: Between(start, end),
      },
    });

    const staffs = await this.staffRepo.find({ where: { tenantId } });

    // 按员工+日期组织
    const result = staffs.map(staff => {
      const days: any[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().slice(0, 10);
        const found = schedules.find(s => s.staffId === staff.id && s.workDate.toISOString().slice(0, 10) === dateStr);
        days.push({
          date: dateStr,
          status: found ? found.status : 'off',
          startTime: found ? found.startTime : '',
          endTime: found ? found.endTime : '',
        });
      }
      return {
        staffId: staff.id,
        staffName: staff.name,
        position: staff.position,
        days,
      };
    });

    return result;
  }

  /**
   * 保存排班
   */
  async saveSchedule(tenantId: number, data: { staffId: number; staffName: string; workDate: string; startTime: string; endTime: string; status: string }) {
    const existing = await this.scheduleRepo.findOne({
      where: {
        tenantId,
        staffId: data.staffId,
        workDate: new Date(data.workDate),
      },
    });

    if (existing) {
      existing.startTime = data.startTime;
      existing.endTime = data.endTime;
      existing.status = data.status;
      return this.scheduleRepo.save(existing);
    } else {
      const schedule = this.scheduleRepo.create({
        tenantId,
        ...data,
        workDate: new Date(data.workDate),
      });
      return this.scheduleRepo.save(schedule);
    }
  }

  /**
   * 批量复制上周排班
   */
  async copyLastWeek(tenantId: number, targetWeekStart: string) {
    const lastWeekStart = new Date(targetWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(lastWeekStart);
    lastWeekEnd.setDate(lastWeekEnd.getDate() + 6);

    const lastSchedules = await this.scheduleRepo.find({
      where: {
        tenantId,
        workDate: Between(lastWeekStart, lastWeekEnd),
      },
    });

    for (const s of lastSchedules) {
      const newDate = new Date(s.workDate);
      newDate.setDate(newDate.getDate() + 7);
      await this.saveSchedule(tenantId, {
        staffId: s.staffId,
        staffName: s.staffName,
        workDate: newDate.toISOString().slice(0, 10),
        startTime: s.startTime,
        endTime: s.endTime,
        status: s.status,
      });
    }

    return { success: true, message: '复制成功' };
  }
}
