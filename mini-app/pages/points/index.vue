<template>
  <view class="container">
    <view class="header">
      <view class="points-num">{{ points }}</view>
      <view class="points-label">我的积分</view>
    </view>

    <view class="exchange-section">
      <view class="section-title">积分兑换</view>
      <view class="exchange-grid">
        <view class="exchange-item" v-for="item in exchangeItems" :key="item.id" @click="exchange(item)">
          <view class="exchange-icon">🎁</view>
          <view class="exchange-name">{{ item.name }}</view>
          <view class="exchange-points">{{ item.points }}积分</view>
        </view>
      </view>
    </view>

    <view class="history-section">
      <view class="section-title">积分明细</view>
      <view class="history-list">
        <view class="history-item" v-for="item in historyList" :key="item.id">
          <view class="history-left">
            <view class="history-title">{{ item.title }}</view>
            <view class="history-date">{{ item.date }}</view>
          </view>
          <view class="history-points" :class="item.type">
            {{ item.type === 'add' ? '+' : '-' }}{{ item.points }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const points = ref(560)

const exchangeItems = [
  { id: 1, name: '20元优惠券', points: 500 },
  { id: 2, name: '50元优惠券', points: 1200 },
  { id: 3, name: '手部护理一次', points: 2000 },
  { id: 4, name: '面膜一盒', points: 1500 },
]

const historyList = ref([
  { id: 1, title: '消费获得积分', date: '2026-10-10', points: 200, type: 'add' },
  { id: 2, title: '签到获得积分', date: '2026-10-09', points: 10, type: 'add' },
  { id: 3, title: '兑换20元优惠券', date: '2026-10-01', points: 500, type: 'sub' },
  { id: 4, title: '消费获得积分', date: '2026-09-25', points: 350, type: 'add' },
])

function exchange(item) {
  if (points.value >= item.points) {
    uni.showModal({
      title: '确认兑换',
      content: `确定要用${item.points}积分兑换${item.name}吗？`,
      success: (res) => {
        if (res.confirm) {
          points.value -= item.points
          uni.showToast({ title: '兑换成功', icon: 'success' })
        }
      },
    })
  } else {
    uni.showToast({ title: '积分不足', icon: 'none' })
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #ff9a9e, #fad0c4);
  padding: 60rpx 40rpx 60rpx;
  text-align: center;
  color: #fff;
}

.points-num {
  font-size: 64rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.points-label {
  font-size: 28rpx;
  opacity: 0.9;
}

.exchange-section {
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

.exchange-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.exchange-item {
  text-align: center;
}

.exchange-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.exchange-name {
  font-size: 24rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.exchange-points {
  font-size: 22rpx;
  color: #ff6b6b;
}

.history-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.history-list {
  display: flex;
  flex-direction: column;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.history-title {
  font-size: 28rpx;
  margin-bottom: 6rpx;
}

.history-date {
  font-size: 22rpx;
  color: #999;
}

.history-points {
  font-size: 28rpx;
  font-weight: 600;
}

.history-points.add {
  color: #52c41a;
}

.history-points.sub {
  color: #f5222d;
}
</style>
