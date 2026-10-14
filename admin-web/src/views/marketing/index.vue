<template>
  <div class="page-container">
    <div class="card">
      <div class="search-bar">
        <el-button type="success" @click="handleAdd">
          <el-icon><Plus /></el-icon>新建优惠券
        </el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="优惠券名称" width="180" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="couponTypeMap[row.type] || 'info'">
              {{ couponTypeText[row.type] || row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="面值/折扣" width="100">
          <template #default="{ row }">
            {{ row.type === 'discount' ? row.value + '折' : '¥' + row.value }}
          </template>
        </el-table-column>
        <el-table-column prop="minAmount" label="最低消费" width="100">
          <template #default="{ row }">¥{{ row.minAmount }}</template>
        </el-table-column>
        <el-table-column prop="totalCount" label="发放总量" width="100" />
        <el-table-column prop="receivedCount" label="已领取" width="100" />
        <el-table-column prop="validDays" label="有效期(天)" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="新建优惠券" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="优惠券名称">
          <el-input v-model="form.name" placeholder="如：新人满减券" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="选择类型">
            <el-option label="代金券" value="cash" />
            <el-option label="折扣券" value="discount" />
            <el-option label="体验券" value="experience" />
          </el-select>
        </el-form-item>
        <el-form-item label="面值/折扣">
          <el-input-number v-model="form.value" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="最低消费">
          <el-input-number v-model="form.minAmount" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="有效期(天)">
          <el-input-number v-model="form.validDays" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCouponList, createCoupon } from '@/api'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const tableData = ref<any[]>([])
const dialogVisible = ref(false)
const form = ref<any>({ type: 'cash', value: 10, minAmount: 100, validDays: 30 })

const couponTypeMap: Record<string, string> = {
  cash: 'danger',
  discount: 'warning',
  experience: 'success',
}

const couponTypeText: Record<string, string> = {
  cash: '代金券',
  discount: '折扣券',
  experience: '体验券',
}

async function loadList() {
  loading.value = true
  try {
    const res = await getCouponList()
    tableData.value = res
  } catch (error) {
    console.error('加载优惠券失败', error)
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  form.value = { type: 'cash', value: 10, minAmount: 100, validDays: 30 }
  dialogVisible.value = true
}

async function handleSave() {
  try {
    await createCoupon(form.value)
    ElMessage.success('创建成功')
    dialogVisible.value = false
    loadList()
  } catch (error) {
    console.error('创建失败', error)
  }
}

onMounted(() => { loadList() })
</script>
