<template>
  <view class="container">
    <!-- 选择服务项目 -->
    <view class="section">
      <view class="section-title">选择服务项目</view>
      <view class="service-list">
        <view 
          v-for="item in services" 
          :key="item.id"
          class="service-card"
          :class="{ active: selectedService?.id === item.id }"
          @click="selectService(item)"
        >
          <view class="service-name">{{ item.name }}</view>
          <view class="service-meta">{{ item.duration }}分钟 · ¥{{ item.price }}</view>
        </view>
      </view>
    </view>

    <!-- 选择技师 -->
    <view class="section" v-if="selectedService">
      <view class="section-title">选择技师</view>
      <view class="staff-list">
        <view 
          v-for="item in staffs" 
          :key="item.id"
          class="staff-card"
          :class="{ active: selectedStaff?.id === item.id }"
          @click="selectStaff(item)"
        >
          <view class="staff-avatar">{{ item.name[0] }}</view>
          <view class="staff-name">{{ item.name }}</view>
        </view>
      </view>
    </view>

    <!-- 选择时间 -->
    <view class="section" v-if="selectedStaff">
      <view class="section-title">选择预约时间</view>
      <picker mode="date" :value="appointmentDate" @change="onDateChange">
        <view class="picker-input">{{ appointmentDate || '请选择日期' }}</view>
      </picker>
      <view class="time-slots">
        <view 
          v-for="slot in timeSlots" 
          :key="slot"
          class="time-slot"
          :class="{ active: selectedTime === slot }"
          @click="selectedTime = slot"
        >
          {{ slot }}
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-bar" v-if="selectedService && selectedStaff && selectedTime">
      <button class="submit-btn" @click="handleSubmit">确认预约</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const services = ref([
  { id: 1, name: '深层清洁护理', duration: 60, price: 198 },
  { id: 2, name: '补水保湿SPA', duration: 90, price: 298 },
  { id: 3, name: '肩颈放松理疗', duration: 45, price: 168 },
])

const staffs = ref([
  { id: 1, name: '小美' },
  { id: 2, name: '小丽' },
  { id: 3, name: '小芳' },
])

const timeSlots = ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '19:00', '20:00']

const selectedService = ref(null)
const selectedStaff = ref(null)
const appointmentDate = ref('')
const selectedTime = ref('')

function selectService(item) {
  selectedService.value = item
}

function selectStaff(item) {
  selectedStaff.value = item
}

function onDateChange(e) {
  appointmentDate.value = e.detail.value
}

function handleSubmit() {
  uni.showToast({ title: '预约成功！', icon: 'success' })
  setTimeout(() => {
    uni.switchTab({ url: '/pages/index/index' })
  }, 1500)
}
</script>

<style scoped>
.container {
  padding: 20rpx;
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

.service-card {
  padding: 24rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
}

.service-card.active {
  border-color: #667eea;
  background: #f0f3ff;
}

.service-name {
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.service-meta {
  font-size: 24rpx;
  color: #999;
}

.staff-list {
  display: flex;
  gap: 20rpx;
}

.staff-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  min-width: 140rpx;
}

.staff-card.active {
  border-color: #667eea;
  background: #f0f3ff;
}

.staff-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #667eea;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  margin-bottom: 12rpx;
}

.staff-name {
  font-size: 26rpx;
}

.picker-input {
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
  font-size: 28rpx;
}

.time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.time-slot {
  padding: 16rpx 24rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.time-slot.active {
  background: #667eea;
  color: #fff;
}

.submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.submit-btn {
  background: #667eea;
  color: #fff;
  border-radius: 40rpx;
  font-size: 32rpx;
}
</style>
