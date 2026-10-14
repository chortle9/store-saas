<template>
  <view class="container">
    <view class="header">
      <view class="header-title">我的预约</view>
    </view>

    <!-- 标签切换 -->
    <view class="tabs">
      <view class="tab" :class="{ active: activeTab === 0 }" @click="activeTab = 0">待确认</view>
      <view class="tab" :class="{ active: activeTab === 1 }" @click="activeTab = 1">待服务</view>
      <view class="tab" :class="{ active: activeTab === 2 }" @click="activeTab = 2">已完成</view>
      <view class="tab" :class="{ active: activeTab === 3 }" @click="activeTab = 3">已取消</view>
    </view>

    <!-- 预约列表 -->
    <view class="appointment-list">
      <view class="appointment-card" v-for="item in filteredList" :key="item.id">
        <view class="card-top">
          <view class="service-name">{{ item.serviceName }}</view>
          <view class="status-tag" :class="item.status">{{ statusText[item.status] }}</view>
        </view>
        <view class="card-info">
          <view class="info-row">
            <text class="label">预约时间：</text>
            <text>{{ item.appointmentTime }}</text>
          </view>
          <view class="info-row">
            <text class="label">技师：</text>
            <text>{{ item.staffName || '待安排' }}</text>
          </view>
          <view class="info-row">
            <text class="label">备注：</text>
            <text>{{ item.note || '无' }}</text>
          </view>
        </view>
        <view class="card-actions" v-if="item.status === 'pending'">
          <button class="btn-cancel" @click="cancelAppointment(item)">取消预约</button>
          <button class="btn-reschedule" @click="reschedule">改期</button>
        </view>
      </view>
      <view v-if="filteredList.length === 0" class="empty-tip">
        暂无预约记录
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref(0)

const statusText = {
  pending: '待确认',
  confirmed: '待服务',
  completed: '已完成',
  cancelled: '已取消',
}

const appointmentList = ref([
  { id: 1, serviceName: '深层清洁护理', appointmentTime: '2026-10-15 14:00', staffName: '李技师', note: '敏感肌', status: 'pending' },
  { id: 2, serviceName: '补水保湿SPA', appointmentTime: '2026-10-12 10:00', staffName: '王技师', note: '', status: 'confirmed' },
  { id: 3, serviceName: '肩颈放松理疗', appointmentTime: '2026-10-08 15:00', staffName: '张技师', note: '', status: 'completed' },
  { id: 4, serviceName: '面部护理', appointmentTime: '2026-10-05 11:00', staffName: '', note: '临时有事', status: 'cancelled' },
])

const filteredList = computed(() => {
  const statusMap = ['pending', 'confirmed', 'completed', 'cancelled']
  return appointmentList.value.filter(a => a.status === statusMap[activeTab.value])
})

function cancelAppointment(item) {
  uni.showModal({
    title: '提示',
    content: '确定要取消这个预约吗？',
    success: (res) => {
      if (res.confirm) {
        item.status = 'cancelled'
        uni.showToast({ title: '已取消', icon: 'success' })
      }
    },
  })
}

function reschedule() {
  uni.switchTab({ url: '/pages/appointment/index' })
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

.tabs {
  display: flex;
  background: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 8rpx;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 26rpx;
  color: #666;
  border-radius: 8rpx;
}

.tab.active {
  background: #667eea;
  color: #fff;
}

.appointment-list {
  padding: 0 20rpx;
}

.appointment-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.service-name {
  font-size: 30rpx;
  font-weight: 600;
}

.status-tag {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.status-tag.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.status-tag.confirmed {
  background: #e6f7ff;
  color: #1890ff;
}

.status-tag.completed {
  background: #f6ffed;
  color: #52c41a;
}

.status-tag.cancelled {
  background: #fff1f0;
  color: #f5222d;
}

.card-info {
  margin-bottom: 20rpx;
}

.info-row {
  display: flex;
  padding: 8rpx 0;
  font-size: 26rpx;
}

.label {
  width: 160rpx;
  color: #999;
}

.card-actions {
  display: flex;
  gap: 16rpx;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 12rpx 24rpx;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
}

.btn-reschedule {
  padding: 12rpx 24rpx;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 100rpx 0;
  font-size: 26rpx;
}
</style>
