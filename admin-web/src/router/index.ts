import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/h5/:tenantId',
    name: 'H5Website',
    component: () => import('@/views/h5/website.vue'),
    meta: { title: '店铺网站' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/platform/login',
    name: 'PlatformLogin',
    component: () => import('@/views/platform/login.vue'),
    meta: { title: '平台登录' },
  },
  {
    path: '/platform',
    component: () => import('@/layouts/PlatformLayout.vue'),
    redirect: '/platform/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'PlatformDashboard',
        component: () => import('@/views/platform/dashboard.vue'),
        meta: { title: '数据概览' },
      },
      {
        path: 'tenants',
        name: 'PlatformTenants',
        component: () => import('@/views/platform/tenants.vue'),
        meta: { title: '店铺管理' },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '工作台', icon: 'Odometer' },
      },
      {
        path: 'member',
        name: 'Member',
        component: () => import('@/views/member/index.vue'),
        meta: { title: '会员管理', icon: 'User' },
      },
      {
        path: 'appointment',
        name: 'Appointment',
        component: () => import('@/views/appointment/index.vue'),
        meta: { title: '预约管理', icon: 'Calendar' },
      },
      {
        path: 'service',
        name: 'Service',
        component: () => import('@/views/service/index.vue'),
        meta: { title: '服务项目', icon: 'Goods' },
      },
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/views/product/index.vue'),
        meta: { title: '商品管理', icon: 'ShoppingBag' },
      },
      {
        path: 'card',
        name: 'Card',
        component: () => import('@/views/card/index.vue'),
        meta: { title: '卡项管理', icon: 'CreditCard' },
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/order/index.vue'),
        meta: { title: '订单收银', icon: 'ShoppingCart' },
      },
      {
        path: 'marketing',
        name: 'Marketing',
        component: () => import('@/views/marketing/index.vue'),
        meta: { title: '营销中心', icon: 'Promotion' },
      },
      {
        path: 'marketing/group-buy',
        name: 'GroupBuy',
        component: () => import('@/views/marketing/group-buy.vue'),
        meta: { title: '拼团活动', icon: 'Promotion' },
      },
      {
        path: 'marketing/auto-rule',
        name: 'AutoRule',
        component: () => import('@/views/marketing/auto-rule.vue'),
        meta: { title: '自动化营销', icon: 'Promotion' },
      },
      {
        path: 'stock',
        name: 'Stock',
        component: () => import('@/views/stock/index.vue'),
        meta: { title: '库存管理', icon: 'Box' },
      },
      {
        path: 'report',
        name: 'Report',
        component: () => import('@/views/report/index.vue'),
        meta: { title: '数据报表', icon: 'DataAnalysis' },
      },
      {
        path: 'website',
        name: 'Website',
        component: () => import('@/views/website/index.vue'),
        meta: { title: '网站设置', icon: 'Monitor' },
      },
      {
        path: 'staff',
        name: 'Staff',
        component: () => import('@/views/staff/index.vue'),
        meta: { title: '员工管理', icon: 'Avatar' },
      },
      {
        path: 'staff/schedule',
        name: 'Schedule',
        component: () => import('@/views/staff/schedule.vue'),
        meta: { title: '员工排班', icon: 'Calendar' },
      },
      {
        path: 'staff/home',
        name: 'StaffHome',
        component: () => import('@/views/staff/home.vue'),
        meta: { title: '员工工作台', icon: 'HomeFilled' },
      },
      {
        path: 'store',
        name: 'Store',
        component: () => import('@/views/store/index.vue'),
        meta: { title: '门店管理', icon: 'OfficeBuilding' },
      },
      {
        path: 'commission',
        name: 'Commission',
        component: () => import('@/views/commission/index.vue'),
        meta: { title: '提成管理', icon: 'Money' },
      },
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('@/views/setting/index.vue'),
        meta: { title: '店铺设置', icon: 'Setting' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token
  const platformToken = localStorage.getItem('platform_token')

  // 平台后台路由
  if (to.path.startsWith('/platform')) {
    if (to.path === '/platform/login') {
      next()
    } else if (!platformToken) {
      next('/platform/login')
    } else {
      next()
    }
    return
  }

  // 店铺后台路由
  if (to.path === '/login') {
    next()
  } else if (!token) {
    next('/login')
  } else {
    next()
  }
})

export default router
