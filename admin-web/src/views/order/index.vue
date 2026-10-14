<template>
  <div class="page-container">
    <div class="card">
      <div class="search-bar">
        <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        <el-select v-model="statusFilter" placeholder="订单状态" clearable style="width: 150px">
          <el-option label="已完成" value="completed" />
          <el-option label="待支付" value="pending" />
          <el-option label="已退款" value="refunded" />
        </el-select>
        <el-button type="primary" @click="loadList">查询</el-button>
        <el-button type="success" @click="handleAdd">
          <el-icon><Plus /></el-icon>快速开单
        </el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%; margin-top: 20px">
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="memberName" label="客户" width="100" />
        <el-table-column prop="totalAmount" label="订单金额" width="100">
          <template #default="{ row }">¥{{ row.totalAmount }}</template>
        </el-table-column>
        <el-table-column prop="payAmount" label="实付金额" width="100">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: 600">¥{{ row.payAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payMethod" label="支付方式" width="100">
          <template #default="{ row }">
            {{ payMethodText[row.payMethod] || row.payMethod }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="orderStatusType[row.status] || 'info'">
              {{ orderStatusText[row.status] || row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paidAt" label="支付时间" width="180" />
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

    <!-- 开单弹窗 -->
    <el-dialog v-model="dialogVisible" title="快速开单" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="客户姓名">
          <el-input v-model="form.memberName" placeholder="客户姓名" />
        </el-form-item>
        <el-form-item label="服务项目">
          <el-select v-model="selectedService" placeholder="选择项目" style="width: 100%" @change="addItem">
            <el-option label="基础护理 ¥198" :value="{ name: '基础护理', price: 198 }" />
            <el-option label="深度清洁 ¥298" :value="{ name: '深度清洁', price: 298 }" />
            <el-option label="美甲 ¥158" :value="{ name: '美甲', price: 158 }" />
          </el-select>
        </el-form-item>

        <div v-for="(item, index) in form.items" :key="index" class="order-item">
          <span>{{ item.itemName }} × {{ item.quantity }}</span>
          <span>¥{{ item.price * item.quantity }}</span>
          <el-button size="small" type="danger" circle @click="removeItem(index)">×</el-button>
        </div>

        <el-form-item label="支付方式">
          <el-radio-group v-model="form.payMethod">
            <el-radio value="cash">现金</el-radio>
            <el-radio value="wechat">微信</el-radio>
            <el-radio value="alipay">支付宝</el-radio>
            <el-radio value="balance">余额</el-radio>
          </el-radio-group>
        </el-form-item>

        <div class="order-total">
          合计：¥{{ totalAmount }}
        </div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确认收款</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getOrderList, createOrder } from '@/api'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const tableData = ref<any[]>([])
const dateRange = ref<Date[]>([])
const statusFilter = ref('')
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

const dialogVisible = ref(false)
const selectedService = ref<any>(null)
const form = ref<any>({ items: [], payMethod: 'wechat', discountAmount: 0 })

const payMethodText: Record<string, string> = {
  cash: '现金',
  wechat: '微信',
  alipay: '支付宝',
  balance: '余额',
  card: '卡项',
}

const orderStatusType: Record<string, string> = {
  pending: 'warning',
  completed: 'success',
  refunded: 'danger',
}

const orderStatusText: Record<string, string> = {
  pending: '待支付',
  completed: '已完成',
  refunded: '已退款',
}

const totalAmount = computed(() => {
  return form.value.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
})

async function loadList() {
  loading.value = true
  try {
    const params: any = { page: page.value, pageSize: pageSize.value }
    if (statusFilter.value) params.status = statusFilter.value
    const res = await getOrderList(params)
    tableData.value = res.list
    total.value = res.total
  } catch (error) {
    console.error('加载订单失败', error)
  } finally {
    loading.value = false
  }
}

function addItem(val: any) {
  if (!val) return
  form.value.items.push({
    itemType: 'service',
    itemName: val.name,
    price: val.price,
    quantity: 1,
  })
  selectedService.value = null
}

function removeItem(index: number) {
  form.value.items.splice(index, 1)
}

function handleAdd() {
  form.value = { items: [], payMethod: 'wechat', discountAmount: 0 }
  dialogVisible.value = true
}

async function handleSave() {
  if (!form.value.memberName) {
    ElMessage.warning('请输入客户姓名')
    return
  }
  if (form.value.items.length === 0) {
    ElMessage.warning('请添加服务项目')
    return
  }

  try {
    await createOrder({
      ...form.value,
      memberId: 1, // 简化：实际应选择会员
    })
    ElMessage.success('开单成功')
    dialogVisible.value = false
    loadList()
  } catch (error) {
    console.error('开单失败', error)
  }
}

onMounted(() => { loadList() })
</script>

<style scoped>
.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 8px;
}
.order-total {
  text-align: right;
  font-size: 18px;
  font-weight: 600;
  color: #f56c6c;
  margin-top: 16px;
}
</style>
