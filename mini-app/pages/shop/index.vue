<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input class="search-input" placeholder="搜索商品..." />
    </view>

    <!-- 商品列表 -->
    <view class="product-list">
      <view class="product-item" v-for="item in products" :key="item.id">
        <image class="product-img" :src="item.image || '/static/default.png'" mode="aspectFill" />
        <view class="product-info">
          <view class="product-name">{{ item.name }}</view>
          <view class="product-desc">{{ item.category }}</view>
          <view class="product-bottom">
            <text class="product-price">¥{{ item.price }}</text>
            <button class="add-btn" @click="addToCart(item)">加入购物车</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部购物车栏 -->
    <view class="cart-bar">
      <view class="cart-info">
        <text>购物车</text>
        <text class="cart-total">¥{{ cartTotal }}</text>
      </view>
      <button class="checkout-btn" @click="goCheckout">去结算 ({{ cartCount }})</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

const products = ref([])
const cart = ref([])

const cartTotal = ref(0)
const cartCount = ref(0)

async function loadProducts() {
  const res = await request({ url: '/products/public' })
  products.value = res || []
}

function addToCart(item) {
  cart.value.push(item)
  cartTotal.value += Number(item.price)
  cartCount.value += 1
  uni.showToast({ title: '已加入购物车' })
}

function goCheckout() {
  uni.showToast({ title: '下单成功，到店核销取货' })
  cart.value = []
  cartTotal.value = 0
  cartCount.value = 0
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.container {
  background: #f8f9fc;
  min-height: 100vh;
  padding-bottom: 100rpx;
}

.search-bar {
  padding: 20rpx;
  background: #fff;
}

.search-input {
  background: #f5f7fa;
  border-radius: 40rpx;
  padding: 16rpx 24rpx;
  font-size: 28rpx;
}

.product-list {
  padding: 20rpx;
}

.product-item {
  display: flex;
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.product-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  background: #f5f7fa;
}

.product-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 28rpx;
  font-weight: 500;
}

.product-desc {
  font-size: 24rpx;
  color: #999;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 32rpx;
  color: #f56c6c;
  font-weight: 600;
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 24rpx;
  padding: 10rpx 24rpx;
  border-radius: 30rpx;
  border: none;
}

.cart-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.cart-info {
  display: flex;
  flex-direction: column;
}

.cart-total {
  font-size: 32rpx;
  color: #f56c6c;
  font-weight: 600;
}

.checkout-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 16rpx 40rpx;
  border-radius: 40rpx;
  border: none;
  font-size: 28rpx;
}
</style>
