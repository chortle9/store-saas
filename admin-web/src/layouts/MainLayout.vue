<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside width="220px" class="sidebar">
      <div class="logo">
        <el-icon :size="28" color="#409EFF"><Shop /></el-icon>
        <span class="logo-text">店小伴</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item
          v-for="item in menuList"
          :key="item.path"
          :index="item.path"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部栏 -->
      <el-header class="header">
        <div class="header-left">
          <span class="tenant-name">{{ tenantInfo?.name || '未设置店铺' }}</span>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-icon><Avatar /></el-icon>
              {{ userInfo?.realName || '未登录' }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="setting">店铺设置</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容区 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)
const userInfo = computed(() => userStore.userInfo)
const tenantInfo = computed(() => userStore.tenantInfo)

// 全部菜单
const allMenus = [
  { path: '/dashboard', title: '工作台', icon: 'Odometer', key: 'dashboard' },
  { path: '/member', title: '会员管理', icon: 'User', key: 'member' },
  { path: '/appointment', title: '预约管理', icon: 'Calendar', key: 'appointment' },
  { path: '/service', title: '服务项目', icon: 'Goods', key: 'service' },
  { path: '/product', title: '商品管理', icon: 'ShoppingBag', key: 'product' },
  { path: '/card', title: '卡项管理', icon: 'CreditCard', key: 'card' },
  { path: '/order', title: '订单收银', icon: 'ShoppingCart', key: 'order' },
  { path: '/commission', title: '提成管理', icon: 'Money', key: 'commission' },
  { path: '/marketing', title: '营销中心', icon: 'Promotion', key: 'marketing' },
  { path: '/marketing/group-buy', title: '拼团活动', icon: 'Goods', key: 'group-buy' },
  { path: '/marketing/auto-rule', title: '自动化营销', icon: 'Bell', key: 'auto-rule' },
  { path: '/stock', title: '库存管理', icon: 'Box', key: 'stock' },
  { path: '/report', title: '数据报表', icon: 'DataAnalysis', key: 'report' },
  { path: '/website', title: '网站设置', icon: 'Monitor', key: 'website' },
  { path: '/staff', title: '员工管理', icon: 'Avatar', key: 'staff' },
  { path: '/staff/schedule', title: '员工排班', icon: 'Calendar', key: 'schedule' },
  { path: '/store', title: '门店管理', icon: 'OfficeBuilding', key: 'store' },
  { path: '/setting', title: '店铺设置', icon: 'Setting', key: 'setting' },
]

// 根据当前用户权限过滤菜单
const menuList = computed(() => {
  const role = userStore.userInfo?.role

  // 老板（店主/super_admin）看全部
  if (role === 'super_admin' || role === '店主' || role === 'boss') {
    return allMenus
  }

  // 店长：能看门店数据、员工管理，但是不能改系统设置、套餐
  if (role === '店长' || role === 'manager') {
    return allMenus.filter(m => [
      'dashboard', 'order', 'appointment', 'member', 'service', 'product',
      'report', 'staff', 'stock', 'marketing'
    ].includes(m.key))
  }

  // 收银员：只能收银和看自己的订单
  if (role === '收银员' || role === 'cashier') {
    return allMenus.filter(m => [
      'order', 'appointment'
    ].includes(m.key))
  }

  // 默认员工
  return allMenus.filter(m => ['order', 'appointment', 'commission'].includes(m.key))
})

onMounted(() => {
  if (!userStore.userInfo) {
    userStore.fetchProfile()
  }
})

function handleCommand(command: string) {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      userStore.logout()
      ElMessage.success('退出成功')
      router.push('/login')
    })
  } else if (command === 'setting') {
    router.push('/setting')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background: #fff;
  overflow-x: hidden;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #1a1a2e;
  font-size: 20px;
  font-weight: 700;
  background: #fff;
  letter-spacing: 1px;
  border-bottom: 1px solid #f0f2f5;
}

.sidebar .el-menu {
  border-right: none;
  background: transparent;
}

.sidebar .el-menu-item {
  margin: 4px 12px;
  border-radius: 8px;
  height: 48px;
  line-height: 48px;
  color: #606266;
}

.sidebar .el-menu-item:hover {
  background: #f5f7fa !important;
  color: #667eea;
}

.sidebar .el-menu-item.is-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
}

.header {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  height: 64px !important;
}

.tenant-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #606266;
}

.main-content {
  background-color: #f8f9fc;
  padding: 24px;
}
</style>
