<template>
  <div class="page-container">
    <el-card>
      <div class="search-bar">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon> 新建拼团活动
        </el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%; margin-top: 20px">
        <el-table-column prop="title" label="活动标题" />
        <el-table-column prop="serviceName" label="关联项目" width="150" />
        <el-table-column prop="originalPrice" label="原价" width="100">
          <template #default="{ row }">¥{{ row.originalPrice }}</template>
        </el-table-column>
        <el-table-column prop="groupPrice" label="拼团价" width="100">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: 600">¥{{ row.groupPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="requiredCount" label="成团人数" width="100">
          <template #default="{ row }">{{ row.requiredCount }}人团</template>
        </el-table-column>
        <el-table-column prop="groupCount" label="已开团" width="100" />
        <el-table-column prop="successCount" label="已成团" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '进行中' : '已下架' }}
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
        <el-form-item label="活动标题">
          <el-input v-model="form.title" placeholder="例如：3人拼团享5折" />
        </el-form-item>
        <el-form-item label="选择项目">
          <el-select v-model="form.serviceId" placeholder="选择服务项目" style="width: 100%">
            <el-option v-for="s in serviceList" :key="s.id" :label="s.name + ' ¥' + s.price" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="拼团价">
          <el-input-number v-model="form.groupPrice" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="成团人数">
          <el-input-number v-model="form.requiredCount" :min="2" :max="10" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="form.startTime" type="datetime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="form.endTime" type="datetime" />
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
import { getGroupBuyList, createGroupBuy, updateGroupBuy, deleteGroupBuy, getServiceList } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref<any[]>([])
const serviceList = ref<any[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新建拼团活动')
const form = ref<any>({})

async function loadList() {
  loading.value = true
  try {
    const res = await getGroupBuyList({ page: 1, pageSize: 50 })
    tableData.value = res.list
  } catch (error) {
    console.error('加载失败', error)
  } finally {
    loading.value = false
  }
}

async function loadServices() {
  const res = await getServiceList()
  serviceList.value = res || []
}

function handleAdd() {
  dialogTitle.value = '新建拼团活动'
  form.value = { requiredCount: 3, status: 1 }
  dialogVisible.value = true
}

function handleEdit(row: any) {
  dialogTitle.value = '编辑拼团活动'
  form.value = { ...row }
  dialogVisible.value = true
}

function handleDelete(row: any) {
  ElMessageBox.confirm('确定要删除这个活动吗？', '提示', { type: 'warning' }).then(async () => {
    await deleteGroupBuy(row.id)
    ElMessage.success('删除成功')
    loadList()
  }).catch(() => {})
}

async function handleSave() {
  if (form.value.id) {
    await updateGroupBuy(form.value.id, form.value)
  } else {
    await createGroupBuy(form.value)
  }
  ElMessage.success('保存成功')
  dialogVisible.value = false
  loadList()
}

onMounted(() => {
  loadList()
  loadServices()
})
</script>

<style scoped>
.search-bar {
  display: flex;
  justify-content: flex-end;
}
</style>
