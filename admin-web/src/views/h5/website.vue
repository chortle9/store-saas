<template>
  <div class="official-site" :style="{ '--primary': website.primaryColor || '#1a1a2e', '--accent': website.accentColor || '#c9a96e' }">
    <!-- 顶部导航 -->
    <header class="site-header" id="header">
      <div class="container header-inner">
        <div class="brand">
          <span class="brand-name">{{ website.title || '优雅美学' }}</span>
        </div>
        <nav class="main-nav">
          <a href="#home" class="nav-link active">首页</a>
          <a href="#about" class="nav-link">关于我们</a>
          <a href="#services" class="nav-link">服务项目</a>
          <a href="#environment" class="nav-link">门店环境</a>
          <a href="#contact" class="nav-link">联系我们</a>
        </nav>
        <button class="header-cta" @click="scrollToBooking">预约到店</button>
      </div>
    </header>

    <!-- 首屏Banner -->
    <section id="home" class="hero">
      <div class="hero-slides">
        <div
          v-for="(banner, index) in banners"
          :key="index"
          class="hero-slide"
          :class="{ active: currentSlide === index }"
          :style="banner.image ? { backgroundImage: `url(${banner.image})` } : {}"
        >
          <div class="hero-overlay"></div>
          <div class="hero-content container">
            <h1 class="hero-title">{{ banner.title || website.title }}</h1>
            <p class="hero-subtitle">{{ banner.subtitle || website.subtitle }}</p>
          </div>
        </div>
      </div>
      <!-- 轮播指示器 -->
      <div class="hero-dots">
        <span
          v-for="(banner, index) in banners"
          :key="index"
          class="dot"
          :class="{ active: currentSlide === index }"
          @click="currentSlide = index"
        ></span>
      </div>
    </section>

    <!-- 服务项目 -->
    <section id="services" class="section services-section">
      <div class="container">
        <div class="section-head">
          <span class="section-sub">OUR SERVICES</span>
          <h2 class="section-title">精选服务</h2>
          <div class="section-line"></div>
        </div>
        <div class="services-grid">
          <div class="service-item" v-for="(service, index) in services" :key="service.id">
            <div class="service-num">0{{ index + 1 }}</div>
            <h3 class="service-name">{{ service.name }}</h3>
            <p class="service-desc">{{ service.description || '专业技师一对一服务，打造专属美丽方案' }}</p>
            <div class="service-bottom">
              <span class="service-price">¥{{ service.price }}</span>
              <span class="service-link" @click="scrollToBooking">立即预约 →</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于我们 -->
    <section id="about" class="section about-section">
      <div class="container">
        <div class="about-grid">
          <div class="about-text-col">
            <span class="section-sub">ABOUT US</span>
            <h2 class="section-title">{{ website.aboutTitle || '关于我们' }}</h2>
            <div class="section-line left"></div>
            <p class="about-desc">{{ website.aboutUs || '我们致力于为每一位顾客提供专业、细致、尊贵的美肤体验。多年行业深耕，用匠心与专业，守护每一份对美的追求。' }}</p>
            <div class="about-stats">
              <div class="stat">
                <div class="stat-num">12<span>年</span></div>
                <div class="stat-label">行业经验</div>
              </div>
              <div class="stat">
                <div class="stat-num">8000<span>+</span></div>
                <div class="stat-label">服务客户</div>
              </div>
              <div class="stat">
                <div class="stat-num">99<span>%</span></div>
                <div class="stat-label">好评率</div>
              </div>
            </div>
          </div>
          <div class="about-image-col">
            <div class="about-img-main"></div>
            <div class="about-img-small"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 门店环境 -->
    <section id="environment" class="section env-section">
      <div class="container">
        <div class="section-head">
          <span class="section-sub">ENVIRONMENT</span>
          <h2 class="section-title">门店环境</h2>
          <div class="section-line"></div>
        </div>
        <div class="env-grid">
          <div
            v-for="(img, index) in environmentImages"
            :key="index"
            class="env-item"
            :style="{ backgroundImage: `url(${img})` }"
          ></div>
          <!-- 占位图 -->
          <div v-if="environmentImages.length === 0" class="env-item placeholder">
            <span>等待上传环境图片</span>
          </div>
          <div v-if="environmentImages.length === 0" class="env-item placeholder">
            <span>私密护理空间</span>
          </div>
          <div v-if="environmentImages.length === 0" class="env-item placeholder">
            <span>休闲等候区</span>
          </div>
          <div v-if="environmentImages.length === 0" class="env-item placeholder">
            <span>产品展示区</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 客户评价 -->
    <section v-if="testimonials.length > 0" class="section testimonial-section">
      <div class="container">
        <div class="section-head">
          <span class="section-sub">TESTIMONIALS</span>
          <h2 class="section-title">客户评价</h2>
          <div class="section-line"></div>
        </div>
        <div class="testimonial-grid">
          <div v-for="(item, index) in testimonials" :key="index" class="testimonial-card">
            <div class="quote-mark">"</div>
            <p class="testimonial-content">{{ item.content }}</p>
            <div class="testimonial-author">—— {{ item.name }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系我们 + 预约 -->
    <section id="contact" class="section contact-section">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-info">
            <span class="section-sub">CONTACT</span>
            <h2 class="section-title">联系我们</h2>
            <div class="section-line left"></div>
            <div class="contact-list">
              <div class="contact-row">
                <span class="contact-label">地址</span>
                <span class="contact-value">{{ website.address || '请在后台设置门店地址' }}</span>
              </div>
              <div class="contact-row">
                <span class="contact-label">电话</span>
                <span class="contact-value">{{ website.phone || '请在后台设置联系电话' }}</span>
              </div>
              <div class="contact-row">
                <span class="contact-label">营业时间</span>
                <span class="contact-value">{{ website.businessHours || '周一至周日 10:00 - 21:00' }}</span>
              </div>
            </div>
          </div>
          <div class="booking-form" id="booking">
            <h3 class="form-title">在线预约</h3>
            <p class="form-desc">留下您的信息，我们将尽快与您联系确认</p>
            <div class="form-group">
              <input v-model="bookingForm.name" type="text" placeholder="您的称呼" />
            </div>
            <div class="form-group">
              <input v-model="bookingForm.phone" type="tel" placeholder="联系电话" />
            </div>
            <div class="form-group">
              <textarea v-model="bookingForm.note" rows="3" placeholder="想体验的项目 / 其他需求（选填）"></textarea>
            </div>
            <button class="submit-btn" @click="submitBooking">提交预约</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-left">
          <div class="footer-brand">{{ website.title || '优雅美学' }}</div>
          <p class="footer-desc">{{ website.subtitle || '专业美业 · 匠心服务' }}</p>
        </div>
        <div class="footer-right">
          <p>{{ website.copyright || `© 2026 ${website.title || '优雅美学'} 版权所有` }}</p>
          <p class="footer-powered">Powered by 店小伴SaaS</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const route = useRoute()
const tenantId = route.params.tenantId as string

const website = ref<any>({})
const services = ref<any[]>([])
const banners = ref<any[]>([])
const environmentImages = ref<string[]>([])
const testimonials = ref<any[]>([])

const currentSlide = ref(0)
let slideTimer: any = null

const bookingForm = ref({
  name: '',
  phone: '',
  note: '',
})

async function loadData() {
  // 获取网站配置
  const webRes: any = await request.get(`/website/public/${tenantId}`)
  website.value = webRes || {}

  // 解析轮播图
  if (typeof webRes?.banners === 'string') {
    try { banners.value = JSON.parse(webRes.banners) } catch { banners.value = [] }
  } else if (webRes?.banners) {
    banners.value = webRes.banners
  }
  if (!banners.value || banners.value.length === 0) {
    banners.value = [{ image: '', title: webRes?.title || '遇见更美的自己', subtitle: webRes?.subtitle || '' }]
  }

  // 解析环境图
  if (typeof webRes?.environmentImages === 'string') {
    try { environmentImages.value = JSON.parse(webRes.environmentImages) } catch { environmentImages.value = [] }
  } else if (webRes?.environmentImages) {
    environmentImages.value = webRes.environmentImages
  }

  // 解析评价
  if (typeof webRes?.testimonials === 'string') {
    try { testimonials.value = JSON.parse(webRes.testimonials) } catch { testimonials.value = [] }
  } else if (webRes?.testimonials) {
    testimonials.value = webRes.testimonials
  }

  // 获取服务项目
  const serviceRes: any = await request.get(`/website/public/${tenantId}/services`)
  services.value = serviceRes || []
}

function scrollToBooking() {
  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
}

function submitBooking() {
  if (!bookingForm.value.name || !bookingForm.value.phone) {
    ElMessage.warning('请填写称呼和联系电话')
    return
  }
  ElMessage.success('预约提交成功！我们将尽快与您联系')
  bookingForm.value = { name: '', phone: '', note: '' }
}

// 轮播自动切换
function startSlideTimer() {
  slideTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % banners.value.length
  }, 5000)
}

