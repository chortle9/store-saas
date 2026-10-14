<template>
  <view class="container">
    <!-- 会员卡片 -->
    <view class="member-card">
      <view class="card-bg"></view>
      <view class="card-content">
        <view class="member-name">{{ memberInfo.name || '尊贵会员' }}</view>
        <view class="member-level">{{ memberInfo.level || '普通会员' }}</view>
        <view class="card-number">**** **** **** 8888</view>
      </view>
    </view>

    <!-- 数据统计 -->
    <view class="stats-row">
      <view class="stat-item">
        <view class="stat-num">{{ memberInfo.balance || 0 }}</view>
        <view class="stat-label">账户余额</view>
      </view>
      <view class="stat-item">
        <view class="stat-num">{{ memberInfo.points || 0 }}</view>
        <view class="stat-label">可用积分</view>
      </view>
      <view class="stat-item">
        <view class="stat-num">{{ memberInfo.coupons || 0 }}</view>
        <view class="stat-label">优惠券</view>
      </view>
    </view>

    <!-- 充值入口 -->
    <view class="section">
      <view class="section-title">余额充值</view>
      <view class="recharge-grid">
        <view
          v-for="item in rechargeOptions"
          :key="item.amount"
          class="recharge-item"
          :class="{ selected: selectedRecharge === item.amount }"
          @click="selectedRecharge = item.amount"
        >
          <view class="amount">¥{{ item.amount }}</view>
          <view class="gift" v-if="item.gift">送¥{{ item.gift }}</view>
        </view>
      </view>
      <button class="recharge-btn" @click="doRecharge">立即充值</button>
    </view>

    <!-- 我的卡项 -->
    <view class="section">
      <view class="section-title">我的卡项</view>
      <view class="card-list">
        <view class="card-item" v-for="card in myCards" :key="card.id">
          <view class="card-icon">💳</view>
          <view class="card-info">
            <view class="card-name">{{ card.name }}</view>
            <view class="card-desc">剩余 {{ card.remaining || 0 }} 次</view>
          </view>
          <view class="card-status">可用</view>
        </view>
        <view v-if="myCards.length === 0" class="empty-tip">
          暂无卡项
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request.js'

const memberInfo = ref({})
const myCards = ref([])
const selectedRecharge = ref(500)

const rechargeOptions = [
  { amount: 100, gift: 0 },
  { amount: 500, gift: 50 },
  { amount: 1000, gift: 150 },
  { amount: 2000, gift: 400 },
  { amount: 5000, gift: 1200 },
]

onMounted(() => {
  loadData()
})

async function loadData() {
  // 模拟会员数据，实际应从登录态获取
  memberInfo.value = {
    name: '张女士',
    level: '金卡会员',
    balance: 1280,
    points: 560,
    coupons: 3,
  }
  myCards.value = [
    { id: 1, name: '面部护理10次卡', remaining: 6 },
    { id: 2, name: '全身SPA5次卡', remaining: 2 },
  ]
}

function doRecharge() {
  uni.showToast({ title: '充值功能开发中', icon: 'none' })
}
</script>

<style scoped>
.container {
  padding-bottom: 30rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.member-card {
  height: 300rpx;
  margin: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  position: relative;
}

.card-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%);
}

.card-content {
  position: relative;
  padding: 40rpx;
  color: #fff;
}

.member-name {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.member-level {
  font-size: 24rpx;
  opacity: 0.9;
  margin-bottom: 40rpx;
}

.card-number {
  font-size: 28rpx;
  letter-spacing: 4rpx;
  opacity: 0.8;
}

.stats-row {
  display: flex;
  background: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 30rpx 0;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-num {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.section {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
}

.recharge-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.recharge-item {
  padding: 24rpx;
  text-align: center;
  border: 2rpx solid #f0f0f0;
  border-radius: 12rpx;
}

.recharge-item.selected {
  border-color: #667eea;
  background: #f5f7ff;
}

.amount {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.gift {
  font-size: 22rpx;
  color: #f5576c;
}

.recharge-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border: none;
  border-radius: 40rpx;
  padding: 20rpx;
  font-size: 30rpx;
}

.card-list {
  display: flex;
  flex-direction: column;
}

.card-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #f9f9f9;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
}

.card-icon {
  font-size: 48rpx;
  margin-right: 20rpx;
}

.card-info {
  flex: 1;
}

.card-name {
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 6rpx;
}

.card-desc {
  font-size: 24rpx;
  color: #999;
}

.card-status {
  font-size: 24rpx;
  color: #67c23a;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 40rpx 0;
  font-size: 26rpx;
}
</style>
