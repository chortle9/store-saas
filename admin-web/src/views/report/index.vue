<template>
  <div class="page-container">
    <h2 style="margin-bottom: 24px">数据报表</h2>

    <!-- 经营概览卡片 -->
    <el-row :gutter="20" style="margin-bottom: 24px">
      <el-col :span="4" v-for="card in overview" :key="card.label">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-value" :style="{ color: card.color }">{{ card.value }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-bottom: 24px">
      <!-- 营收趋势图 -->
      <el-col :span="16">
        <el-card shadow="never">
          <template #header>
            <span>近30天营收趋势</span>
          </template>
          <div ref="revenueChartRef" style="height: 320px"></div>
        </el-card>
      </el-col>

      <!-- 新老客对比 -->
      <el-col :span="8">
        <el-card shadow="never">
          <template #header>
            <span>近30天新老客对比</span>
          </template>
          <div ref="customerChartRef" style="height: 320px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- 技师业绩排行 -->
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <span>技师业绩排行</span>
          </template>
          <el-table :data="staffRank" border size="small">
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="staffName" label="技师姓名" />
            <el-table-column prop="orderCount" label="订单数" width="80" />
            <el-table-column prop="revenue" label="业绩" width="120">
              <template #default="{ row }">¥{{ Number(row.revenue).toFixed(0) }}</template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 项目销售排行 -->
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <span>热门项目排行</span>
          </template>
          <el-table :data="itemRank" border size="small">
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="itemName" label="项目名称" />
            <el-table-column prop="count" label="销量" width="80" />
            <el-table-column prop="amount" label="销售额" width="120">
              <template #default="{ row }">¥{{ Number(row.amount).toFixed(0) }}</template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/request'

const revenueChartRef = ref()
const customerChartRef = ref()
const staffRank = ref<any[]>([])
const itemRank = ref<any[]>([])
const overview = ref([
  { label: '今日营收', value: '¥0', color: '#67C23A' },
  { label: '今日订单', value: 0, color: '#409EFF' },
  { label: '今日预约', value: 0, color: '#E6A23C' },
  { label: '本月营收', value: '¥0', color: '#F56C6C' },
  { label: '总会员数', value: 0, color: '#909399' },
  { label: '客单价', value: '¥0', color: '#9c27b0' },
])

async function loadData() {
  // 经营概览
  const overviewData: any = await request.get('/reports/overview')
  overview.value = [
    { label: '今日营收', value: '¥' + Number(overviewData.todayRevenue).toFixed(0), color: '#67C23A' },
    { label: '今日订单', value: overviewData.todayOrderCount, color: '#409EFF' },
    { label: '今日预约', value: overviewData.todayAppointmentCount, color: '#E6A23C' },
    { label: '本月营收', value: '¥' + Number(overviewData.monthRevenue).toFixed(0), color: '#F56C6C' },
    { label: '总会员数', value: overviewData.totalMembers, color: '#909399' },
    { label: '客单价', value: '¥' + overviewData.avgOrderValue, color: '#9c27b0' },
  ]

  // 技师业绩
  staffRank.value = await request.get('/reports/staff-performance')

  // 项目排行
  itemRank.value = await request.get('/reports/item-ranking')

  // 营收趋势
  const revenueData: any = await request.get('/reports/revenue-daily?days=30')
  await nextTick()
  renderRevenueChart(revenueData)

  // 新老客对比
  const customerData: any = await request.get('/reports/new-old-customer?days=30')
  renderCustomerChart(customerData)
}

function renderRevenueChart(data: any[]) {
  const chart = echarts.init(revenueChartRef.value!)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date.slice(5)),
      boundaryGap: false,
    },
    yAxis: { type: 'value' },
    series: [
      {
        data: data.map(d => d.revenue),
        type: 'line',
        areaStyle: { opacity: 0.3 },
        smooth: true,
        name: '营收',
        itemStyle: { color: '#409EFF' },
      },
    ],
  })
}

function renderCustomerChart(data: any) {
  const chart = echarts.init(customerChartRef.value!)
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        data: [
          { value: data.newCustomers, name: '新顾客', itemStyle: { color: '#67C23A' } },
          { value: data.oldCustomers, name: '老顾客', itemStyle: { color: '#409EFF' } },
        ],
        label: { formatter: '{b}: {c}人' },
      },
    ],
  })
}

onMounted(() => { loadData() })
</script>

<style scoped>
.stat-card {
  text-align: center;
  padding: 10px 0;
}
.stat-value {
  font-size: 26px;
  font-weight: bold;
}
.stat-label {
  color: #909399;
  margin-top: 8px;
  font-size: 13px;
}
</style>
