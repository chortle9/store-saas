<template>
  <view class="container">
    <view class="header">
      <view class="header-title">联系客服</view>
    </view>

    <view class="service-card">
      <view class="service-icon">💬</view>
      <view class="service-title">在线客服</view>
      <view class="service-desc">工作时间 9:00 - 21:00</view>
      <button class="service-btn" @click="contactOnline">在线咨询</button>
    </view>

    <view class="service-card">
      <view class="service-icon">📞</view>
      <view class="service-title">电话客服</view>
      <view class="service-desc">020-12345678</view>
      <button class="service-btn" @click="callPhone">拨打电话</button>
    </view>

    <view class="service-card">
      <view class="service-icon">💬</view>
      <view class="service-title">微信客服</view>
      <view class="service-desc">添加微信咨询</view>
      <button class="service-btn" @click="copyWechat">复制微信号</button>
    </view>
  </view>
</template>

<script setup>
function contactOnline() {
  uni.showToast({ title: '正在接入客服...', icon: 'none' })
}

function callPhone() {
  uni.makePhoneCall({ phoneNumber: '02012345678' })
}

function copyWechat() {
  uni.setClipboardData({
    data: 'elegant_beauty',
    success: () => {
      uni.showToast({ title: '微信号已复制', icon: 'success' })
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

.service-card {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 40rpx;
  text-align: center;
}

.service-icon {
  font-size: 64rpx;
  margin-bottom: 16rpx;
}

.service-title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.service-desc {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 24rpx;
}

.service-btn {
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 40rpx;
  padding: 16rpx 48rpx;
  font-size: 26rpx;
  display: inline-block;
}
</style>
