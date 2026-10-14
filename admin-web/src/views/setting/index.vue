<template>
  <div class="page-container">
    <div class="card">
      <h3 style="margin-bottom: 24px">店铺设置</h3>
      
      <el-form :model="form" label-width="100px" style="max-width: 600px">
        <el-form-item label="店铺名称">
          <el-input v-model="form.name" placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="店铺地址">
          <el-input v-model="form.address" placeholder="请输入店铺地址" />
        </el-form-item>
        <el-form-item label="营业时间">
          <el-input v-model="form.businessHours" placeholder="如：09:00-21:00" />
        </el-form-item>
        <el-form-item label="店铺简介">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="店铺介绍、特色服务等" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存设置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="card" style="margin-top: 20px">
      <h3 style="margin-bottom: 16px">套餐信息</h3>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="当前套餐">
          <el-tag type="primary">{{ planText[tenantInfo?.plan] || tenantInfo?.plan }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="到期时间">
          {{ tenantInfo?.planExpireAt || '未设置' }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const tenantInfo = ref(userStore.tenantInfo)
const form = ref<any>({})

const planText: Record<string, string> = {
  basic: '基础版',
  pro: '专业版',
  enterprise: '连锁版',
}

function handleSave() {
  ElMessage.success('设置已保存')
}

onMounted(() => {
  form.value = { ...tenantInfo.value }
})
</script>