onMounted(() => {
  loadData()
  setTimeout(startSlideTimer, 1000)
})

onUnmounted(() => {
  if (slideTimer) clearInterval(slideTimer)
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.official-site {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  color: #333;
  background: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

/* 头部导航 */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255,255,255,0.98);
  box-shadow: 0 1px 0 rgba(0,0,0,0.05);
}

.header-inner {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-name {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--primary);
}

.main-nav {
  display: flex;
  gap: 48px;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-size: 15px;
  letter-spacing: 1px;
  transition: color 0.2s;
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  color: var(--primary);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--accent);
}

.header-cta {
  padding: 10px 28px;
  background: var(--primary);
  color: white;
  border: none;
  font-size: 14px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.header-cta:hover {
  opacity: 0.9;
}

/* Hero Banner */
.hero {
  margin-top: 80px;
  height: 85vh;
  position: relative;
  overflow: hidden;
}

.hero-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.8s ease;
  background-size: cover;
  background-position: center;
  background-color: var(--primary);
}

.hero-slide.active {
  opacity: 1;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.1));
}

.hero-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

.hero-title {
  font-size: 56px;
  font-weight: 300;
  letter-spacing: 4px;
  margin-bottom: 24px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 20px;
  font-weight: 300;
  letter-spacing: 2px;
  opacity: 0.9;
}

