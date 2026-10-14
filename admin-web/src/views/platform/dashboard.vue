<template>
  <div>
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="stat-card">
          <div class="icon" style="background: linear-gradient(135deg, #667eea, #764ba2)">
            <el-icon><OfficeBuilding /></el-icon>
          </div>
          <div class="info">
            <div class="label">总店铺数</div>
            <div class="value">{{ stats.totalTenants || 0 }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="icon" style="background: linear-gradient(135deg, #43e97b, #38f9d7)">
            <el-icon><CircleCheck /></el-icon>
          </div>
          <div class="info">
            <div class="label">正常营业</div>
            <div class="value">{{ stats.activeTenants || 0 }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="icon" style="background: linear-gradient(135deg, #4facfe, #00f2fe)">
            <el-icon><User /></el-icon>
          </div>
          <div class="info">
            <div class="label">全平台总会员</div>
            <div class="value">{{ stats.totalMembers || 0 }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="icon" style="background: linear-gradient(135deg, #f093fb, #f5576c)">
            <el-icon><Money /></el-icon>
          </div>
          <div class="info">
            <div class="label">全平台总营收</div>
            <div class="value">¥{{ stats.totalRevenue || 0 }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <div class="card">
          <h3 style="margin-bottom: 16px">本月新增店铺</h3>
          <div style="font-size: 48px; font-weight: 600; color: #409EFF; text-align: center; padding: 30px 0">
            {{ stats.newTenantsThisMonth || 0 }}
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card">
          <h3 style="margin-bottom: 16px">快速操作</h3>
          <div style="display: flex; gap: 16px; padding: 20px 0">
            <el-button type="primary" size="large" @click="$router.push('/platform/tenants')">
              管理店铺
            </el-button>
            <el-button type="success" size="large" @click="$router.push('/platform/tenants?create=1')">
              开通新店铺
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPlatformStats } from '@/api/platform'

const stats = ref<any>({})

onMounted(async () => {
  try {
    stats.value = await getPlatformStats()
  } catch (error) {
    console.error('获取平台统计失败', error)
  }
})
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
.stat-card .icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 28px;
  color: #fff;
}
.stat-card .info .label { font-size: 14px; color: #909399; margin-bottom: 8px; }
.stat-card .info .value { font-size: 24px; font-weight: 600; color: #303133; }
.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
</style>
