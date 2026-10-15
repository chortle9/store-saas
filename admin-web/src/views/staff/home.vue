<template>
  <div class="staff-home">
    <!-- 欢迎语 -->
    <div class="welcome-card">
      <div>
        <div class="welcome-text">早上好，{{ userInfo.realName }}！</div>
        <div class="date-text">{{ todayStr }}</div>
      </div>
      <div class="staff-avatar">{{ userInfo.realName?.charAt(0) }}</div>
    </div>

    <!-- 我的今日数据 -->
    <el-row :gutter="16" style="margin-bottom: 20px">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-label">今日我的预约</div>
            <div class="stat-value">{{ myTodayAppointments }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-label">今日我的单数</div>
            <div class="stat-value">{{ myTodayOrders }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-label">本月我的提成</div>
            <div class="stat-value">¥{{ myMonthCommission }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷功能入口 -->
    <el-card shadow="never">
      <template #header>
        <span>常用功能</span>
      </template>
      <div class="quick-grid">
        <div class="quick-item" @click="$router.push('/order')">
          <div class="quick-icon" style="background: #409eff">
            <el-icon size="28"><ShoppingCart /></el-icon>
          </div>
          <div class="quick-name">收银开单</div>
        </div>
        <div class="quick-item" @click="$router.push('/appointment')">
          <div class="quick-icon" style="background: #67c23a">
            <el-icon size="28"><Calendar /></el-icon>
          </div>
          <div class="quick-name">今日预约</div>
        </div>
        <div class="quick-item" @click="$router.push('/commission')">
          <div class="quick-icon" style="background: #e6a23c">
            <el-icon size="28"><Money /></el-icon>
          </div>
          <div class="quick-name">我的提成</div>
        </div>
      </div>
    </el-card>

    <!-- 今日我的预约列表 -->
    <el-card shadow="never" style="margin-top: 20px">
      <template #header>
        <span>我的今日预约</span>
      </template>
      <el-table :data="todayAppointments" v-loading="loading">
        <el-table-column prop="appointmentTime" label="时间" width="100" />
        <el-table-column prop="memberName" label="客户" width="100" />
        <el-table-column prop="serviceName" label="项目" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="row.status === 'confirmed' ? 'success' : 'info'">
              {{ row.status === 'confirmed' ? '已确认' : row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import request from '@/utils/request'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

const loading = ref(false)
const todayAppointments = ref<any[]>([])
const myTodayAppointments = ref(0)
const myTodayOrders = ref(0)
const myMonthCommission = ref(0)

const todayStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${'日一二三四五六'[d.getDay()]}`
})

async function loadData() {
  loading.value = true
  try {
    // 加载今日预约
    const apptRes: any = await request.get('/appointments/today')
    todayAppointments.value = apptRes || []
    myTodayAppointments.value = todayAppointments.value.length

    // 我的提成汇总
    const commRes: any = await request.get('/commissions/staff-summary')
    if (commRes && commRes.length > 0) {
      const my = commRes.find((s: any) => s.staffId === userInfo.value?.id)
      myMonthCommission.value = my ? my.commission : 0
    }
  } catch (e) {
    console.error('加载数据失败', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => { loadData() })
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.date-text {
  font-size: 14px;
  opacity: 0.9;
}

.staff-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
}

.stat-card {
  text-align: center;
  padding: 10px 0;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 8px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-item:hover {
  background: #f5f7fa;
}

.quick-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 12px;
}

.quick-name {
  font-size: 14px;
  color: #333;
}
</style>
