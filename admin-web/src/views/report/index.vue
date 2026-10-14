<template>
  <div class="page">
    <h2 style="margin-bottom: 24px">数据报表</h2>

    <el-row :gutter="20" style="margin-bottom: 24px">
      <el-col :span="6" v-for="card in memberStats" :key="card.label">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" style="margin-bottom: 24px">
      <template #header>
        <span>近30天营收趋势</span>
      </template>
      <div ref="chartRef" style="height: 300px"></div>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <span>技师业绩排行</span>
      </template>
      <el-table :data="staffRank" border>
        <el-table-column type="index" label="排名" width="60" />
        <el-table-column prop="staffName" label="技师姓名" />
        <el-table-column prop="orderCount" label="订单数" width="100" />
        <el-table-column prop="revenue" label="累计业绩" width="150">
          <template #default="{ row }">¥{{ row.revenue.toFixed(2) }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/request'

const chartRef = ref()
const memberStats = ref([
  { label: '总会员数', value: 0 },
  { label: '复购会员', value: 0 },
  { label: '高价值会员', value: 0 },
  { label: '复购率', value: '0%' },
])
const staffRank = ref([])

async function loadData() {
  // 会员分析
  const analysis: any = await request.get('/reports/member-analysis')
  memberStats.value = [
    { label: '总会员数', value: analysis.totalMembers },
    { label: '复购会员', value: analysis.repeatMembers },
    { label: '高价值会员', value: analysis.highValueMembers },
    { label: '复购率', value: analysis.repeatRate + '%' },
  ]

  // 技师业绩
  staffRank.value = await request.get('/reports/staff-performance')

  // 营收趋势
  const revenueData: any = await request.get('/reports/revenue-daily?days=30')
  await nextTick()
  renderChart(revenueData)
}

function renderChart(data: any[]) {
  const chart = echarts.init(chartRef.value!)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date.slice(5)),
    },
    yAxis: { type: 'value' },
    series: [
      {
        data: data.map(d => d.revenue),
        type: 'line',
        areaStyle: {},
        smooth: true,
        name: '营收',
      },
    ],
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.stat-card {
  text-align: center;
  padding: 10px 0;
}
.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #409eff;
}
.stat-label {
  color: #909399;
  margin-top: 8px;
  font-size: 14px;
}
</style>
