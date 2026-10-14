import request from '@/utils/request'

export function getAppointmentList(params: any) {
  return request.get('/appointments', { params })
}

export function getTodayAppointments() {
  return request.get('/appointments/today')
}

export function createAppointment(data: any) {
  return request.post('/appointments', data)
}

export function updateAppointmentStatus(id: number, data: { status: string; remark?: string }) {
  return request.put(`/appointments/${id}/status`, data)
}
