import { Controller, Get, Post, Put, Delete, Body, Param, Req } from '@nestjs/common';
import { AutoRuleService } from './auto-rule.service';

@Controller('auto-rules')
export class AutoRuleController {
  constructor(private autoRuleService: AutoRuleService) {}

  // 规则列表
  @Get()
  findAll(@Req() req) {
    return this.autoRuleService.findAll(req.user.tenantId);
  }

  // 创建规则
  @Post()
  create(@Req() req, @Body() body) {
    return this.autoRuleService.create(req.user.tenantId, body);
  }

  // 更新规则
  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() body) {
    return this.autoRuleService.update(req.user.tenantId, +id, body);
  }

  // 删除规则
  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.autoRuleService.delete(req.user.tenantId, +id);
  }

  // 手动执行沉睡召回
  @Post('run-sleep-recall')
  runSleepRecall(@Req() req) {
    return this.autoRuleService.runSleepRecall(req.user.tenantId);
  }

  // 手动执行生日祝福
  @Post('run-birthday')
  runBirthday(@Req() req) {
    return this.autoRuleService.runBirthdayWish(req.user.tenantId);
  }
}
