<template>
  <view class="container">
    <view class="header">
      <view class="header-title">在线预约</view>
    </view>

    <!-- 选择服务 -->
    <view class="section">
      <view class="section-title">选择服务项目</view>
      <view class="service-list">
        <view
          v-for="service in services"
          :key="service.id"
          class="service-item"
          :class="{ selected: selectedService?.id === service.id }"
          @click="selectService(service)"
        >
          <view class="service-info">
            <view class="service-name">{{ service.name }}</view>
            <view class="service-meta">
              <text class="price">¥{{ service.price }}</text>
              <text class="duration">{{ service.duration || 60 }}分钟</text>
            </view>
          </view>
          <view class="check-icon" v-if="selectedService?.id === service.id">✓</view>
        </view>
      </view>
    </view>

    <!-- 选择日期 -->
    <view class="section">
      <view class="section-title">选择日期</view>
      <scroll-view scroll-x class="date-scroll">
        <view
          v-for="date in dateList"
          :key="date.value"
          class="date-item"
          :class="{ selected: selectedDate === date.value }"
          @click="selectedDate = date.value"
        >
          <view class="date-week">{{ date.week }}</view>
          <view class="date-day">{{ date.day }}</view>
        </view>
      </scroll-view>
    </view>

    <!-- 选择时间 -->
    <view class="section">
      <view class="section-title">选择时间</view>
      <view class="time-grid">
        <view
          v-for="time in timeList"
          :key="time"
          class="time-item"
          :class="{ selected: selectedTime === time }"
          @click="selectedTime = time"
        >
          {{ time }}
        </view>
      </view>
    </view>

    <!-- 选择技师 -->
    <view class="section">
      <view class="section-title">选择技师（可选）</view>
      <view class="staff-list">
        <view
          v-for="staff in staffList"
          :key="staff.id"
          class="staff-item"
          :class="{ selected: selectedStaff?.id === staff.id }"
          @click="selectedStaff = staff"
        >
          <view class="staff-avatar">{{ staff.name?.charAt(0) }}</view>
          <view class="staff-name">{{ staff.name }}</view>
        </view>
      </view>
    </view>

    <!-- 填写信息 -->
    <view class="section">
      <view class="section-title">联系信息</view>
      <view class="form-item">
        <input v-model="form.name" placeholder="您的称呼" class="form-input" />
      </view>
      <view class="form-item">
        <input v-model="form.phone" type="number" placeholder="手机号码" class="form-input" />
      </view>
      <view class="form-item">
        <textarea v-model="form.note" placeholder="备注需求（可选）" class="form-textarea" />
      </view>
    </view>

    <!-- 底部提交栏 -->
    <view class="bottom-bar">
      <view class="bottom-info">
        <view class="price" v-if="selectedService">¥{{ selectedService.price }}</view>
      </view>
      <button class="submit-btn" @click="submitBooking">提交预约</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request, TENANT_ID } from '@/utils/request.js'

const services = ref([])
const selectedService = ref(null)
const selectedDate = ref('')
const selectedTime = ref('')
const selectedStaff = ref(null)
const staffList = ref([])
const form = ref({ name: '', phone: '', note: '' })

// 生成日期列表（今天往后7天）
const dateList = ref(generateDates())

function generateDates() {
  const list = []
  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    list.push({
      value: d.toISOString().split('T')[0],
      week: i === 0 ? '今天' : weeks[d.getDay()],
      day: `${d.getMonth() + 1}/${d.getDate()}`,
    })
  }
  return list
}

const timeList = [
  '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00',
]

onMounted(async () => {
  selectedDate.value = dateList.value[0].value
  try {
    const res = await request({ url: `/website/public/${TENANT_ID}/services` })
    services.value = res || []
  } catch (e) {
    console.log('加载服务失败', e)
  }
})

function selectService(service) {
  selectedService.value = service
}

async function submitBooking() {
  if (!selectedService.value) {
    uni.showToast({ title: '请选择服务项目', icon: 'none' })
    return
  }
  if (!form.value.name || !form.value.phone) {
    uni.showToast({ title: '请填写称呼和电话', icon: 'none' })
    return
  }

  try {
    await request({
      url: `/website/public/${TENANT_ID}/appointments`,
      method: 'POST',
      data: {
        memberName: form.value.name,
        memberPhone: form.value.phone,
        serviceId: selectedService.value.id,
        serviceName: selectedService.value.name,
        staffId: selectedStaff.value?.id || null,
        appointmentTime: `${selectedDate.value} ${selectedTime.value || '10:00'}`,
        note: form.value.note,
      },
    })
    uni.showToast({ title: '预约成功！', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    console.error('预约失败', e)
  }
}
</script>

<style scoped>
.container {
  padding-bottom: 140rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 60rpx 40rpx 40rpx;
  color: #fff;
}

.header-title {
  font-size: 40rpx;
  font-weight: 600;
}

.section {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
  color: #333;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border: 2rpx solid #f0f0f0;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
}

.service-item.selected {
  border-color: #667eea;
  background: #f5f7ff;
}

.service-name {
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.service-meta {
  display: flex;
  gap: 20rpx;
}

.price {
  font-size: 30rpx;
  color: #f5576c;
  font-weight: 600;
}

.duration {
  font-size: 24rpx;
  color: #999;
}

.check-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #667eea;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.date-scroll {
  white-space: nowrap;
}

.date-item {
  display: inline-block;
  width: 120rpx;
  padding: 20rpx 0;
  text-align: center;
  border: 2rpx solid #f0f0f0;
  border-radius: 12rpx;
  margin-right: 16rpx;
}

.date-item.selected {
  border-color: #667eea;
  background: #f5f7ff;
}

.date-week {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.date-day {
  font-size: 28rpx;
  font-weight: 500;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.time-item {
  padding: 20rpx 0;
  text-align: center;
  border: 2rpx solid #f0f0f0;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.time-item.selected {
  border-color: #667eea;
  background: #667eea;
  color: #fff;
}

.staff-list {
  display: flex;
  gap: 20rpx;
}

.staff-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  border: 2rpx solid #f0f0f0;
  border-radius: 12rpx;
  min-width: 120rpx;
}

.staff-item.selected {
  border-color: #667eea;
}

.staff-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  margin-bottom: 12rpx;
}

.staff-name {
  font-size: 24rpx;
}

.form-item {
  margin-bottom: 20rpx;
}

.form-input {
  width: 100%;
  padding: 24rpx;
  background: #f5f7fa;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.form-textarea {
  width: 100%;
  height: 160rpx;
  padding: 24rpx;
  background: #f5f7fa;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.bottom-info .price {
  font-size: 36rpx;
  color: #f5576c;
  font-weight: 600;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border: none;
  border-radius: 40rpx;
  padding: 20rpx 60rpx;
  font-size: 30rpx;
  font-weight: 500;
}
</style>
