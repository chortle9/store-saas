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
      <div class="stat-card">
        <div class="stat-label">挂单数</div>
        <div class="stat-value">{{ pendingOrders.length }}</div>
      </div>
    </div>

    <div class="pos-main">
      <!-- 左侧：服务选择 -->
      <div class="pos-left">
        <div class="search-bar">
          <el-input v-model="searchKey" placeholder="搜索服务项目..." clearable style="width: 250px" />
          <div class="quick-btns">
            <el-button @click="showPendingOrders = true">
              挂单 ({{ pendingOrders.length }})
            </el-button>
          </div>
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
          <div>
            <el-button text @click="hangOrder">挂单</el-button>
            <el-button text @click="clearCart">清空</el-button>
          </div>
        </div>

        <!-- 会员选择：输手机号快速找 -->
        <div class="member-select">
          <el-input
            v-model="memberPhone"
            placeholder="输入手机号找会员"
            clearable
            @change="searchMember"
          >
            <template #prefix>
              <el-icon><Phone /></el-icon>
            </template>
          </el-input>
          <div v-if="selectedMember" class="member-info-card">
            <div class="member-avatar">{{ selectedMember.name?.charAt(0) }}</div>
            <div class="member-detail">
              <div class="member-name">{{ selectedMember.name }}</div>
              <div class="member-meta">
                <span>余额 ¥{{ selectedMember.balance || 0 }}</span>
                <span>积分 {{ selectedMember.points || 0 }}</span>
              </div>
            </div>
            <el-button size="small" text @click="selectedMemberId = null; selectedMember = null; memberPhone = ''">
              切换
            </el-button>
          </div>
        </div>

        <!-- 会员可用优惠券 -->
        <div v-if="memberCoupons.length > 0" class="coupon-section">
          <div class="section-label">可用优惠券</div>
          <div class="coupon-list">
            <div
              v-for="coupon in memberCoupons"
              :key="coupon.id"
              class="coupon-item"
              :class="{ selected: selectedCouponId === coupon.id }"
              @click="toggleCoupon(coupon)"
            >
              <div class="coupon-value">¥{{ coupon.value }}</div>
              <div class="coupon-name">{{ coupon.name }}</div>
            </div>
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
                <el-select v-model="item.staffId" placeholder="选技师" size="small" style="width: 110px">
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
            <span>¥{{ originalAmount.toFixed(2) }}</span>
          </div>
          <div v-if="discountAmount > 0" class="amount-row discount">
            <span>优惠</span>
            <span>-¥{{ discountAmount.toFixed(2) }}</span>
          </div>
          <div class="amount-row total">
            <span>应收</span>
            <span class="total-price">¥{{ payAmount.toFixed(2) }}</span>
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
          确认收款 ¥{{ payAmount.toFixed(2) }}
        </button>
      </div>
    </div>

    <!-- 挂单列表弹窗 -->
    <el-dialog v-model="showPendingOrders" title="挂单列表" width="600px">
      <div v-if="pendingOrders.length === 0" style="text-align: center; color: #999; padding: 40px">
        暂无挂单
      </div>
      <div v-for="(order, index) in pendingOrders" :key="index" class="pending-order-item">
        <div>
          <div class="order-name">{{ order.memberName || '散客' }}</div>
          <div class="order-items">{{ order.items.map((i: any) => i.itemName).join('、') }}</div>
        </div>
        <div class="order-right">
          <div class="order-amount">¥{{ order.payAmount }}</div>
          <el-button size="small" type="primary" @click="takeOrder(index)">取单</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 收银成功小票弹窗 -->
    <el-dialog v-model="showReceipt" title="收款成功" width="400px">
      <div class="receipt">
        <div class="receipt-header">
          <div class="receipt-shop">{{ tenantInfo?.name || '店小伴' }}</div>
          <div class="receipt-title">消费小票</div>
        </div>
        <div class="receipt-line">
          <span>订单号</span>
          <span>{{ lastOrder?.orderNo }}</span>
        </div>
        <div class="receipt-line">
          <span>时间</span>
          <span>{{ new Date().toLocaleString() }}</span>
        </div>
        <div class="receipt-divider"></div>
        <div v-for="item in lastOrder?.items" :key="item.id" class="receipt-line">
          <span>{{ item.itemName }} x{{ item.quantity }}</span>
          <span>¥{{ item.subtotal }}</span>
        </div>
        <div class="receipt-divider"></div>
        <div class="receipt-line">
          <span>实收</span>
          <span class="receipt-total">¥{{ lastOrder?.payAmount }}</span>
        </div>
        <div class="receipt-line">
          <span>支付方式</span>
          <span>{{ payMethodText[lastOrder?.payMethod] || lastOrder?.payMethod }}</span>
        </div>
        <div class="receipt-footer">
          谢谢惠顾，欢迎下次光临！
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="showReceipt = false">完成</el-button>
      </template>
    </el-dialog>

    <!-- 今日订单列表 -->
    <div class="order-list-section" style="margin-top: 24px">
      <el-card>
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center">
            <span>今日订单</span>
            <el-button text @click="loadTodayData">刷新</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getServiceList, getOrderList, createOrder, getStaffList, createPayment, mockPaySuccess } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const tenantInfo = computed(() => userStore.tenantInfo)

const searchKey = ref('')
const activeCategory = ref('全部')
const services = ref<any[]>([])
const staffList = ref<any[]>([])
const members = ref<any[]>([])

