import request from '@/utils/request'

export function getMemberList(params: any) {
  return request.get('/members', { params })
}

export function getMemberDetail(id: number) {
  return request.get(`/members/${id}`)
}

export function createMember(data: any) {
  return request.post('/members', data)
}

export function updateMember(id: number, data: any) {
  return request.put(`/members/${id}`, data)
}

export function deleteMember(id: number) {
  return request.delete(`/members/${id}`)
}

export function getFollowList() {
  return request.get('/members/follow-list')
}
