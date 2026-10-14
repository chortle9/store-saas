<template>
  <view class="container">
    <!-- 用户信息 -->
    <view class="user-header">
      <view class="avatar">张</view>
      <view class="user-info">
        <view class="user-name">张女士</view>
        <view class="user-level">金卡会员</view>
      </view>
    </view>

    <!-- 订单快捷入口 -->
    <view class="order-card">
      <view class="card-title">我的订单</view>
      <view class="order-tabs">
        <view class="tab-item" @click="goPage('/pages/appointments/index')">
          <view class="tab-icon">📅</view>
          <view class="tab-label">待预约</view>
        </view>
        <view class="tab-item" @click="goPage('/pages/appointments/index')">
          <view class="tab-icon">💆</view>
          <view class="tab-label">服务中</view>
        </view>
        <view class="tab-item" @click="goPage('/pages/appointments/index')">
          <view class="tab-icon">✅</view>
          <view class="tab-label">已完成</view>
        </view>
        <view class="tab-item" @click="goPage('/pages/coupons/index')">
          <view class="tab-icon">🎫</view>
          <view class="tab-label">优惠券</view>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-card">
      <view class="menu-item" @click="goPage('/pages/appointments/index')">
        <view class="menu-left">
          <text class="menu-icon">📋</text>
          <text class="menu-name">我的预约</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goPage('/pages/cards/index')">
        <view class="menu-left">
          <text class="menu-icon">💳</text>
          <text class="menu-name">我的卡项</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goPage('/pages/points/index')">
        <view class="menu-left">
          <text class="menu-icon">⭐</text>
          <text class="menu-name">我的积分</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goPage('/pages/location/index')">
        <view class="menu-left">
          <text class="menu-icon">📍</text>
          <text class="menu-name">门店地址</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goPage('/pages/contact/index')">
        <view class="menu-left">
          <text class="menu-icon">📞</text>
          <text class="menu-name">联系客服</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goPage('/pages/setting/index')">
        <view class="menu-left">
          <text class="menu-icon">⚙️</text>
          <text class="menu-name">设置</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- 退出登录 -->
    <button class="logout-btn" @click="logout">退出登录</button>
  </view>
</template>

<script setup>
function goPage(url) {
  uni.navigateTo({ url })
}

function logout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.clearStorageSync()
        uni.reLaunch({ url: '/pages/index/index' })
      }
    },
  })
}
</script>

<style scoped>
.container {
  padding-bottom: 30rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.user-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60rpx 40rpx;
  display: flex;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  color: #fff;
  margin-right: 30rpx;
}

.user-name {
  font-size: 36rpx;
  color: #fff;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.user-level {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.order-card {
  background: #fff;
  margin: -30rpx 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
}

.order-tabs {
  display: flex;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-icon {
  font-size: 44rpx;
  margin-bottom: 12rpx;
}

.tab-label {
  font-size: 24rpx;
  color: #666;
}

.menu-card {
  background: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 0 30rpx;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}

.menu-name {
  font-size: 28rpx;
  color: #333;
}

.menu-arrow {
  font-size: 32rpx;
  color: #ccc;
}

.logout-btn {
  margin: 40rpx 20rpx;
  background: #fff;
  color: #f5576c;
  border: none;
  border-radius: 16rpx;
  font-size: 30rpx;
}
</style>