const cartItems = ref<any[]>([])
const selectedMemberId = ref<number | null>(null)
const selectedMember = ref<any>(null)
const memberPhone = ref('')
const memberCoupons = ref<any[]>([])
const selectedCouponId = ref<number | null>(null)
const discountAmount = ref(0)
const form = ref<any>({
  payMethod: 'wechat',
  remark: '',
})

const todayRevenue = ref(0)
const todayOrderCount = ref(0)
const todayCustomerCount = ref(0)
const todayOrders = ref<any[]>([])
const orderLoading = ref(false)

// 挂单
const pendingOrders = ref<any[]>([])
const showPendingOrders = ref(false)

// 小票
const showReceipt = ref(false)
const lastOrder = ref<any>(null)

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

const originalAmount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const payAmount = computed(() => {
  return Math.max(0, originalAmount.value - discountAmount.value)
})

// 输手机号找会员
async function searchMember() {
  if (!memberPhone.value || memberPhone.value.length < 11) return
  const res: any = await request.get('/members', { params: { phone: memberPhone.value } })
  const list = res.list || res || []
  const found = list.find((m: any) => m.phone === memberPhone.value)
  if (found) {
    selectedMemberId.value = found.id
    selectedMember.value = found
    ElMessage.success(`找到会员：${found.name}`)
    // 加载该会员的优惠券
    loadMemberCoupons(found.id)
  } else {
    ElMessage.info('未找到该会员，将按散客处理')
    selectedMemberId.value = null
    selectedMember.value = null
  }
}

// 加载会员优惠券
async function loadMemberCoupons(memberId: number) {
  try {
    const res: any = await request.get(`/marketing/member-coupons/${memberId}`)
    memberCoupons.value = (res || []).filter((c: any) => c.status === 'unused')
  } catch (e) {
    memberCoupons.value = []
  }
}

// 选择优惠券
function toggleCoupon(coupon: any) {
  if (selectedCouponId.value === coupon.id) {
    selectedCouponId.value = null
    discountAmount.value = 0
  } else {
    selectedCouponId.value = coupon.id
    discountAmount.value = coupon.value
  }
}

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
  selectedCouponId.value = null
}

// 挂单
function hangOrder() {
  if (cartItems.value.length === 0) {
    ElMessage.warning('购物车是空的，无法挂单')
    return
  }
  pendingOrders.value.push({
    memberName: selectedMember.value?.name || '散客',
    items: [...cartItems.value],
    payAmount: payAmount.value,
    savedAt: new Date(),
  })
  ElMessage.success('已挂单')
  clearCart()
  selectedMemberId.value = null
  selectedMember.value = null
  memberPhone.value = ''
}

// 取单
function takeOrder(index: number) {
  const order = pendingOrders.value[index]
  cartItems.value = order.items
  pendingOrders.value.splice(index, 1)
  showPendingOrders.value = false
  ElMessage.success('已取单')
}

async function handleCheckout() {
  if (cartItems.value.length === 0) {
    ElMessage.warning('请先选择服务项目')
    return
  }

  try {
    // 1. 创建订单
    const orderRes = await createOrder({
      memberId: selectedMemberId.value || 0,
      memberName: selectedMember.value?.name || '散客',
      items: cartItems.value,
      payMethod: form.value.payMethod,
      discountAmount: discountAmount.value,
      remark: form.value.remark,
    })

    // 2. 创建支付单
    const payRes = await createPayment({
      orderId: orderRes.id,
      amount: payAmount.value,
      payMethod: form.value.payMethod,
    })

    // 3. 模拟支付成功
    await mockPaySuccess(payRes.paymentNo)

    // 4. 显示小票
    lastOrder.value = {
      ...orderRes,
      payAmount: payAmount.value,
      payMethod: form.value.payMethod,
    }
    showReceipt.value = true

    clearCart()
    form.value.remark = ''
    selectedMemberId.value = null
    selectedMember.value = null
    memberPhone.value = ''
    loadTodayData()
  } catch (error) {
    console.error('结账失败', error)
    ElMessage.error('结账失败')
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
})
</script>

<style scoped>
.pos-page {
  padding: 0;
}

.pos-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
  margin-bottom: 12px;
}

.member-info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
  padding: 12px;
  background: #f0f9eb;
  border-radius: 6px;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #67c23a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.member-detail {
  flex: 1;
}

.member-name {
  font-weight: 600;
  font-size: 14px;
}

.member-meta {
  font-size: 12px;
  color: #67c23a;
  margin-top: 4px;
  display: flex;
  gap: 12px;
}

.coupon-section {
  margin-bottom: 12px;
}

.section-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.coupon-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.coupon-item {
  padding: 8px 12px;
  background: #fff5f5;
  border: 1px solid #fde2e2;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
}

.coupon-item.selected {
  background: #f56c6c;
  color: white;
}

.coupon-value {
  font-size: 16px;
  font-weight: 600;
}

.coupon-name {
  font-size: 11px;
  margin-top: 2px;
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

.amount-row.discount {
  color: #f56c6c;
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

.pending-order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.order-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.order-items {
  font-size: 12px;
  color: #999;
}

.order-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-amount {
  font-size: 18px;
  font-weight: 600;
  color: #f56c6c;
}

.receipt {
  text-align: center;
}

.receipt-header {
  margin-bottom: 16px;
}

.receipt-shop {
  font-size: 18px;
  font-weight: 600;
}

.receipt-title {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.receipt-line {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
}

.receipt-divider {
  border-top: 1px dashed #ccc;
  margin: 8px 0;
}

.receipt-total {
  font-size: 20px;
  font-weight: 600;
  color: #f56c6c;
}

.receipt-footer {
  margin-top: 20px;
  font-size: 12px;
  color: #999;
}
</style>
