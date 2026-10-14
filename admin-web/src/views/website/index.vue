<template>
  <div class="page">
    <h2 style="margin-bottom: 24px">企业官网设置</h2>

    <el-tabs v-model="activeTab">
      <!-- 基础信息 -->
      <el-tab-pane label="基础信息" name="basic">
        <el-card shadow="never" style="max-width: 800px">
          <el-form :model="form" label-width="100px">
            <el-divider>品牌信息</el-divider>
            <el-form-item label="网站标题">
              <el-input v-model="form.title" placeholder="如：XX美容SPA会所" />
            </el-form-item>
            <el-form-item label="Slogan">
              <el-input v-model="form.subtitle" placeholder="如：匠心十年，专注美肤" />
            </el-form-item>

            <el-divider>配色方案</el-divider>
            <el-form-item label="主色调">
              <el-color-picker v-model="form.primaryColor" />
              <span style="margin-left: 12px; color: #909399">用于导航、按钮等主元素</span>
            </el-form-item>
            <el-form-item label="点缀色">
              <el-color-picker v-model="form.accentColor" />
              <span style="margin-left: 12px; color: #909399">用于强调文字、装饰线条</span>
            </el-form-item>

            <el-divider>联系信息</el-divider>
            <el-form-item label="店铺地址">
              <el-input v-model="form.address" placeholder="详细地址" />
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="form.phone" placeholder="联系电话" />
            </el-form-item>
            <el-form-item label="营业时间">
              <el-input v-model="form.businessHours" placeholder="如：周一至周日 10:00-21:00" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <!-- 轮播图 -->
      <el-tab-pane label="首页轮播图" name="banners">
        <el-card shadow="never" style="max-width: 800px">
          <div class="section-desc">
            <p>设置官网首页的轮播大图，建议尺寸 1920x800px</p>
          </div>

          <div v-for="(banner, index) in form.banners" :key="index" class="banner-item">
            <el-card shadow="hover">
              <div class="banner-header">
                <span>第 {{ index + 1 }} 张轮播图</span>
                <el-button size="small" type="danger" @click="removeBanner(index)">删除</el-button>
              </div>
              <el-form label-width="80px">
                <el-form-item label="图片">
                  <el-upload
                    action="#"
                    :auto-upload="false"
                    :on-change="(file) => handleBannerImage(file, index)"
                    :show-file-list="false"
                  >
                    <div class="upload-area">
                      <img v-if="banner.image" :src="banner.image" class="banner-preview" />
                      <span v-else>点击上传图片</span>
                    </div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="主标题">
                  <el-input v-model="banner.title" placeholder="轮播图主标题" />
                </el-form-item>
                <el-form-item label="副标题">
                  <el-input v-model="banner.subtitle" placeholder="轮播图副标题" />
                </el-form-item>
              </el-form>
            </el-card>
          </div>

          <el-button type="primary" plain @click="addBanner" style="margin-top: 16px">+ 添加轮播图</el-button>
        </el-card>
      </el-tab-pane>

      <!-- 关于我们 -->
      <el-tab-pane label="关于我们" name="about">
        <el-card shadow="never" style="max-width: 800px">
          <el-form :model="form" label-width="100px">
            <el-form-item label="板块标题">
              <el-input v-model="form.aboutTitle" placeholder="如：走进我们" />
            </el-form-item>
            <el-form-item label="详细介绍">
              <el-input v-model="form.aboutUs" type="textarea" :rows="8" placeholder="介绍您的品牌故事、服务理念、团队优势等" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <!-- 环境展示 -->
      <el-tab-pane label="环境展示" name="environment">
        <el-card shadow="never" style="max-width: 800px">
          <div class="section-desc">
            <p>上传门店环境照片，展示装修风格和服务环境，建议尺寸 800x600px</p>
          </div>
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleEnvImage"
            :file-list="envFileList"
          >
            <div>
              <el-icon><Plus /></el-icon>
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </el-upload>
        </el-card>
      </el-tab-pane>

      <!-- 客户评价 -->
      <el-tab-pane label="客户评价" name="testimonials">
        <el-card shadow="never" style="max-width: 800px">
          <div class="section-desc">
            <p>展示客户好评，增强信任感</p>
          </div>
          <div v-for="(item, index) in form.testimonials" :key="index" class="testimonial-item">
            <el-card shadow="hover">
              <div class="banner-header">
                <span>评价 {{ index + 1 }}</span>
                <el-button size="small" type="danger" @click="removeTestimonial(index)">删除</el-button>
              </div>
              <el-form label-width="80px">
                <el-form-item label="客户姓名">
                  <el-input v-model="item.name" placeholder="如：王女士" />
                </el-form-item>
                <el-form-item label="评价内容">
                  <el-input v-model="item.content" type="textarea" :rows="3" placeholder="客户的好评内容" />
                </el-form-item>
              </el-form>
            </el-card>
          </div>
          <el-button type="primary" plain @click="addTestimonial" style="margin-top: 16px">+ 添加评价</el-button>
        </el-card>
      </el-tab-pane>

      <!-- 功能开关 -->
      <el-tab-pane label="功能设置" name="settings">
        <el-card shadow="never" style="max-width: 800px">
          <el-form label-width="120px">
            <el-form-item label="在线预约">
              <el-switch v-model="form.enableBooking" :active-value="1" :inactive-value="0" />
              <span style="margin-left: 10px; color: #909399">顾客可在网站上直接提交预约</span>
            </el-form-item>
            <el-form-item label="版权信息">
              <el-input v-model="form.copyright" placeholder="如：© 2026 XX美容 版权所有" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 底部操作栏 -->
    <div class="action-bar">
      <el-button type="primary" size="large" @click="handleSave">保存所有配置</el-button>
      <el-button size="large" @click="previewWebsite">预览网站</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const activeTab = ref('basic')
