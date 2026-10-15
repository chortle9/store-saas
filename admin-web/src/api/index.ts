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

// 支付
export function createPayment(data: any) {
  return request.post('/payments', data)
}

export function mockPaySuccess(paymentNo: string) {
  return request.post(`/payments/mock-pay/${paymentNo}`)
}

export function getPaymentList(params: any) {
  return request.get('/payments', { params })
}

export function refundPayment(paymentNo: string, reason: string) {
  return request.put(`/payments/refund/${paymentNo}`, { reason })
}

// 提成管理
export function getCommissionList(params: any) {
  return request.get('/commissions', { params })
}

export function getStaffCommissionSummary(params: any) {
  return request.get('/commissions/staff-summary', { params })
}

export function settleCommission(data: any) {
  return request.post('/commissions/settle', data)
}

// 拼团活动
export function getGroupBuyList(params: any) {
  return request.get('/group-buy', { params })
}

export function createGroupBuy(data: any) {
  return request.post('/group-buy', data)
}

export function updateGroupBuy(id: number, data: any) {
  return request.put(`/group-buy/${id}`, data)
}

export function deleteGroupBuy(id: number) {
  return request.delete(`/group-buy/${id}`)
}
