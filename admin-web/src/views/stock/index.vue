<template>
  <div class="page">
    <div class="page-header">
      <h2>库存管理</h2>
      <el-button type="primary" @click="dialogVisible = true">新增产品</el-button>
    </div>

    <el-alert v-if="lowStockList.length > 0" :title="`⚠️ ${lowStockList.length}个产品库存不足，请及时补货`" type="warning" :closable="false" style="margin-bottom: 16px" />

    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="产品名称" />
      <el-table-column prop="category" label="分类" width="100" />
      <el-table-column prop="costPrice" label="成本价" width="100">
        <template #default="{ row }">¥{{ row.costPrice }}</template>
      </el-table-column>
      <el-table-column prop="salePrice" label="售价" width="100">
        <template #default="{ row }">¥{{ row.salePrice }}</template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="80">
        <template #default="{ row }">
          <el-tag :type="row.stock <= row.warnStock ? 'danger' : 'success'">{{ row.stock }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="warnStock" label="预警库存" width="90" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="新增产品" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="产品名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="form.category" placeholder="如：护肤品/耗材" />
        </el-form-item>
        <el-form-item label="成本价">
          <el-input-number v-model="form.costPrice" :precision="2" :min="0" />
        </el-form-item>
        <el-form-item label="售价">
          <el-input-number v-model="form.salePrice" :precision="2" :min="0" />
        </el-form-item>
        <el-form-item label="库存数量">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
        <el-form-item label="预警库存">
          <el-input-number v-model="form.warnStock" :min="0" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.unit" placeholder="如：瓶/盒/支" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const list = ref([])
const lowStockList = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const form = ref({
  name: '',
  category: '',
  costPrice: 0,
  salePrice: 0,
  stock: 0,
  warnStock: 10,
  unit: '个',
})

async function loadData() {
  loading.value = true
  try {
    const res: any = await request.get('/stock/products')
    list.value = res.list || res
    const lowRes: any = await request.get('/stock/low-stock')
    lowStockList.value = lowRes
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  await request.post('/stock/products', form.value)
  ElMessage.success('保存成功')
  dialogVisible.value = false
  loadData()
}

function handleEdit(row) {
  form.value = { ...row }
  dialogVisible.value = true
}

async function handleDelete(row) {
  await ElMessageBox.confirm('确认删除该产品？', '提示', { type: 'warning' })
  await request.delete(`/stock/products/${row.id}`)
  ElMessage.success('删除成功')
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
