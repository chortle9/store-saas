<template>
  <div class="page-container">
    <el-card>
      <div class="search-bar">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon> 新建门店
        </el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%; margin-top: 20px">
        <el-table-column prop="name" label="门店名称" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="businessHours" label="营业时间" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '营业中' : '已关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新建/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="门店名称">
          <el-input v-model="form.name" placeholder="例如：万达店" />
        </el-form-item>
        <el-form-item label="门店地址">
          <el-input v-model="form.address" placeholder="详细地址" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" placeholder="门店电话" />
        </el-form-item>
        <el-form-item label="营业时间">
          <el-input v-model="form.businessHours" placeholder="例如：10:00-22:00" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">营业中</el-radio>
            <el-radio :value="0">已关闭</el-radio>
          </el-radio-group>
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
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref<any[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新建门店')
const form = ref<any>({})

async function loadList() {
  loading.value = true
  try {
    tableData.value = await request.get('/stores')
  } catch (error) {
    console.error('加载失败', error)
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  dialogTitle.value = '新建门店'
  form.value = { status: 1 }
  dialogVisible.value = true
}

function handleEdit(row: any) {
  dialogTitle.value = '编辑门店'
  form.value = { ...row }
  dialogVisible.value = true
}

function handleDelete(row: any) {
  ElMessageBox.confirm('确定要删除这个门店吗？', '提示', { type: 'warning' }).then(async () => {
    await request.delete(`/stores/${row.id}`)
    ElMessage.success('删除成功')
    loadList()
  }).catch(() => {})
}

async function handleSave() {
  if (form.value.id) {
    await request.put(`/stores/${form.value.id}`, form.value)
  } else {
    await request.post('/stores', form.value)
  }
  ElMessage.success('保存成功')
  dialogVisible.value = false
  loadList()
}

onMounted(() => { loadList() })
</script>

<style scoped>
.search-bar {
  display: flex;
  justify-content: flex-end;
}
</style>