const tenantId = ref(1)

const form = ref({
  title: '',
  subtitle: '',
  aboutTitle: '关于我们',
  aboutUs: '',
  banners: [] as any[],
  address: '',
  phone: '',
  businessHours: '',
  environmentImages: [] as string[],
  testimonials: [] as any[],
  primaryColor: '#1a1a2e',
  accentColor: '#c9a96e',
  enableBooking: 1,
  wechatQr: '',
  copyright: '',
})

const envFileList = ref([])

async function loadData() {
  const res: any = await request.get('/website')
  Object.assign(form.value, res)
  tenantId.value = res.tenantId || 1

  // 解析轮播图
  if (typeof form.value.banners === 'string') {
    try { form.value.banners = JSON.parse(form.value.banners) } catch { form.value.banners = [] }
  }
  if (!form.value.banners) form.value.banners = []

  // 解析环境图
  if (typeof form.value.environmentImages === 'string') {
    try { form.value.environmentImages = JSON.parse(form.value.environmentImages) } catch { form.value.environmentImages = [] }
  }
  if (!form.value.environmentImages) form.value.environmentImages = []

  // 解析评价
  if (typeof form.value.testimonials === 'string') {
    try { form.value.testimonials = JSON.parse(form.value.testimonials) } catch { form.value.testimonials = [] }
  }
  if (!form.value.testimonials) form.value.testimonials = []

  // 环境图文件列表
  envFileList.value = form.value.environmentImages.map((url: string, i: number) => ({
    name: `环境图${i + 1}`,
    url,
  }))
}

function addBanner() {
  form.value.banners.push({ image: '', title: '', subtitle: '' })
}

function removeBanner(index: number) {
  form.value.banners.splice(index, 1)
}

function handleBannerImage(file: any, index: number) {
  // 模拟上传，实际项目中应该上传到OSS
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.banners[index].image = e.target?.result as string
  }
  reader.readAsDataURL(file.raw)
}

function handleEnvImage(file: any) {
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.environmentImages.push(e.target?.result as string)
    envFileList.value.push({ name: file.name, url: e.target?.result as string })
  }
  reader.readAsDataURL(file.raw)
}

function addTestimonial() {
  form.value.testimonials.push({ name: '', content: '' })
}

function removeTestimonial(index: number) {
  form.value.testimonials.splice(index, 1)
}

async function handleSave() {
  await request.put('/website', form.value)
  ElMessage.success('网站配置已保存')
}

function previewWebsite() {
  window.open(`/h5/${tenantId.value}`, '_blank')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-desc {
  color: #909399;
  font-size: 14px;
  margin-bottom: 20px;
}

.banner-item {
  margin-bottom: 16px;
}

.banner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-weight: 600;
}

.upload-area {
  width: 400px;
  height: 100px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  cursor: pointer;
  overflow: hidden;
}

.banner-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.testimonial-item {
  margin-bottom: 16px;
}

.action-bar {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;
  text-align: center;
}
</style>
