<template>
  <view class="container">
    <!-- 用户信息 -->
    <view class="user-card">
      <view class="avatar">小</view>
      <view class="user-info">
        <view class="name">小美同学</view>
        <view class="phone">138****8888</view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-list">
      <view class="menu-item" v-for="item in menuList" :key="item.title" @click="handleMenuClick(item)">
        <view class="menu-icon">{{ item.icon }}</view>
        <view class="menu-title">{{ item.title }}</view>
        <view class="menu-arrow">></view>
      </view>
    </view>

    <!-- 设置 -->
    <view class="menu-list">
      <view class="menu-item" @click="handleLogout">
        <view class="menu-icon">🚪</view>
        <view class="menu-title">退出登录</view>
        <view class="menu-arrow">></view>
      </view>
    </view>
  </view>
</template>

<script setup>
const menuList = [
  { icon: '📅', title: '我的预约' },
  { icon: '📋', title: '消费记录' },
  { icon: '🎫', title: '我的优惠券' },
  { icon: '💳', title: '我的卡包' },
  { icon: '⭐', title: '我的收藏' },
  { icon: '📍', title: '门店地址' },
  { icon: '📞', title: '联系客服' },
  { icon: '⚙️', title: '设置' },
]

function handleMenuClick(item) {
  uni.showToast({ title: item.title, icon: 'none' })
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已退出', icon: 'success' })
      }
    }
  })
}
</script>

<style scoped>
.container {
  padding: 20rpx;
}

.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  padding: 40rpx 30rpx;
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
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
  color: #fff;
}

.name {
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8rpx;
}

.phone {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.menu-list {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}

.menu-title {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.menu-arrow {
  color: #ccc;
  font-size: 28rpx;
}
</style>
