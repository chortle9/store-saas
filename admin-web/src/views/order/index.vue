<template>
  <div class="pos-page">
    <!-- 顶部统计栏 -->
    <div class="pos-stats">
      <div class="stat-card">
        <div class="stat-label">今日营收</div>
        <div class="stat-value">¥{{ todayRevenue }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">今日订单</div>
        <div class="stat-value">{{ todayOrderCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">今日客流</div>
        <div class="stat-value">{{ todayCustomerCount }}</div>
      </div>
    </div>

    <div class="pos-main">
      <!-- 左侧：服务选择 -->
      <div class="pos-left">
        <div class="search-bar">
          <el-input v-model="searchKey" placeholder="搜索服务项目..." clearable style="width: 250px" />
          <el-button type="primary" @click="dialogVisible = true">
            <el-icon><Plus /></el-icon> 快速开单
          </el-button>
        </div>

        <!-- 服务分类标签 -->
        <div class="category-tabs">
          <span
            v-for="cat in categories"
            :key="cat"
            class="tab"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </span>
        </div>

        <!-- 服务网格 -->
        <div class="service-grid">
          <div
            v-for="service in filteredServices"
            :key="service.id"
            class="service-item"
            @click="addService(service)"
          >
            <div class="service-name">{{ service.name }}</div>
            <div class="service-price">¥{{ service.price }}</div>
            <div class="service-duration">{{ service.duration || '60分钟' }}</div>
          </div>
        </div>
      </div>

      <!-- 右侧：购物车结算 -->
      <div class="pos-right">
        <div class="cart-header">
          <h3>收银台</h3>
          <el-button text @click="clearCart">清空</el-button>
        </div>

        <!-- 会员选择 -->
        <div class="member-select">
          <el-select
            v-model="selectedMemberId"
            placeholder="选择会员（可选）"
            filterable
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="m in members"
              :key="m.id"
              :label="m.name + ' (' + m.phone + ')'"
              :value="m.id"
            />
          </el-select>
          <div v-if="selectedMember" class="member-info">
            <span>余额：¥{{ selectedMember.balance || 0 }}</span>
            <span>积分：{{ selectedMember.points || 0 }}</span>
          </div>
        </div>

        <!-- 已选项目 -->
        <div class="cart-items">
          <div v-if="cartItems.length === 0" class="empty-cart">
            点击左侧服务添加项目
          </div>
          <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
            <div class="item-info">
              <div class="item-name">{{ item.itemName }}</div>
              <div class="item-staff">
                <el-select v-model="item.staffId" placeholder="选择技师" size="small" style="width: 120px">
                  <el-option v-for="s in staffList" :key="s.id" :label="s.name" :value="s.id" />
                </el-select>
              </div>
            </div>
            <div class="item-control">
              <el-input-number v-model="item.quantity" :min="1" size="small" />
              <div class="item-price">¥{{ item.price * item.quantity }}</div>
              <el-button size="small" type="danger" circle @click="removeItem(index)">×</el-button>
            </div>
          </div>
        </div>

        <!-- 金额计算 -->
        <div class="amount-section">
          <div class="amount-row">
            <span>原价</span>
            <span>¥{{ originalAmount }}</span>
          </div>
          <div class="amount-row">
            <span>优惠</span>
            <el-input-number v-model="discountAmount" :min="0" :precision="2" size="small" style="width: 100px" />
          </div>
          <div class="amount-row total">
            <span>应收</span>
            <span class="total-price">¥{{ payAmount }}</span>
          </div>
        </div>

        <!-- 支付方式 -->
        <div class="pay-section">
          <div class="pay-label">支付方式</div>
          <div class="pay-grid">
            <div
              v-for="pay in payMethods"
              :key="pay.value"
              class="pay-option"
              :class="{ active: form.payMethod === pay.value }"
              @click="form.payMethod = pay.value"
            >
              {{ pay.label }}
            </div>
          </div>
        </div>

        <!-- 备注 -->
        <el-input
          v-model="form.remark"
          type="textarea"
          placeholder="备注..."
          :rows="2"
          style="margin-top: 12px"
        />

        <!-- 结算按钮 -->
        <button class="checkout-btn" @click="handleCheckout">
          确认收款 ¥{{ payAmount }}
        </button>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="order-list-section" style="margin-top: 24px">
      <el-card>
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center">
            <span>今日订单</span>
            <el-button text @click="loadOrders">刷新</el-button>
          </div>
        </template>
        <el-table :data="todayOrders" v-loading="orderLoading" style="width: 100%">
          <el-table-column prop="orderNo" label="订单号" width="180" />
          <el-table-column prop="memberName" label="客户" width="100" />
          <el-table-column prop="payAmount" label="金额" width="100">
            <template #default="{ row }">¥{{ row.payAmount }}</template>
          </el-table-column>
          <el-table-column prop="payMethod" label="支付" width="80">
            <template #default="{ row }">{{ payMethodText[row.payMethod] || row.payMethod }}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.status === 'completed' ? 'success' : 'warning'" size="small">
                {{ row.status === 'completed' ? '已完成' : '待支付' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="paidAt" label="时间" />
        </el-table>
      </el-card>
    </div>

    <!-- 开单弹窗（保留兼容） -->
    <el-dialog v-model="dialogVisible" title="快速开单" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="客户姓名">
          <el-input v-model="form.memberName" placeholder="散客直接填姓名" />
        </el-form-item>
        <el-form-item label="支付方式">
          <el-radio-group v-model="form.payMethod">
            <el-radio value="cash">现金</el-radio>
            <el-radio value="wechat">微信</el-radio>
            <el-radio value="alipay">支付宝</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleQuickSave">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getServiceList, getOrderList, createOrder, getStaffList } from '@/api'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const searchKey = ref('')
const activeCategory = ref('全部')
const services = ref<any[]>([])
const staffList = ref<any[]>([])
const members = ref<any[]>([])

const cartItems = ref<any[]>([])
const selectedMemberId = ref<number | null>(null)
const discountAmount = ref(0)
const form = ref<any>({
  payMethod: 'wechat',
  remark: '',
  memberName: '',
})

const todayRevenue = ref(0)
const todayOrderCount = ref(0)
const todayCustomerCount = ref(0)
const todayOrders = ref<any[]>([])
const orderLoading = ref(false)
const dialogVisible = ref(false)

const payMethods = [
  { value: 'wechat', label: '微信' },
  { value: 'alipay', label: '支付宝' },
  { value: 'cash', label: '现金' },
  { value: 'balance', label: '会员余额' },
  { value: 'card', label: '扣卡项' },
]

const payMethodText: Record<string, string> = {
  cash: '现金',
  wechat: '微信',
  alipay: '支付宝',
  balance: '余额',
  card: '卡项',
}

const categories = computed(() => {
  const cats = ['全部']
  services.value.forEach(s => {
    if (s.category && !cats.includes(s.category)) {
      cats.push(s.category)
    }
  })
  return cats
})

const filteredServices = computed(() => {
  let list = services.value
  if (activeCategory.value !== '全部') {
    list = list.filter(s => s.category === activeCategory.value)
  }
  if (searchKey.value) {
    list = list.filter(s => s.name.includes(searchKey.value))
  }
  return list
})

const selectedMember = computed(() => {
  return members.value.find(m => m.id === selectedMemberId.value)
})

const originalAmount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const payAmount = computed(() => {
  return Math.max(0, originalAmount.value - discountAmount.value)
})

function addService(service: any) {
  const existing = cartItems.value.find(i => i.itemId === service.id)
  if (existing) {
    existing.quantity += 1
  } else {
    cartItems.value.push({
      itemType: 'service',
      itemId: service.id,
      itemName: service.name,
      price: service.price,
      quantity: 1,
      staffId: null,
    })
  }
}

function removeItem(index: number) {
  cartItems.value.splice(index, 1)
}

function clearCart() {
  cartItems.value = []
  discountAmount.value = 0
}

async function handleCheckout() {
  if (cartItems.value.length === 0) {
    ElMessage.warning('请先选择服务项目')
    return
  }

  try {
    await createOrder({
      memberId: selectedMemberId.value || 0,
      memberName: selectedMember.value?.name || form.value.memberName || '散客',
      items: cartItems.value,
      payMethod: form.value.payMethod,
      discountAmount: discountAmount.value,
      remark: form.value.remark,
    })
    ElMessage.success('收款成功！')
    clearCart()
    form.value.memberName = ''
    form.value.remark = ''
    loadTodayData()
  } catch (error) {
    console.error('结账失败', error)
    ElMessage.error('结账失败')
  }
}

async function handleQuickSave() {
  if (!form.value.memberName) {
    ElMessage.warning('请输入客户姓名')
    return
  }
  try {
    await createOrder({
      memberId: 0,
      memberName: form.value.memberName,
      items: [{ itemType: 'service', itemName: '临时项目', price: 100, quantity: 1 }],
      payMethod: form.value.payMethod,
    })
    ElMessage.success('开单成功')
    dialogVisible.value = false
    loadTodayData()
  } catch (error) {
    console.error('开单失败', error)
  }
}

async function loadTodayData() {
  // 今日营收
  const revenueRes: any = await request.get('/orders/today-revenue')
  todayRevenue.value = revenueRes.todayRevenue || 0

  // 今日订单
  const orderRes: any = await getOrderList({ page: 1, pageSize: 20 })
  todayOrders.value = orderRes.list || []
  todayOrderCount.value = orderRes.total || 0
  todayCustomerCount.value = orderRes.list?.length || 0
}

onMounted(async () => {
  const [serviceRes, staffRes] = await Promise.all([
    getServiceList(),
    getStaffList(),
  ])
  services.value = serviceRes || []
  staffList.value = staffRes || []
  loadTodayData()

  // 加载会员列表
  try {
    const memberRes: any = await request.get('/members')
    members.value = memberRes.list || memberRes || []
  } catch (e) {
    console.log('加载会员失败', e)
  }
})
</script>

<style scoped>
.pos-page {
  padding: 0;
}

.pos-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.stat-label {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.pos-main {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
}

.pos-left {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.tab {
  padding: 6px 16px;
  background: #f5f7fa;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab.active {
  background: #409eff;
  color: white;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
}

.service-item {
  border: 1px solid #ebeef5;
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.service-item:hover {
  border-color: #409eff;
  background: #ecf5ff;
}

.service-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.service-price {
  font-size: 18px;
  color: #f56c6c;
  font-weight: 600;
}

.service-duration {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.pos-right {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.cart-header h3 {
  margin: 0;
  font-size: 18px;
}

.member-select {
  margin-bottom: 16px;
}

.member-info {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #67c23a;
  margin-top: 8px;
}

.cart-items {
  flex: 1;
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.empty-cart {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.cart-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.item-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
}

.item-control {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
}

.item-price {
  font-weight: 600;
  color: #f56c6c;
  min-width: 60px;
  text-align: right;
}

.amount-section {
  border-top: 1px solid #ebeef5;
  padding-top: 12px;
  margin-bottom: 16px;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.amount-row.total {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.total-price {
  color: #f56c6c;
  font-size: 24px;
}

.pay-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.pay-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.pay-option {
  padding: 10px;
  text-align: center;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.pay-option.active {
  border-color: #409eff;
  background: #ecf5ff;
  color: #409eff;
}

.checkout-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
}
</style>
