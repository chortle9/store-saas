import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, getProfile } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref<any>(null)
  const tenantInfo = ref<any>(null)

  async function loginAction(username: string, password: string) {
    const res = await login({ username, password })
    token.value = res.token
    userInfo.value = res.user
    tenantInfo.value = res.tenant
    localStorage.setItem('token', res.token)
    return res
  }

  async function fetchProfile() {
    const res = await getProfile()
    userInfo.value = {
      id: res.id,
      username: res.username,
      realName: res.realName,
      role: res.role,
    }
    tenantInfo.value = res.tenant
    return res
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    tenantInfo.value = null
    localStorage.removeItem('token')
  }

  return { token, userInfo, tenantInfo, loginAction, fetchProfile, logout }
})
