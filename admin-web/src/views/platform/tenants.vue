<template>
  <div>
    <div class="card">
      <div class="search-bar">
        <el-input v-model="keyword" placeholder="搜索店铺名称" style="width: 250px" clearable />
        <el-button type="primary" @click="loadList">搜索</el-button>
        <el-button type="success" @click="handleCreate">
          <el-icon><Plus /></el-icon>开通新店铺
        </el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="店铺名称" width="180" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="address" label="地址" show-overflow-tooltip />
        <el-table-column prop="plan" label="套餐" width="100">
          <template #default="{ row }">
            <el-tag :type="planTypeMap[row.plan] || 'info'">
              {{ planText[row.plan] || row.plan }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="planExpireAt" label="到期时间" width="120">
          <template #default="{ row }">
            {{ row.planExpireAt ? row.planExpireAt.slice(0, 10) : '未设置' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '营业中' : '已停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="入驻时间" width="120">
          <template #default="{ row }">
            {{ row.createdAt ? row.createdAt.slice(0, 10) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleRenew(row)">续费</el-button>
            <el-button size="small" @click="handleDetail(row)">详情</el-button>
            <el-button size="small" :type="row.status === 1 ? 'danger' : 'success'" @click="handleToggleStatus(row)">
              {{ row.status === 1 ? '停用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, next"
        style="margin-top: 20px; justify-content: flex-end; display: flex"
        @current-change="loadList"
      />
    </div>

    <!-- 开通新店铺弹窗 -->
    <el-dialog v-model="createDialogVisible" title="开通新店铺" width="600px">
      <el-form :model="createForm" label-width="100px">
        <el-divider content-position="left">店铺信息</el-divider>
        <el-form-item label="店铺名称" required>
          <el-input v-model="createForm.name" placeholder="如：XX美容店" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="createForm.phone" placeholder="店铺联系电话" />
        </el-form-item>
        <el-form-item label="店铺地址">
          <el-input v-model="createForm.address" placeholder="店铺地址" />
        </el-form-item>

        <el-divider content-position="left">管理员账号</el-divider>
        <el-form-item label="登录账号" required>
          <el-input v-model="createForm.adminUsername" placeholder="管理员登录账号" />
        </el-form-item>
        <el-form-item label="登录密码" required>
          <el-input v-model="createForm.adminPassword" placeholder="初始密码" />
        </el-form-item>
        <el-form-item label="管理员姓名" required>
          <el-input v-model="createForm.adminName" placeholder="老板姓名" />
        </el-form-item>

        <el-divider content-position="left">套餐配置</el-divider>
        <el-form-item label="套餐类型">
          <el-select v-model="createForm.plan" style="width: 100%">
            <el-option label="基础版 499/年" value="basic" />
            <el-option label="专业版 899/年" value="pro" />
            <el-option label="连锁版 1999/年" value="enterprise" />
          </el-select>
        </el-form-item>
        <el-form-item label="有效期(天)">
          <el-input-number v-model="createForm.validDays" :min="1" :max="3650" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateTenant">确认开通</el-button>
      </template>
    </el-dialog>

    <!-- 续费弹窗 -->
    <el-dialog v-model="renewDialogVisible" title="店铺续费" width="400px">
      <p style="margin-bottom: 16px">店铺：<b>{{ renewForm.name }}</b></p>
      <el-form label-width="100px">
        <el-form-item label="续费时长">
          <el-select v-model="renewForm.validDays" style="width: 100%">
            <el-option label="续费1年 (365天)" :value="365" />
            <el-option label="续费2年 (730天)" :value="730" />
            <el-option label="续费半年 (180天)" :value="180" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="renewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRenewConfirm">确认续费</el-button>
      </template>
    </el-dialog>

    <!-- 店铺详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="店铺详情" width="500px">
      <el-descriptions :column="1" border v-if="detailData">
        <el-descriptions-item label="店铺名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ detailData.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{ detailData.address || '-' }}</el-descriptions-item>
        <el-descriptions-item label="套餐">{{ planText[detailData.plan] }}</el-descriptions-item>
        <el-descriptions-item label="到期时间">{{ detailData.planExpireAt?.slice(0, 10) }}</el-descriptions-item>
        <el-descriptions-item label="会员数量">{{ detailData.memberCount }} 人</el-descriptions-item>
        <el-descriptions-item label="累计营收">¥{{ detailData.revenue }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detailData.status === 1 ? 'success' : 'danger'">
            {{ detailData.status === 1 ? '营业中' : '已停用' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTenantList, createTenant, updateTenant, getTenantDetail } from '@/api/platform'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref<any[]>([])
const keyword = ref('')
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

const createDialogVisible = ref(false)
const createForm = ref<any>({
  plan: 'pro',
  validDays: 365,
  adminPassword: '123456',
})

const renewDialogVisible = ref(false)
const renewForm = ref<any>({})

const detailDialogVisible = ref(false)
const detailData = ref<any>(null)

const planTypeMap: Record<string, string> = {
  basic: 'info',
  pro: 'primary',
  enterprise: 'danger',
}

const planText: Record<string, string> = {
  basic: '基础版',
  pro: '专业版',
  enterprise: '连锁版',
}

async function loadList() {
  loading.value = true
  try {
    const res = await getTenantList({
      page: page.value,
      pageSize: pageSize.value,
      keyword: keyword.value,
    })
    tableData.value = res.list
    total.value = res.total
  } catch (error) {
    console.error('加载店铺列表失败', error)
  } finally {
    loading.value = false
  }
}

function handleCreate() {
  createForm.value = { plan: 'pro', validDays: 365, adminPassword: '123456' }
  createDialogVisible.value = true
}

async function handleCreateTenant() {
  try {
    await createTenant(createForm.value)
    ElMessage.success('店铺开通成功')
    createDialogVisible.value = false
    loadList()
  } catch (error) {
    console.error('开通失败', error)
  }
}

function handleRenew(row: any) {
  renewForm.value = { ...row, validDays: 365 }
  renewDialogVisible.value = true
}

async function handleRenewConfirm() {
  try {
    await updateTenant(renewForm.value.id, { validDays: renewForm.value.validDays })
    ElMessage.success('续费成功')
    renewDialogVisible.value = false
    loadList()
  } catch (error) {
    console.error('续费失败', error)
  }
}

async function handleDetail(row: any) {
  try {
    detailData.value = await getTenantDetail(row.id)
    detailDialogVisible.value = true
  } catch (error) {
    console.error('获取详情失败', error)
  }
}

function handleToggleStatus(row: any) {
  const action = row.status === 1 ? '停用' : '启用'
  ElMessageBox.confirm(`确定要${action}店铺「${row.name}」吗？`, '提示', {
    type: 'warning',
  }).then(async () => {
    await updateTenant(row.id, { status: row.status === 1 ? 0 : 1 })
    ElMessage.success(`${action}成功`)
    loadList()
  })
}

onMounted(() => { loadList() })
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
.search-bar {
  display: flex;
  gap: 12px;
}
</style>
