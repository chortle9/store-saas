<template>
  <div class="page-container">
    <el-card>
      <div class="search-bar">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon> 新建自动化规则
        </el-button>
        <el-button @click="handleRunRecall">
          <el-icon><VideoPlay /></el-icon> 立即执行沉睡召回
        </el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%; margin-top: 20px">
        <el-table-column prop="name" label="规则名称" />
        <el-table-column prop="type" label="规则类型" width="120">
          <template #default="{ row }">
            {{ typeText[row.type] || row.type }}
          </template>
        </el-table-column>
        <el-table-column prop="sleepDays" label="沉睡天数" width="100">
          <template #default="{ row }">
            {{ row.type === 'sleep_recall' ? row.sleepDays + '天' : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="rewardName" label="奖励内容" width="150" />
        <el-table-column prop="executedCount" label="已执行次数" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '已开启' : '已关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleToggle(row)">
              {{ row.status === 1 ? '关闭' : '开启' }}
            </el-button>
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新建/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="规则名称">
          <el-input v-model="form.name" placeholder="例如：30天未到店召回" />
        </el-form-item>
        <el-form-item label="规则类型">
          <el-radio-group v-model="form.type">
            <el-radio value="sleep_recall">沉睡召回</el-radio>
            <el-radio value="birthday">生日祝福</el-radio>
            <el-radio value="after_consume">消费后</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type === 'sleep_recall'" label="沉睡天数">
          <el-input-number v-model="form.sleepDays" :min="7" :max="180" />
        </el-form-item>
        <el-form-item label="奖励类型">
          <el-radio-group v-model="form.rewardType">
            <el-radio value="coupon">优惠券</el-radio>
            <el-radio value="points">积分</el-radio>
            <el-radio value="balance">余额</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="奖励名称">
          <el-input v-model="form.rewardName" placeholder="例如：50元无门槛券" />
        </el-form-item>
        <el-form-item label="奖励数值">
          <el-input-number v-model="form.rewardValue" :min="1" />
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
const dialogTitle = ref('新建自动化规则')
const form = ref<any>({})

const typeText: Record<string, string> = {
  sleep_recall: '沉睡召回',
  birthday: '生日祝福',
  after_consume: '消费后',
}

async function loadList() {
  loading.value = true
  try {
    const res = await request.get('/auto-rules')
    tableData.value = res || []
  } catch (error) {
    console.error('加载失败', error)
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  dialogTitle.value = '新建自动化规则'
  form.value = { type: 'sleep_recall', sleepDays: 30, rewardType: 'coupon', status: 1 }
  dialogVisible.value = true
}

function handleEdit(row: any) {
  dialogTitle.value = '编辑自动化规则'
  form.value = { ...row }
  dialogVisible.value = true
}

function handleToggle(row: any) {
  row.status = row.status === 1 ? 0 : 1
  request.put(`/auto-rules/${row.id}`, row)
  ElMessage.success('状态已更新')
}

function handleDelete(row: any) {
  ElMessageBox.confirm('确定要删除这个规则吗？', '提示', { type: 'warning' }).then(async () => {
    await request.delete(`/auto-rules/${row.id}`)
    ElMessage.success('删除成功')
    loadList()
  }).catch(() => {})
}

async function handleSave() {
  if (form.value.id) {
    await request.put(`/auto-rules/${form.value.id}`, form.value)
  } else {
    await request.post('/auto-rules', form.value)
  }
  ElMessage.success('保存成功')
  dialogVisible.value = false
  loadList()
}

async function handleRunRecall() {
  await request.post('/auto-rules/run-sleep-recall')
  ElMessage.success('沉睡召回执行完成')
}

onMounted(() => { loadList() })
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
