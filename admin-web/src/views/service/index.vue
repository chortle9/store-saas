<template>
  <div class="page-container">
    <div class="card">
      <div class="search-bar">
        <el-input v-model="keyword" placeholder="搜索项目名称" style="width: 250px" clearable />
        <el-button type="primary" @click="loadList">搜索</el-button>
        <el-button type="success" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增项目
        </el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="项目名称" width="180" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="duration" label="时长(分钟)" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="项目名称">
          <el-input v-model="form.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="form.category" placeholder="如：护理/美甲/美容" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="form.price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="时长(分钟)">
          <el-input-number v-model="form.duration" :min="0" :step="15" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="上架" inactive-text="下架" />
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
import { getServiceList, createService, updateService, deleteService } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref<any[]>([])
const keyword = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('新增项目')
const form = ref<any>({ status: 1, price: 0, duration: 60 })

async function loadList() {
  loading.value = true
  try {
    const res = await getServiceList({ keyword: keyword.value })
    tableData.value = res
  } catch (error) {
    console.error('加载项目列表失败', error)
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  dialogTitle.value = '新增项目'
  form.value = { status: 1, price: 0, duration: 60 }
  dialogVisible.value = true
}

function handleEdit(row: any) {
  dialogTitle.value = '编辑项目'
  form.value = { ...row }
  dialogVisible.value = true
}

async function handleSave() {
  try {
    if (form.value.id) {
      await updateService(form.value.id, form.value)
      ElMessage.success('更新成功')
    } else {
      await createService(form.value)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadList()
  } catch (error) {
    console.error('保存失败', error)
  }
}

function handleDelete(row: any) {
  ElMessageBox.confirm(`确定要删除项目「${row.name}」吗？`, '提示', { type: 'warning' })
    .then(async () => {
      await deleteService(row.id)
      ElMessage.success('删除成功')
      loadList()
    })
}

onMounted(() => { loadList() })
</script>
