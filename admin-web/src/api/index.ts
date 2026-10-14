import request from '@/utils/request'

// 服务项目
export function getServiceList(params?: any) {
  return request.get('/services', { params })
}

export function createService(data: any) {
  return request.post('/services', data)
}

export function updateService(id: number, data: any) {
  return request.put(`/services/${id}`, data)
}

export function deleteService(id: number) {
  return request.delete(`/services/${id}`)
}

// 卡项
export function getCardList() {
  return request.get('/cards')
}

export function createCard(data: any) {
  return request.post('/cards', data)
}

export function updateCard(id: number, data: any) {
  return request.put(`/cards/${id}`, data)
}

// 订单
export function getOrderList(params: any) {
  return request.get('/orders', { params })
}

export function createOrder(data: any) {
  return request.post('/orders', data)
}

export function getOrderDetail(id: number) {
  return request.get(`/orders/${id}`)
}

// 员工
export function getStaffList() {
  return request.get('/staff')
}

export function createStaff(data: any) {
  return request.post('/staff', data)
}

export function updateStaff(id: number, data: any) {
  return request.put(`/staff/${id}`, data)
}

// 营销
export function getCouponList() {
  return request.get('/marketing/coupons')
}

export function createCoupon(data: any) {
  return request.post('/marketing/coupons', data)
}
