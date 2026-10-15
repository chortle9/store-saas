<template>
  <div class="page-container">
    <!-- 顶部统计卡片 -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">待结算提成总额</div>
        <div class="stat-value">¥{{ totalPendingCommission }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">本月提成总额</div>
        <div class="stat-value">¥{{ monthCommission }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">涉及技师数</div>
        <div class="stat-value">{{ staffCount }}人</div>
      </div>
    </div>

    <!-- 技师提成汇总 -->
    <el-card style="margin-bottom: 20px">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span>技师提成汇总</span>
          <el-date-picker
            v-model="dateRange"
            type="month"
            placeholder="选择月份"
            style="width: 200px"
          />
        </div>
      </template>
      <el-table :data="staffSummary" v-loading="loading">
        <el-table-column prop="staffName" label="技师姓名" width="120" />
        <el-table-column prop="orderCount" label="服务单数" width="100" />
        <el-table-column prop="totalAmount" label="服务总额" width="120">
          <template #default="{ row }">¥{{ row.totalAmount }}</template>
        </el-table-column>
        <el-table-column prop="totalCommission" label="应得提成" width="120">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: 600">¥{{ row.totalCommission }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleSettle(row)">结算</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 提成明细 -->
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span>提成明细</span>
          <el-radio-group v-model="statusFilter" size="small">
            <el-radio-button value="pending">待结算</el-radio-button>
            <el-radio-button value="paid">已结算</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="createdAt" label="时间" width="180" />
        <el-table-column prop="staffName" label="技师" width="100" />
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="itemName" label="项目" />
        <el-table-column prop="amount" label="项目金额" width="100">
          <template #default="{ row }">¥{{ row.amount }}</template>
        </el-table-column>
        <el-table-column prop="commissionRate" label="提成比例" width="100">
          <template #default="{ row }">{{ row.commissionRate }}%</template>
        </el-table-column>
        <el-table-column prop="commissionAmount" label="提成金额" width="100">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: 600">¥{{ row.commissionAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'paid' ? 'success' : 'warning'" size="small">
              {{ row.status === 'paid' ? '已结算' : '待结算' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCommissionList, getStaffCommissionSummary, settleCommission } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref<any[]>([])
const staffSummary = ref<any[]>([])
const statusFilter = ref('pending')
const dateRange = ref('')

const totalPendingCommission = ref(0)
const monthCommission = ref(0)
const staffCount = ref(0)

async function loadData() {
  loading.value = true
  try {
    const params: any = { status: statusFilter.value, page: 1, pageSize: 50 }
    const res = await getCommissionList(params)
    tableData.value = res.list

    const summaryRes = await getStaffCommissionSummary({})
    staffSummary.value = summaryRes || []

    // 计算统计
    totalPendingCommission.value = staffSummary.value.reduce((sum: number, s: any) => sum + s.totalCommission, 0)
    staffCount.value = staffSummary.value.length
  } catch (error) {
    console.error('加载提成数据失败', error)
  } finally {
    loading.value = false
  }
}

function handleSettle(row: any) {
  ElMessageBox.confirm(
    `确定要结算技师 ${row.staffName} 的提成 ¥${row.totalCommission} 吗？`,
    '确认结算',
    { confirmButtonText: '确定结算', cancelButtonText: '取消', type: 'warning' }
  ).then(async () => {
    await settleCommission({
      staffId: row.staffId,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    })
    ElMessage.success('结算成功')
    loadData()
  }).catch(() => {})
}

onMounted(() => { loadData() })
</script>

<style scoped>
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.stat-label {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}
</style>
