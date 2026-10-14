<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="icon" style="background: linear-gradient(135deg, #667eea, #764ba2)">
            <el-icon><Money /></el-icon>
          </div>
          <div class="info">
            <div class="label">今日营收</div>
            <div class="value">¥{{ summary.todayRevenue || 0 }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="icon" style="background: linear-gradient(135deg, #f093fb, #f5576c)">
            <el-icon><Calendar /></el-icon>
          </div>
          <div class="info">
            <div class="label">今日预约</div>
            <div class="value">{{ summary.todayAppointments || 0 }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="icon" style="background: linear-gradient(135deg, #4facfe, #00f2fe)">
            <el-icon><User /></el-icon>
          </div>
          <div class="info">
            <div class="label">今日新增客户</div>
            <div class="value">{{ summary.todayNewMembers || 0 }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="icon" style="background: linear-gradient(135deg, #43e97b, #38f9d7)">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="info">
            <div class="label">总客户数</div>
            <div class="value">{{ summary.totalMembers || 0 }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 营收趋势图 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <div class="card">
          <h3 style="margin-bottom: 20px">近7天营收趋势</h3>
          <v-chart :option="chartOption" style="height: 350px" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card">
          <h3 style="margin-bottom: 20px">待办事项</h3>
          <div class="todo-list">
            <div class="todo-item">
              <el-tag type="warning">预约</el-tag>
              <span>今日 {{ summary.todayAppointments || 0 }} 个预约待处理</span>
            </div>
            <div class="todo-item">
              <el-tag type="danger">回访</el-tag>
              <span>有待回访客户待跟进</span>
            </div>
            <div class="todo-item">
              <el-tag type="info">卡到期</el-tag>
              <span>有客户卡项即将到期</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components'
import { getDashboardSummary } from '@/api/dashboard'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, TitleComponent])

const summary = ref<any>({})

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: summary.value.revenueTrend?.map((item: any) => item.date) || [],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: summary.value.revenueTrend?.map((item: any) => item.revenue) || [],
      type: 'line',
      smooth: true,
      areaStyle: {
        color: 'rgba(102, 126, 234, 0.3)',
      },
      lineStyle: {
        color: '#667eea',
      },
      itemStyle: {
        color: '#667eea',
      },
    },
  ],
}))

onMounted(async () => {
  try {
    const res = await getDashboardSummary()
    summary.value = res
  } catch (error) {
    console.error('获取仪表盘数据失败', error)
  }
})
</script>

<style scoped>
.stat-row {
  margin-bottom: 0 !important;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #606266;
}
</style>
