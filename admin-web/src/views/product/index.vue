<template>
  <div class="page-container">
    <el-card>
      <div class="header-bar">
        <h3 style="margin: 0">商品管理</h3>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon> 新建商品
        </el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%; margin-top: 20px">
        <el-table-column label="图片" width="80">
          <template #default="{ row }">
            <el-image
              v-if="row.image"
              :src="row.image"
              fit="cover"
              style="width: 50px; height: 50px; border-radius: 4px"
            />
            <div v-else style="width: 50px; height: 50px; background: #f5f7fa; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px">无图</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="price" label="售价" width="100">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '上架中' : '已下架' }}
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="商品图片">
          <el-upload
            class="avatar-uploader"
            :action="'/api/upload'"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
          >
            <img v-if="form.image" :src="form.image" class="avatar" />
            <div v-else>
              <el-icon size="28"><Plus /></el-icon>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="form.name" placeholder="例如：玻尿酸精华液" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="form.category" placeholder="例如：护肤品" />
        </el-form-item>
        <el-form-item label="售价">
          <el-input-number v-model="form.price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="成本价">
          <el-input-number v-model="form.costPrice" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">上架</el-radio>
            <el-radio :value="0">下架</el-radio>
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
const dialogTitle = ref('新建商品')
const form = ref<any>({})

async function loadList() {
  loading.value = true
  try {
    tableData.value = await request.get('/products')
  } catch (error) {
    console.error('加载失败', error)
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  dialogTitle.value = '新建商品'
  form.value = { status: 1, stock: 0 }
  dialogVisible.value = true
}

function handleEdit(row: any) {
  dialogTitle.value = '编辑商品'
  form.value = { ...row }
  dialogVisible.value = true
}

function handleDelete(row: any) {
  ElMessageBox.confirm('确定要删除这个商品吗？', '提示', { type: 'warning' }).then(async () => {
    await request.delete(`/products/${row.id}`)
    ElMessage.success('删除成功')
    loadList()
  }).catch(() => {})
}

async function handleSave() {
  if (form.value.id) {
    await request.put(`/products/${form.value.id}`, form.value)
  } else {
    await request.post('/products', form.value)
  }
  ElMessage.success('保存成功')
  dialogVisible.value = false
  loadList()
}

function handleUploadSuccess(res: any) {
  form.value.image = res.url
  ElMessage.success('上传成功')
}

onMounted(() => { loadList() })
</script>

<style scoped>
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}
.avatar-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
