<template>
  <div class="page-container">
    <div class="card">
      <div class="search-bar">
        <el-button type="success" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增卡项
        </el-button>
      </div>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="8" v-for="item in tableData" :key="item.id">
          <el-card class="card-item" shadow="hover">
            <div class="card-header">
              <h3>{{ item.name }}</h3>
              <el-tag :type="item.type === 'times' ? 'warning' : item.type === 'stored_value' ? 'success' : 'primary'">
                {{ typeTextMap[item.type] }}
              </el-tag>
            </div>
            <div class="card-price">¥{{ item.price }}</div>
            <div class="card-desc">{{ item.description }}</div>
            <div class="card-meta">
              <span v-if="item.totalTimes > 0">共 {{ item.totalTimes }} 次</span>
              <span v-if="item.storedValue > 0">储值 ¥{{ item.storedValue }}</span>
              <span>有效期 {{ item.validDays }} 天</span>
            </div>
            <div class="card-actions">
              <el-button size="small" @click="handleEdit(item)">编辑</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="卡名称">
          <el-input v-model="form.name" placeholder="如：10次护理卡" />
        </el-form-item>
        <el-form-item label="卡类型">
          <el-select v-model="form.type" placeholder="选择类型">
            <el-option label="次卡" value="times" />
            <el-option label="储值卡" value="stored_value" />
            <el-option label="套餐卡" value="package" />
          </el-select>
        </el-form-item>
        <el-form-item label="售价">
          <el-input-number v-model="form.price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="总次数" v-if="form.type === 'times'">
          <el-input-number v-model="form.totalTimes" :min="1" />
        </el-form-item>
        <el-form-item label="储值金额" v-if="form.type === 'stored_value'">
          <el-input-number v-model="form.storedValue" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="有效期(天)">
          <el-input-number v-model="form.validDays" :min="1" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" />
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
import { getCardList, createCard, updateCard } from '@/api'
import { ElMessage } from 'element-plus'

const tableData = ref<any[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增卡项')
const form = ref<any>({ type: 'times', price: 0, totalTimes: 10, validDays: 365 })

const typeTextMap: Record<string, string> = {
  times: '次卡',
  stored_value: '储值卡',
  package: '套餐卡',
}

async function loadList() {
  try {
    const res = await getCardList()
    tableData.value = res
  } catch (error) {
    console.error('加载卡项失败', error)
  }
}

function handleAdd() {
  dialogTitle.value = '新增卡项'
  form.value = { type: 'times', price: 0, totalTimes: 10, validDays: 365 }
  dialogVisible.value = true
}

function handleEdit(row: any) {
  dialogTitle.value = '编辑卡项'
  form.value = { ...row }
  dialogVisible.value = true
}

async function handleSave() {
  try {
    if (form.value.id) {
      await updateCard(form.value.id, form.value)
      ElMessage.success('更新成功')
    } else {
      await createCard(form.value)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadList()
  } catch (error) {
    console.error('保存失败', error)
  }
}

onMounted(() => { loadList() })
</script>

<style scoped>
.card-item {
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.card-price {
  font-size: 28px;
  font-weight: 600;
  color: #f56c6c;
  margin-bottom: 8px;
}
.card-desc {
  font-size: 13px;
  color: #909399;
  margin-bottom: 12px;
}
.card-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #606266;
  margin-bottom: 16px;
}
</style>
