<template>
  <view class="container">
    <!-- 店铺头图 -->
    <view class="banner">
      <view class="banner-content">
        <view class="shop-name">店小伴美容</view>
        <view class="shop-desc">专业美肤护理 · 让美丽更简单</view>
      </view>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-entry">
      <view class="entry-item" @click="goToAppointment">
        <view class="entry-icon" style="background: #667eea">📅</view>
        <text>在线预约</text>
      </view>
      <view class="entry-item">
        <view class="entry-icon" style="background: #f5576c">🎫</view>
        <text>优惠券</text>
      </view>
      <view class="entry-item">
        <view class="entry-icon" style="background: #4facfe">👤</view>
        <text>会员卡</text>
      </view>
      <view class="entry-item">
        <view class="entry-icon" style="background: #43e97b">⭐</view>
        <text>我的收藏</text>
      </view>
    </view>

    <!-- 热门项目 -->
    <view class="section">
      <view class="section-title">
        <text>热门项目</text>
        <text class="more">更多 ></text>
      </view>
      <view class="service-list">
        <view class="service-item" v-for="item in services" :key="item.id">
          <image class="service-img" :src="item.image" mode="aspectFill" />
          <view class="service-info">
            <view class="service-name">{{ item.name }}</view>
            <view class="service-duration">{{ item.duration }}分钟</view>
            <view class="service-price">¥{{ item.price }}</view>
          </view>
          <view class="service-btn" @click="goToAppointment">预约</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const services = [
  { id: 1, name: '深层清洁护理', duration: 60, price: 198, image: '/static/service1.jpg' },
  { id: 2, name: '补水保湿SPA', duration: 90, price: 298, image: '/static/service2.jpg' },
  { id: 3, name: '肩颈放松理疗', duration: 45, price: 168, image: '/static/service3.jpg' },
]

function goToAppointment() {
  uni.switchTab({ url: '/pages/appointment/index' })
}
</script>

<style scoped>
.container {
  padding-bottom: 20rpx;
}

.banner {
  height: 300rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  padding: 0 40rpx;
}

.banner-content {
  color: #fff;
}

.shop-name {
  font-size: 40rpx;
  font-weight: 600;
  margin-bottom: 10rpx;
}

.shop-desc {
  font-size: 26rpx;
  opacity: 0.9;
}

.quick-entry {
  display: flex;
  justify-content: space-around;
  background: #fff;
  margin: -40rpx 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 30rpx 0;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24rpx;
  color: #333;
}

.entry-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  margin-bottom: 12rpx;
}

.section {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 20rpx;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 20rpx;
}

.more {
  font-size: 24rpx;
  color: #999;
  font-weight: normal;
}

.service-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.service-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
  margin-right: 20rpx;
}

.service-info {
  flex: 1;
}

.service-name {
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.service-duration {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.service-price {
  font-size: 32rpx;
  color: #f5576c;
  font-weight: 600;
}

.service-btn {
  background: #667eea;
  color: #fff;
  padding: 12rpx 30rpx;
  border-radius: 30rpx;
  font-size: 26rpx;
}
</style>