.hero-dots {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.dot {
  width: 30px;
  height: 3px;
  background: rgba(255,255,255,0.4);
  cursor: pointer;
  transition: background 0.2s;
}

.dot.active {
  background: white;
}

/* 通用Section */
.section {
  padding: 100px 0;
}

.section-head {
  text-align: center;
  margin-bottom: 60px;
}

.section-sub {
  display: block;
  font-size: 12px;
  letter-spacing: 3px;
  color: var(--accent);
  margin-bottom: 16px;
}

.section-title {
  font-size: 36px;
  font-weight: 400;
  letter-spacing: 3px;
  color: var(--primary);
  margin-bottom: 20px;
}

.section-line {
  width: 40px;
  height: 2px;
  background: var(--accent);
  margin: 0 auto;
}

.section-line.left {
  margin: 0;
}

/* 服务项目 */
.services-section {
  background: #fafafa;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.service-item {
  background: white;
  padding: 40px 32px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.service-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.06);
}

.service-num {
  font-size: 14px;
  color: var(--accent);
  letter-spacing: 2px;
  margin-bottom: 16px;
}

.service-name {
  font-size: 20px;
  font-weight: 500;
  color: var(--primary);
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.service-desc {
  font-size: 14px;
  color: #888;
  line-height: 1.8;
  margin-bottom: 24px;
}

.service-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.service-price {
  font-size: 20px;
  color: #c0392b;
  font-weight: 500;
}

.service-link {
  font-size: 14px;
  color: var(--accent);
  cursor: pointer;
  transition: letter-spacing 0.2s;
}

.service-link:hover {
  letter-spacing: 1px;
}

/* 关于我们 */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.about-desc {
  font-size: 15px;
  line-height: 2;
  color: #666;
  margin-bottom: 40px;
}

.about-stats {
  display: flex;
  gap: 60px;
}

.stat-num {
  font-size: 36px;
  font-weight: 300;
  color: var(--primary);
}

.stat-num span {
  font-size: 16px;
  margin-left: 4px;
}

.stat-label {
  font-size: 13px;
  color: #999;
  margin-top: 8px;
  letter-spacing: 1px;
}

.about-image-col {
  position: relative;
  height: 500px;
}

.about-img-main {
  position: absolute;
  top: 0;
  left: 0;
  width: 75%;
  height: 80%;
  background: linear-gradient(135deg, #e8e4de, #d4cfc7);
}

.about-img-small {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 50%;
  height: 50%;
  background: linear-gradient(135deg, #f0ebe4, #e0d8cd);
  border: 8px solid white;
}

/* 门店环境 */
.env-section {
  background: #fafafa;
}

.env-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.env-item {
  aspect-ratio: 4/3;
  background-size: cover;
  background-position: center;
}

.env-item.placeholder {
  background: #e8e4de;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

/* 客户评价 */
.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.testimonial-card {
  padding: 40px 32px;
  background: #fafafa;
}

.quote-mark {
  font-size: 48px;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 20px;
  font-family: Georgia, serif;
}

.testimonial-content {
  font-size: 15px;
  line-height: 1.9;
  color: #666;
  margin-bottom: 24px;
}

.testimonial-author {
  font-size: 14px;
  color: var(--primary);
  font-weight: 500;
}

/* 联系我们 */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
}

.contact-list {
  margin-top: 40px;
}

.contact-row {
  display: flex;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.contact-label {
  width: 80px;
  color: #999;
  font-size: 14px;
}

.contact-value {
  color: #333;
  font-size: 15px;
}

.booking-form {
  background: #fafafa;
  padding: 48px;
}

.form-title {
  font-size: 24px;
  font-weight: 400;
  color: var(--primary);
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.form-desc {
  font-size: 14px;
  color: #999;
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e5e5e5;
  background: white;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--primary);
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: var(--primary);
  color: white;
  border: none;
  font-size: 15px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:hover {
  opacity: 0.9;
}

/* 页脚 */
.site-footer {
  background: var(--primary);
  color: rgba(255,255,255,0.7);
  padding: 40px 0;
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-brand {
  font-size: 18px;
  color: white;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.footer-desc {
  font-size: 13px;
  opacity: 0.7;
}

.footer-right {
  text-align: right;
  font-size: 13px;
}

.footer-powered {
  margin-top: 4px;
  opacity: 0.5;
}

/* 响应式 */
@media (max-width: 768px) {
  .main-nav {
    display: none;
  }
  .hero-title {
    font-size: 36px;
  }
  .services-grid,
  .testimonial-grid,
  .env-grid {
    grid-template-columns: 1fr;
  }
  .about-grid,
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
