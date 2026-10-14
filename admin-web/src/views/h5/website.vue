<template>
  <div class="sysu-site">
    <!-- 主导航（吸顶） -->
    <header class="main-header" :class="{ scrolled: isScrolled }">
      <div class="container">
        <div class="header-inner">
          <div class="logo-area">
            <div class="logo-circle">优</div>
            <div class="logo-text">
              <h1>{{ website.title || '优雅美学' }}</h1>
              <p>ELEGANT BEAUTY CLUB</p>
            </div>
          </div>
          <nav class="main-nav">
            <a href="#home" class="active">首页</a>
            <a href="#news">店铺动态</a>
            <a href="#about">关于我们 <span class="arrow">▾</span></a>
            <a href="#services">服务项目 <span class="arrow">▾</span></a>
            <a href="#team">专业团队</a>
            <a href="#env">门店环境</a>
            <a href="#contact">联系我们</a>
          </nav>
        </div>
      </div>
    </header>

    <!-- 全屏轮播Banner -->
    <section id="home" class="hero-slider">
      <div
        v-for="(banner, index) in banners"
        :key="index"
        class="hero-slide"
        :class="{ active: currentBanner === index }"
        :style="banner.image ? { backgroundImage: `url(${banner.image})` } : {}"
      >
        <div class="hero-overlay"></div>
        <div class="hero-content container">
          <h2 class="hero-title">{{ banner.title || website.title }}</h2>
          <p class="hero-sub">{{ banner.subtitle || website.subtitle }}</p>
        </div>
      </div>

      <!-- 向下箭头 -->
      <div class="scroll-down" @click="scrollToNext">
        <span class="arrow-down">⌄</span>
      </div>

      <!-- 底部轮播指示器 -->
      <div class="hero-dots">
        <span
          v-for="(banner, index) in banners"
          :key="index"
          class="dot-line"
          :class="{ active: currentBanner === index }"
          @click="currentBanner = index"
        ></span>
      </div>
    </section>

    <!-- 店铺动态（类似中大新闻） -->
    <section id="news" class="news-section" :ref="addToRefs">
      <div class="container">
        <div class="section-header">
          <h2>店铺动态</h2>
          <a href="#" class="more-link">查看更多 →</a>
        </div>

        <!-- 主新闻：左图右文 -->
        <div class="main-news">
          <div class="news-img">
            <img v-if="featuredNews.image" :src="featuredNews.image" />
            <div v-else class="img-placeholder">店铺活动</div>
          </div>
          <div class="news-info">
            <div class="news-date">{{ featuredNews.date }}</div>
            <h3>{{ featuredNews.title }}</h3>
            <p class="news-desc">{{ featuredNews.desc }}</p>
            <div class="news-nav">
              <button class="nav-btn" @click="prevNews">‹</button>
              <button class="nav-btn" @click="nextNews">›</button>
              <span class="news-count">{{ currentNewsIndex + 1 }}/{{ newsList.length }}</span>
            </div>
          </div>
        </div>

        <!-- 下面三张小新闻卡片 -->
        <div class="sub-news-grid">
          <div class="sub-news-card" v-for="(item, index) in subNews" :key="index">
            <div class="sub-img">
              <img v-if="item.image" :src="item.image" />
              <div v-else class="img-placeholder-mini">缩略图</div>
            </div>
            <div class="sub-info">
              <div class="sub-date">{{ item.date }}</div>
              <h4>{{ item.title }}</h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 数说店铺（类似数说中大） -->
    <section class="stats-section" :ref="addToRefs">
      <div class="stats-bg"></div>
      <div class="stats-overlay"></div>
      <div class="container relative">
        <h2 class="stats-title">数说我们</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-num">{{ stats.years }}</div>
            <div class="stat-label">年行业经验</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">{{ stats.staff }}</div>
            <div class="stat-label">专业技师</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">{{ stats.customers }}</div>
            <div class="stat-label">服务客户</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">{{ stats.satisfaction }}</div>
            <div class="stat-label">% 满意度</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">{{ stats.projects }}</div>
            <div class="stat-label">服务项目</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">{{ stats.awards }}</div>
            <div class="stat-label">行业奖项</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 服务项目（类似校园看点） -->
    <section id="services" class="services-section" :ref="addToRefs">
      <div class="container">
        <div class="section-header">
          <h2>精选服务</h2>
          <a href="#" class="more-link">查看更多 →</a>
        </div>
        <div class="services-grid">
          <div class="service-card" v-for="(service, index) in services.slice(0, 3)" :key="service.id">
            <div class="service-img">
              <div class="img-placeholder-service">服务图</div>
            </div>
            <div class="service-info">
              <div class="service-tag">热门推荐</div>
              <h3>{{ service.name }}</h3>
              <p>{{ service.description || '专业技师一对一服务，让您享受舒适体验' }}</p>
              <div class="service-footer">
                <span class="price">¥{{ service.price }}</span>
                <span class="duration">{{ service.duration || '60分钟' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 门店环境 -->
    <section id="env" class="env-section" :ref="addToRefs">
      <div class="container">
        <div class="section-header">
          <h2>门店环境</h2>
          <a href="#" class="more-link">查看更多 →</a>
        </div>
        <div class="env-grid">
          <div
            v-for="(img, index) in environmentImages"
            :key="index"
            class="env-item"
            :style="{ backgroundImage: `url(${img})` }"
          >
            <div class="env-overlay">
              <span>环境展示 {{ index + 1 }}</span>
            </div>
          </div>
          <template v-if="environmentImages.length === 0">
            <div class="env-item placeholder-img">接待大厅</div>
            <div class="env-item placeholder-img">护理房间</div>
            <div class="env-item placeholder-img">休息区域</div>
          </template>
        </div>
      </div>
    </section>

    <!-- 关于我们 -->
    <section id="about" class="about-section" :ref="addToRefs">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2>关于我们</h2>
            <div class="divider"></div>
            <p>{{ website.aboutUs || '我们是一家专注于美业的高端会所，拥有多年行业经验和专业技师团队。我们以顾客为中心，以专业为基础，致力于为每一位顾客提供最优质的服务体验。' }}</p>
            <button class="learn-more">了解更多 →</button>
          </div>
          <div class="about-img">
            <div class="big-placeholder">门店实景</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系我们 + 预约 -->
    <section id="contact" class="contact-section" :ref="addToRefs">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-info">
            <h2>联系我们</h2>
            <div class="divider"></div>
            <div class="info-row">
              <label>📍 门店地址</label>
              <span>{{ website.address || '敬请期待' }}</span>
            </div>
            <div class="info-row">
              <label>📞 联系电话</label>
              <span>{{ website.phone || '敬请期待' }}</span>
            </div>
            <div class="info-row">
              <label>🕐 营业时间</label>
              <span>{{ website.businessHours || '周一至周日 10:00 - 21:00' }}</span>
            </div>
          </div>
          <div class="booking-box">
            <h3>在线预约</h3>
            <div class="form-group">
              <input v-model="bookingForm.name" type="text" placeholder="您的称呼" />
            </div>
            <div class="form-group">
              <input v-model="bookingForm.phone" type="tel" placeholder="联系电话" />
            </div>
            <div class="form-group">
              <textarea v-model="bookingForm.note" rows="3" placeholder="想体验的项目..."></textarea>
            </div>
            <button class="submit-btn" @click="submitBooking">提交预约</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="site-footer">
      <div class="container">
        <div class="footer-inner">
          <div class="footer-brand">{{ website.title || '优雅美学' }}</div>
          <p>{{ website.copyright || `© 2026 ${website.title || '优雅美学'} 版权所有` }}</p>
          <p>Powered by 店小伴SaaS</p>
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
const environmentImages = ref<string[]>([])
const banners = ref<any[]>([])
const currentBanner = ref(0)
let bannerTimer: any = null

// 滚动入场动画
const animatedSections = ref(new Set<number>())
const sectionRefs = ref<HTMLElement[]>([])

function addToRefs(el: any) {
  if (el && !sectionRefs.value.includes(el)) {
    sectionRefs.value.push(el)
  }
}

function checkScroll() {
  sectionRefs.value.forEach((el, index) => {
    if (!el) return
    const rect = el.getBoundingClientRect()
    const isVisible = rect.top < window.innerHeight * 0.85
    if (isVisible && !animatedSections.value.has(index)) {
      animatedSections.value.add(index)
      el.classList.add('animate-in')
    }
  })
}

// 新闻轮播
const currentNewsIndex = ref(0)
const newsList = ref([
  {
    date: '2026/10/01',
    title: '国庆感恩回馈，全场项目8折起',
    desc: '为庆祝国庆佳节，本店特推出感恩回馈活动，全场护理项目8折起，会员享额外9折优惠。活动时间10月1日-10月7日，欢迎预约体验。',
    image: '',
  },
  {
    date: '2026/09/15',
    title: '秋季护肤新品上市，多重好礼等您拿',
    desc: '秋季是护肤的黄金季节，我们引进了全新的秋季护理系列，针对秋季干燥敏感肌肤设计，购买套盒赠送精美礼品一份。',
    image: '',
  },
  {
    date: '2026/09/01',
    title: '教师节专属福利，教师凭证享7折优惠',
    desc: '感恩教师，桃李芬芳。9月整月，持教师证到店消费，所有项目享7折优惠，还赠送专业肌肤检测一次。',
    image: '',
  },
])

const featuredNews = ref(newsList.value[0])

const subNews = ref([
  { date: '2026/10/10', title: '储值充值优惠，充1000送200', image: '' },
  { date: '2026/10/08', title: '新客体验价，首次到店立减100元', image: '' },
  { date: '2026/10/01', title: '闺蜜同行，第二人半价', image: '' },
])

const stats = ref({
  years: 10,
  staff: 15,
  customers: 8000,
  satisfaction: 99,
  projects: 50,
  awards: 8,
})

const bookingForm = ref({
  name: '',
  phone: '',
  note: '',
})

const isScrolled = ref(false)

async function loadData() {
  const webRes: any = await request.get(`/website/public/${tenantId}`)
  website.value = webRes || {}

  if (typeof webRes?.banners === 'string') {
    try { banners.value = JSON.parse(webRes.banners) } catch {}
  } else if (webRes?.banners) {
    banners.value = webRes.banners
  }
  if (!banners.value || banners.value.length === 0) {
    banners.value = [{ image: '', title: webRes?.title || '优雅美学空间', subtitle: webRes?.subtitle || 'ELEGANT BEAUTY CLUB' }]
  }

  if (typeof webRes?.environmentImages === 'string') {
    try { environmentImages.value = JSON.parse(webRes.environmentImages) } catch {}
  } else if (webRes?.environmentImages) {
    environmentImages.value = webRes.environmentImages
  }

  const serviceRes: any = await request.get(`/website/public/${tenantId}/services`)
  services.value = serviceRes || []

  startBannerTimer()
}

function startBannerTimer() {
  if (banners.value.length <= 1) return
  bannerTimer = setInterval(() => {
    currentBanner.value = (currentBanner.value + 1) % banners.value.length
  }, 5000)
}

function prevNews() {
  currentNewsIndex.value = (currentNewsIndex.value - 1 + newsList.value.length) % newsList.value.length
  featuredNews.value = newsList.value[currentNewsIndex.value]
}

function nextNews() {
  currentNewsIndex.value = (currentNewsIndex.value + 1) % newsList.value.length
  featuredNews.value = newsList.value[currentNewsIndex.value]
}

function scrollToNext() {
  document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' })
}

function handleScroll() {
  isScrolled.value = window.scrollY > 100
}

function submitBooking() {
  if (!bookingForm.value.name || !bookingForm.value.phone) {
    ElMessage.warning('请填写称呼和联系电话')
    return
  }
  ElMessage.success('预约提交成功！')
  bookingForm.value = { name: '', phone: '', note: '' }
}

onMounted(() => {
  loadData()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('scroll', checkScroll)
  // 初始检查一次
  setTimeout(checkScroll, 100)
})

onUnmounted(() => {
  if (bannerTimer) clearInterval(bannerTimer)
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('scroll', checkScroll)
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.sysu-site {
  font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", sans-serif;
  color: #333;
  --primary: #006633;
  --primary-dark: #004d26;
  --accent: #c9a96e;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
}

.relative {
  position: relative;
  z-index: 2;
}

/* 主导航 */
.main-header {
  background: white;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: all 0.3s;
}

.main-header.scrolled {
  padding: 10px 0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-circle {
  width: 50px;
  height: 50px;
  border: 2px solid var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 22px;
  font-weight: bold;
}

.logo-text h1 {
  font-size: 24px;
  color: var(--primary);
  font-weight: 600;
  letter-spacing: 2px;
  line-height: 1.2;
}

.logo-text p {
  font-size: 10px;
  color: #999;
  letter-spacing: 1px;
  margin-top: 2px;
}

.main-nav {
  display: flex;
  gap: 36px;
}

.main-nav a {
  color: #333;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s;
  padding: 8px 0;
  position: relative;
}

.main-nav a:hover,
.main-nav a.active {
  color: var(--primary);
}

.main-nav a.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary);
}

.arrow {
  font-size: 10px;
  margin-left: 2px;
}

/* 全屏轮播Banner */
.hero-slider {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.hero-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1s ease;
  background-size: cover;
  background-position: center;
  background: linear-gradient(135deg, #004d26 0%, #006633 50%, #008040 100%);
  display: flex;
  align-items: center;
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
  z-index: 2;
  color: white;
}

.hero-title {
  font-size: 42px;
  font-weight: 300;
  letter-spacing: 4px;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.hero-sub {
  font-size: 18px;
  opacity: 0.9;
  letter-spacing: 2px;
}

.scroll-down {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 28px;
  cursor: pointer;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
  40% { transform: translateX(-50%) translateY(-10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
}

.hero-dots {
  position: absolute;
  bottom: 30px;
  right: 40px;
  display: flex;
  gap: 8px;
}

.dot-line {
  width: 30px;
  height: 3px;
  background: rgba(255,255,255,0.3);
  cursor: pointer;
  transition: all 0.3s;
}

.dot-line.active {
  background: white;
  width: 45px;
}

/* Section通用 */
section {
  padding: 80px 0;
}

/* 滚动入场动画 */
section {
  opacity: 0;
  transition: opacity 0.8s ease, transform 0.8s ease;
}

/* 店铺动态：从左滑入 */
.news-section {
  transform: translateX(-80px);
}

.news-section.animate-in {
  opacity: 1;
  transform: translateX(0);
}

/* 数据统计：缩放进入 */
.stats-section {
  transform: scale(0.9);
}

.stats-section.animate-in {
  opacity: 1;
  transform: scale(1);
}

/* 服务项目：从右滑入 */
.services-section {
  transform: translateX(80px);
}

.services-section.animate-in {
  opacity: 1;
  transform: translateX(0);
}

/* 门店环境：从下滑入 */
.env-section {
  transform: translateY(80px);
}

.env-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* 关于我们：从下淡入 */
.about-section {
  transform: translateY(60px);
  transition-delay: 0.1s;
}

.about-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* 联系我们：从右滑入 */
.contact-section {
  transform: translateX(60px);
}

.contact-section.animate-in {
  opacity: 1;
  transform: translateX(0);
}

#home {
  opacity: 1;
  transform: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 32px;
  color: var(--primary);
  font-weight: 600;
}

.more-link {
  font-size: 14px;
  color: #999;
  text-decoration: none;
  transition: color 0.2s;
}

.more-link:hover {
  color: var(--primary);
}

/* 新闻板块 */
.news-section {
  background: #f5f5f3;
  position: relative;
}

.main-news {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 30px;
}

.news-img {
  height: 320px;
  overflow: hidden;
}

.news-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #d4cfc7, #b8b0a4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
}

.news-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.news-date {
  font-size: 14px;
  color: var(--primary);
  margin-bottom: 12px;
  font-weight: 500;
}

.news-info h3 {
  font-size: 24px;
  line-height: 1.5;
  margin-bottom: 16px;
  color: #333;
}

.news-desc {
  font-size: 14px;
  color: #888;
  line-height: 1.8;
  margin-bottom: 24px;
}

.news-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.news-count {
  font-size: 24px;
  color: var(--primary);
  font-weight: 600;
  margin-left: auto;
}

.sub-news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.sub-news-card {
  background: white;
  padding: 16px;
  display: flex;
  gap: 16px;
  transition: all 0.3s;
  cursor: pointer;
}

.sub-news-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.sub-img {
  width: 100px;
  height: 70px;
  flex-shrink: 0;
}

.img-placeholder-mini {
  width: 100%;
  height: 100%;
  background: #e8e4de;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 11px;
}

.sub-info h4 {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-top: 4px;
}

.sub-date {
  font-size: 12px;
  color: var(--primary);
  font-weight: 500;
}

/* 数据统计 */
.stats-section {
  position: relative;
  padding: 100px 0;
  overflow: hidden;
}

.stats-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #004d26 0%, #006633 100%);
}

.stats-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.2) 100%);
}

.stats-title {
  text-align: center;
  color: white;
  font-size: 36px;
  font-weight: 300;
  margin-bottom: 60px;
  letter-spacing: 4px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  text-align: center;
}

.stat-num {
  font-size: 56px;
  color: white;
  font-weight: 300;
  line-height: 1;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  letter-spacing: 1px;
}

/* 服务项目 */
.services-section {
  background: white;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.service-card {
  background: white;
  border: 1px solid #eee;
  transition: all 0.3s;
  cursor: pointer;
}

.service-card:hover {
  border-color: var(--primary);
  box-shadow: 0 8px 30px rgba(0,102,51,0.15);
}

.service-img {
  height: 200px;
  background: linear-gradient(135deg, #e8e4de, #d4cfc7);
}

.img-placeholder-service {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
}

.service-info {
  padding: 20px;
}

.service-tag {
  display: inline-block;
  background: #fff3e0;
  color: #e65100;
  font-size: 11px;
  padding: 3px 8px;
  margin-bottom: 10px;
}

.service-info h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.service-info p {
  font-size: 13px;
  color: #999;
  line-height: 1.6;
  margin-bottom: 16px;
}

.service-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 20px;
  color: #c0392b;
  font-weight: 600;
}

.duration {
  font-size: 12px;
  color: #999;
}

/* 门店环境 */
.env-section {
  background: #f9f9f9;
}

.env-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.env-item {
  aspect-ratio: 4/3;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.env-item:hover .env-overlay {
  opacity: 1;
}

.env-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,102,51,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.placeholder-img {
  background: #e8e4de;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
}

/* 关于我们 */
.about-section {
  background: white;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.about-text h2 {
  font-size: 32px;
  color: var(--primary);
  margin-bottom: 16px;
}

.divider {
  width: 40px;
  height: 3px;
  background: var(--accent);
  margin-bottom: 24px;
}

.about-text p {
  font-size: 15px;
  line-height: 2;
  color: #666;
  margin-bottom: 30px;
}

.learn-more {
  padding: 12px 32px;
  background: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.learn-more:hover {
  background: var(--primary);
  color: white;
}

.big-placeholder {
  height: 350px;
  background: linear-gradient(135deg, #e8e4de, #d4cfc7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 18px;
}

/* 联系我们 */
.contact-section {
  background: #f5f5f3;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.contact-info h2 {
  font-size: 28px;
  color: var(--primary);
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid #e0e0e0;
  font-size: 15px;
}

.info-row label {
  width: 100px;
  color: #999;
}

.booking-box {
  background: white;
  padding: 36px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.booking-box h3 {
  font-size: 20px;
  color: var(--primary);
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #ddd;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--primary);
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: var(--primary);
  color: white;
  border: none;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: var(--primary-dark);
}

/* 页脚 */
.site-footer {
  background: #1a1a1a;
  color: #888;
  padding: 40px 0;
  text-align: center;
  font-size: 13px;
}

.footer-brand {
  font-size: 18px;
  color: white;
  margin-bottom: 12px;
}

.site-footer p {
  margin: 6px 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .main-nav {
    display: none;
  }
  .hero-title {
    font-size: 36px;
  }
  .main-news,
  .about-content,
  .contact-grid {
    grid-template-columns: 1fr;
  }
  .sub-news-grid,
  .services-grid,
  .env-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
