<template>
  <view class="container">
    <view class="header">
      <view class="header-title">门店地址</view>
    </view>

    <view class="map-placeholder">
      <text>地图位置展示</text>
    </view>

    <view class="address-card">
      <view class="address-item">
        <view class="address-icon">📍</view>
        <view class="address-info">
          <view class="address-title">门店地址</view>
          <view class="address-detail">广州市天河区珠江新城华夏路XX号XX广场XX层</view>
        </view>
      </view>
      <view class="address-item">
        <view class="address-icon">📞</view>
        <view class="address-info">
          <view class="address-title">联系电话</view>
          <view class="address-detail">020-12345678</view>
        </view>
      </view>
      <view class="address-item">
        <view class="address-icon">🕐</view>
        <view class="address-info">
          <view class="address-title">营业时间</view>
          <view class="address-detail">周一至周日 10:00 - 21:00</view>
        </view>
      </view>
    </view>

    <view class="action-buttons">
      <button class="btn-primary" @click="callPhone">拨打电话</button>
      <button class="btn-secondary" @click="openMap">导航前往</button>
    </view>
  </view>
</template>

<script setup>
function callPhone() {
  uni.makePhoneCall({ phoneNumber: '02012345678' })
}

function openMap() {
  uni.openLocation({
    latitude: 23.1291,
    longitude: 113.3212,
    name: '优雅美学',
    address: '广州市天河区珠江新城',
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

.map-placeholder {
  height: 400rpx;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 28rpx;
}

.address-card {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 20rpx;
}

.address-item {
  display: flex;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.address-item:last-child {
  border-bottom: none;
}

.address-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}

.address-title {
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.address-detail {
  font-size: 26rpx;
  color: #666;
}

.action-buttons {
  padding: 0 20rpx;
  display: flex;
  gap: 20rpx;
}

.btn-primary {
  flex: 1;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 40rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

.btn-secondary {
  flex: 1;
  background: #fff;
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 40rpx;
  padding: 20rpx;
  font-size: 28rpx;
}
</style>
