<template>
  <view class="container">
    <!-- 顶部欢迎 -->
    <view class="welcome-header">
      <view class="welcome-text">早上好，王技师</view>
      <view class="date-text">今天是个好日子</view>
    </view>

    <!-- 今日数据 -->
    <view class="stats-grid">
      <view class="stat-card">
        <view class="stat-value">3</view>
        <view class="stat-label">今日预约</view>
      </view>
      <view class="stat-card">
        <view class="stat-value">5</view>
        <view class="stat-label">今日单数</view>
      </view>
      <view class="stat-card">
        <view class="stat-value">¥680</view>
        <view class="stat-label">本月提成</view>
      </view>
    </view>

    <!-- 今日预约 -->
    <view class="section">
      <view class="section-title">今日我的预约</view>
      <view class="appointment-list">
        <view class="appointment-item">
          <view class="time">10:00</view>
          <view class="info">
            <view class="name">张女士</view>
            <view class="service">深层清洁护理</view>
          </view>
          <view class="status-tag">待到店</view>
        </view>
        <view class="appointment-item">
          <view class="time">14:00</view>
          <view class="info">
            <view class="name">李女士</view>
            <view class="service">补水保湿SPA</view>
          </view>
          <view class="status-tag">待到店</view>
        </view>
      </view>
    </view>

    <!-- 今日发圈 -->
    <view class="section">
      <view class="section-title">今日朋友圈素材</view>
      <view class="moment-card">
        <view class="moment-content">
          今天店里新到了一批进口精华液，做护理的客人都说效果特别好～
          想要的小姐姐可以提前预约哦🌹
        </view>
        <view class="moment-actions">
          <button class="btn-primary" @click="copyContent">复制文案</button>
          <button class="btn-default" @click="saveImage">保存图片</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
function copyContent() {
  uni.setClipboardData({
    data: '今天店里新到了一批进口精华液，做护理的客人都说效果特别好～想要的小姐姐可以提前预约哦🌹',
    success: () => {
      uni.showToast({ title: '复制成功' })
    }
  })
}

function saveImage() {
  uni.showToast({ title: '图片已保存' })
}
</script>

<style scoped>
.container {
  background: #f8f9fc;
  min-height: 100vh;
}

.welcome-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 30rpx;
  color: #fff;
}

.welcome-text {
  font-size: 36rpx;
  font-weight: 600;
}

.date-text {
  font-size: 26rpx;
  opacity: 0.8;
  margin-top: 8rpx;
}

.stats-grid {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  margin-top: -30rpx;
}

.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.stat-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #1a1a2e;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.section {
  margin: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
}

.appointment-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.appointment-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  background: #f8f9fc;
  border-radius: 12rpx;
}

.time {
  font-size: 28rpx;
  font-weight: 600;
  color: #667eea;
  width: 80rpx;
}

.info {
  flex: 1;
}

.name {
  font-size: 28rpx;
  font-weight: 500;
}

.service {
  font-size: 24rpx;
  color: #999;
  margin-top: 4rpx;
}

.status-tag {
  padding: 6rpx 16rpx;
  background: #fff7e6;
  color: #fa8c16;
  font-size: 22rpx;
  border-radius: 20rpx;
}

.moment-card {
  background: #f8f9fc;
  border-radius: 12rpx;
  padding: 24rpx;
}

.moment-content {
  font-size: 28rpx;
  line-height: 1.6;
  color: #333;
  margin-bottom: 20rpx;
}

.moment-actions {
  display: flex;
  gap: 16rpx;
}

.btn-primary {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 8rpx;
  padding: 16rpx;
  font-size: 26rpx;
}

.btn-default {
  flex: 1;
  background: #fff;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 16rpx;
  font-size: 26rpx;
}
</style>
