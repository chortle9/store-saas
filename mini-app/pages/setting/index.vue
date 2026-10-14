<template>
  <view class="container">
    <view class="header">
      <view class="header-title">设置</view>
    </view>

    <view class="menu-card">
      <view class="menu-item" @click="showTip">
        <view class="menu-left">
          <text class="menu-icon">👤</text>
          <text class="menu-name">个人资料</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="showTip">
        <view class="menu-left">
          <text class="menu-icon">🔔</text>
          <text class="menu-name">消息通知</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="showTip">
        <view class="menu-left">
          <text class="menu-icon">🔒</text>
          <text class="menu-name">隐私设置</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="showTip">
        <view class="menu-left">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-name">关于我们</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view class="version">
      <text>当前版本 v1.0.0</text>
    </view>

    <button class="logout-btn" @click="logout">退出登录</button>
  </view>
</template>

<script setup>
function showTip() {
  uni.showToast({ title: '功能开发中', icon: 'none' })
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

.menu-card {
  background: #fff;
  margin: 20rpx;
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

.version {
  text-align: center;
  color: #999;
  font-size: 24rpx;
  margin: 40rpx 0;
}

.logout-btn {
  margin: 0 20rpx;
  background: #fff;
  color: #f5576c;
  border: none;
  border-radius: 16rpx;
  font-size: 30rpx;
}
</style>
