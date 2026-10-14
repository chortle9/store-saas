<template>
  <view class="container">
    <!-- 轮播Banner -->
    <swiper class="banner-swiper" indicator-dots autoplay circular indicator-active-color="#fff">
      <swiper-item v-for="(banner, index) in banners" :key="index">
        <image class="banner-img" :src="banner.image" mode="aspectFill" v-if="banner.image" />
        <view v-else class="banner-placeholder">
          <view class="banner-title">{{ banner.title || shopInfo.title }}</view>
          <view class="banner-sub">{{ banner.subtitle || shopInfo.subtitle }}</view>
        </view>
      </swiper-item>
    </swiper>

    <!-- 快捷入口 -->
    <view class="quick-entry">
      <view class="entry-item" @click="goTab('/pages/appointment/index')">
        <view class="entry-icon" style="background: #667eea">📅</view>
        <text>在线预约</text>
      </view>
      <view class="entry-item" @click="goPage('/pages/coupons/index')">
        <view class="entry-icon" style="background: #f5576c">🎫</view>
        <text>优惠券</text>
      </view>
      <view class="entry-item" @click="goTab('/pages/member/index')">
        <view class="entry-icon" style="background: #4facfe">👤</view>
        <text>会员卡</text>
      </view>
      <view class="entry-item" @click="goTab('/pages/my/index')">
        <view class="entry-icon" style="background: #43e97b">⭐</view>
        <text>个人中心</text>
      </view>
    </view>

    <!-- 门店介绍 -->
    <view class="section">
      <view class="section-title">
        <text>关于我们</text>
      </view>
      <view class="about-text">{{ shopInfo.aboutUs || '专业美业护理，让美丽更简单' }}</view>
    </view>

    <!-- 热门项目 -->
    <view class="section">
      <view class="section-title">
        <text>热门服务项目</text>
        <text class="more" @click="showTip('更多服务敬请期待')">更多 ></text>
      </view>
      <view class="service-list">
        <view class="service-item" v-for="item in services" :key="item.id" @click="goTab('/pages/appointment/index')">
          <view class="service-img-placeholder">💆</view>
          <view class="service-info">
            <view class="service-name">{{ item.name }}</view>
            <view class="service-desc">{{ item.description || '专业技师服务' }}</view>
            <view class="service-bottom">
              <text class="service-price">¥{{ item.price }}</text>
              <text class="service-duration">{{ item.duration || 60 }}分钟</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 门店环境 -->
    <view class="section" v-if="envImages.length > 0">
      <view class="section-title">
        <text>门店环境</text>
      </view>
      <scroll-view scroll-x class="env-scroll">
        <image v-for="(img, index) in envImages" :key="index" class="env-img" :src="img" mode="aspectFill" />
      </scroll-view>
    </view>

    <!-- 联系我们 -->
    <view class="section">
      <view class="section-title">
        <text>联系我们</text>
      </view>
      <view class="contact-row">
        <text class="contact-label">地址：</text>
        <text>{{ shopInfo.address || '敬请期待' }}</text>
      </view>
      <view class="contact-row">
        <text class="contact-label">电话：</text>
        <text @click="callPhone">{{ shopInfo.phone || '敬请期待' }}</text>
      </view>
      <view class="contact-row">
        <text class="contact-label">营业时间：</text>
        <text>{{ shopInfo.businessHours || '10:00-21:00' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request, TENANT_ID } from '@/utils/request.js'

const banners = ref([])
const services = ref([])
const envImages = ref([])
const shopInfo = ref({})

onMounted(async () => {
  await loadData()
})

async function loadData() {
  // 加载店铺信息
  try {
    const webRes = await request({ url: `/website/public/${TENANT_ID}` })
    shopInfo.value = webRes || {}
    if (typeof webRes.banners === 'string') {
      banners.value = JSON.parse(webRes.banners)
    } else {
      banners.value = webRes.banners || []
    }
    if (banners.value.length === 0) {
      banners.value = [{ title: webRes.title || '欢迎光临', subtitle: webRes.subtitle || '' }]
    }
    if (typeof webRes.environmentImages === 'string') {
      envImages.value = JSON.parse(webRes.environmentImages)
    } else {
      envImages.value = webRes.environmentImages || []
    }
  } catch (e) {
    banners.value = [{ title: '欢迎光临', subtitle: '专业美业护理' }]
  }

  // 加载服务列表
  try {
    const serviceRes = await request({ url: `/website/public/${TENANT_ID}/services` })
    services.value = serviceRes || []
  } catch (e) {
    console.log('加载服务失败', e)
  }
}

function goTab(url) {
  uni.switchTab({ url })
}

function goPage(url) {
  uni.navigateTo({ url })
}

function showTip(msg) {
  uni.showToast({ title: msg, icon: 'none' })
}

function callPhone() {
  if (shopInfo.value.phone) {
    uni.makePhoneCall({ phoneNumber: shopInfo.value.phone })
  }
}
</script>

<style scoped>
.container {
  padding-bottom: 30rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.banner-swiper {
  height: 400rpx;
  width: 100%;
}

.banner-img {
  width: 100%;
  height: 100%;
}

.banner-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.banner-title {
  font-size: 44rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.banner-sub {
  font-size: 26rpx;
  opacity: 0.9;
}

.quick-entry {
  display: flex;
  justify-content: space-around;
  background: #fff;
  margin: -40rpx 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 30rpx 0;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 10;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24rpx;
  color: #333;
}

.entry-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-bottom: 12rpx;
}

.section {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
  color: #333;
}

.more {
  font-size: 24rpx;
  color: #999;
  font-weight: normal;
  float: right;
}

.about-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.8;
}

.service-list {
  display: flex;
  flex-direction: column;
}

.service-item {
  display: flex;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.service-img-placeholder {
  width: 140rpx;
  height: 140rpx;
  border-radius: 12rpx;
  background: linear-gradient(135deg, #f5f7fa, #e4e7ed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60rpx;
  margin-right: 20rpx;
}

.service-info {
  flex: 1;
}

.service-name {
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.service-desc {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 12rpx;
}

.service-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-price {
  font-size: 32rpx;
  color: #f5576c;
  font-weight: 600;
}

.service-duration {
  font-size: 24rpx;
  color: #999;
}

.env-scroll {
  white-space: nowrap;
}

.env-img {
  width: 200rpx;
  height: 150rpx;
  border-radius: 12rpx;
  margin-right: 16rpx;
  display: inline-block;
}

.contact-row {
  display: flex;
  padding: 12rpx 0;
  font-size: 26rpx;
  color: #666;
}

.contact-label {
  width: 140rpx;
  color: #999;
}
</style>
