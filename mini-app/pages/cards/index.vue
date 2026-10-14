<template>
  <view class="container">
    <view class="header">
      <view class="header-title">我的卡项</view>
    </view>

    <view class="card-list">
      <view class="card-item" v-for="card in cardList" :key="card.id">
        <view class="card-bg"></view>
        <view class="card-content">
          <view class="card-name">{{ card.name }}</view>
          <view class="card-desc">剩余 {{ card.remaining }} 次 / 共 {{ card.total }} 次</view>
          <view class="card-progress">
            <view class="progress-bar">
              <view class="progress-inner" :style="{ width: (card.remaining / card.total * 100) + '%' }"></view>
            </view>
          </view>
          <view class="card-expire">有效期至 {{ card.expireDate }}</view>
        </view>
      </view>
      <view v-if="cardList.length === 0" class="empty-tip">
        暂无卡项
      </view>
    </view>

    <view class="buy-more" @click="buyCard">
      <text>购买更多卡项 ></text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const cardList = ref([
  { id: 1, name: '面部护理10次卡', remaining: 6, total: 10, expireDate: '2027-06-30' },
  { id: 2, name: '全身SPA5次卡', remaining: 2, total: 5, expireDate: '2026-12-31' },
  { id: 3, name: '美甲次卡', remaining: 8, total: 12, expireDate: '2027-03-31' },
])

function buyCard() {
  uni.showToast({ title: '请联系店员购买', icon: 'none' })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40rpx;
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

.card-list {
  padding: 20rpx;
}

.card-item {
  position: relative;
  height: 200rpx;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.card-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #2c3e50, #4ca1af);
}

.card-content {
  position: relative;
  padding: 30rpx;
  color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-name {
  font-size: 32rpx;
  font-weight: 600;
}

.card-desc {
  font-size: 26rpx;
  opacity: 0.9;
}

.card-progress {
  margin: 16rpx 0;
}

.progress-bar {
  height: 8rpx;
  background: rgba(255,255,255,0.3);
  border-radius: 4rpx;
}

.progress-inner {
  height: 100%;
  background: #fff;
  border-radius: 4rpx;
}

.card-expire {
  font-size: 22rpx;
  opacity: 0.8;
}

.buy-more {
  text-align: center;
  padding: 30rpx;
  color: #667eea;
  font-size: 28rpx;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 100rpx 0;
  font-size: 26rpx;
}
</style>
