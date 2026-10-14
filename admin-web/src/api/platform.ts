import request from '@/utils/request'

// 平台管理员登录
export function platformLogin(data: { username: string; password: string }) {
  return request.post('/platform/login', data)
}

// 平台统计数据
export function getPlatformStats() {
  return request.get('/platform/stats')
}

// 租户列表
export function getTenantList(params: any) {
  return request.get('/platform/tenants', { params })
}

// 租户详情
export function getTenantDetail(id: number) {
  return request.get(`/platform/tenants/${id}`)
}

// 开通新店铺
export function createTenant(data: any) {
  return request.post('/platform/tenants', data)
}

// 更新租户
export function updateTenant(id: number, data: any) {
  return request.put(`/platform/tenants/${id}`, data)
}
