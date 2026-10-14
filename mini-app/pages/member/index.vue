<template>
  <view class="container">
    <!-- 会员信息卡片 -->
    <view class="member-card">
      <view class="member-header">
        <view class="avatar">小</view>
        <view class="member-info">
          <view class="name">小美同学</view>
          <view class="level">黄金会员</view>
        </view>
      </view>
      <view class="member-stats">
        <view class="stat-item">
          <view class="num">280</view>
          <view class="label">积分</view>
        </view>
        <view class="stat-item">
          <view class="num">¥520</view>
          <view class="label">余额</view>
        </view>
        <view class="stat-item">
          <view class="num">6次</view>
          <view class="label">剩余次数</view>
        </view>
      </view>
    </view>

    <!-- 我的卡包 -->
    <view class="section">
      <view class="section-title">我的卡包</view>
      <view class="card-item">
        <view class="card-name">10次护理卡</view>
        <view class="card-remain">剩余 6 次</view>
        <view class="card-expire">有效期至 2026-12-31</view>
      </view>
      <view class="card-item">
        <view class="card-name">储值卡 ¥1000</view>
        <view class="card-remain">余额 ¥520</view>
        <view class="card-expire">永久有效</view>
      </view>
    </view>

    <!-- 我的优惠券 -->
    <view class="section">
      <view class="section-title">优惠券</view>
      <view class="coupon-item">
        <view class="coupon-value">¥30</view>
        <view class="coupon-info">
          <view class="coupon-name">满200减30</view>
          <view class="coupon-expire">有效期至 2026-10-31</view>
        </view>
        <view class="coupon-btn">去使用</view>
      </view>
      <view class="coupon-item">
        <view class="coupon-value">8.5折</view>
        <view class="coupon-info">
          <view class="coupon-name">美容项目通用</view>
          <view class="coupon-expire">有效期至 2026-11-15</view>
        </view>
        <view class="coupon-btn">去使用</view>
      </view>
    </view>

    <!-- 消费记录 -->
    <view class="section">
      <view class="section-title">消费记录</view>
      <view class="record-item">
        <view class="record-name">深层清洁护理</view>
        <view class="record-date">2026-10-10</view>
        <view class="record-amount">-¥198</view>
      </view>
      <view class="record-item">
        <view class="record-name">补水保湿SPA</view>
        <view class="record-date">2026-10-05</view>
        <view class="record-amount">-¥298</view>
      </view>
    </view>
  </view>
</template>

<script setup>
</script>

<style scoped>
.container {
  padding: 20rpx;
}

.member-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  padding: 40rpx 30rpx;
  color: #fff;
  margin-bottom: 20rpx;
}

.member-header {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  margin-right: 20rpx;
}

.name {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.level {
  font-size: 24rpx;
  opacity: 0.9;
}

.member-stats {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.num {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.label {
  font-size: 24rpx;
  opacity: 0.8;
}

.section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 20rpx;
}

.card-item {
  background: #f8f9ff;
  border-left: 8rpx solid #667eea;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
}

.card-name {
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.card-remain {
  font-size: 26rpx;
  color: #667eea;
  margin-bottom: 4rpx;
}

.card-expire {
  font-size: 22rpx;
  color: #999;
}

.coupon-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #fff5f5;
  border-radius: 8rpx;
  margin-bottom: 16rpx;
}

.coupon-value {
  font-size: 36rpx;
  font-weight: 600;
  color: #f5576c;
  margin-right: 20rpx;
  min-width: 100rpx;
}

.coupon-info {
  flex: 1;
}

.coupon-name {
  font-size: 26rpx;
  margin-bottom: 6rpx;
}

.coupon-expire {
  font-size: 22rpx;
  color: #999;
}

.coupon-btn {
  background: #f5576c;
  color: #fff;
  padding: 10rpx 24rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.record-name {
  font-size: 28rpx;
  flex: 1;
}

.record-date {
  font-size: 24rpx;
  color: #999;
  margin-right: 20rpx;
}

.record-amount {
  font-size: 28rpx;
  color: #f5576c;
  font-weight: 500;
}
</style>
