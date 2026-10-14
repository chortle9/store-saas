<template>
  <view class="container">
    <view class="header">
      <view class="header-title">我的优惠券</view>
    </view>

    <!-- 标签切换 -->
    <view class="tabs">
      <view class="tab" :class="{ active: activeTab === 0 }" @click="activeTab = 0">未使用</view>
      <view class="tab" :class="{ active: activeTab === 1 }" @click="activeTab = 1">已使用</view>
      <view class="tab" :class="{ active: activeTab === 2 }" @click="activeTab = 2">已过期</view>
    </view>

    <!-- 优惠券列表 -->
    <view class="coupon-list">
      <view class="coupon-item" v-for="coupon in filteredCoupons" :key="coupon.id">
        <view class="coupon-left">
          <view class="coupon-amount">¥{{ coupon.value }}</view>
          <view class="coupon-threshold">满{{ coupon.minConsume }}可用</view>
        </view>
        <view class="coupon-right">
          <view class="coupon-name">{{ coupon.name }}</view>
          <view class="coupon-date">有效期至 {{ coupon.expireDate }}</view>
          <view class="coupon-btn" v-if="activeTab === 0" @click="useCoupon(coupon)">立即使用</view>
          <view class="coupon-status" v-else>{{ activeTab === 1 ? '已使用' : '已过期' }}</view>
        </view>
      </view>
      <view v-if="filteredCoupons.length === 0" class="empty-tip">
        暂无优惠券
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref(0)

const coupons = ref([
  { id: 1, name: '新客立减券', value: 50, minConsume: 200, expireDate: '2026-12-31', status: 'unused' },
  { id: 2, name: '周末特惠券', value: 30, minConsume: 150, expireDate: '2026-11-30', status: 'unused' },
  { id: 3, name: '会员专享券', value: 100, minConsume: 500, expireDate: '2026-10-15', status: 'used' },
  { id: 4, name: '生日福利券', value: 80, minConsume: 300, expireDate: '2026-09-30', status: 'expired' },
])

const filteredCoupons = computed(() => {
  const statusMap = ['unused', 'used', 'expired']
  return coupons.value.filter(c => c.status === statusMap[activeTab.value])
})

function useCoupon(coupon) {
  uni.switchTab({ url: '/pages/appointment/index' })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 60rpx 40rpx 40rpx;
  color: #fff;
}

.header-title {
  font-size: 36rpx;
  font-weight: 600;
}

.tabs {
  display: flex;
  background: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 8rpx;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 28rpx;
  color: #666;
  border-radius: 8rpx;
}

.tab.active {
  background: #667eea;
  color: #fff;
}

.coupon-list {
  padding: 0 20rpx;
}

.coupon-item {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.coupon-left {
  width: 200rpx;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0;
}

.coupon-amount {
  font-size: 48rpx;
  font-weight: 600;
}

.coupon-threshold {
  font-size: 22rpx;
  opacity: 0.9;
  margin-top: 8rpx;
}

.coupon-right {
  flex: 1;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.coupon-name {
  font-size: 30rpx;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.coupon-date {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 16rpx;
}

.coupon-btn {
  align-self: flex-end;
  background: #ff6b6b;
  color: #fff;
  padding: 8rpx 24rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.coupon-status {
  align-self: flex-end;
  color: #999;
  font-size: 24rpx;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 100rpx 0;
  font-size: 26rpx;
}
</style>
