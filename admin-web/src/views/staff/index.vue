<template>
  <div class="page-container">
    <div class="card">
      <div class="search-bar">
        <el-button type="success" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增员工
        </el-button>
      </div>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="6" v-for="item in tableData" :key="item.id">
          <el-card shadow="hover" class="staff-card">
            <div class="staff-avatar">
              <el-icon :size="40"><Avatar /></el-icon>
            </div>
            <h3>{{ item.name }}</h3>
            <p class="position">{{ item.position }}</p>
            <p class="phone">{{ item.phone }}</p>
            <div class="commission">提成比例：{{ item.commissionRate }}%</div>
            <el-button size="small" @click="handleEdit(item)">编辑</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" placeholder="员工姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="岗位">
          <el-select v-model="form.position" placeholder="选择岗位">
            <el-option label="技师" value="技师" />
            <el-option label="前台" value="前台" />
            <el-option label="顾问" value="顾问" />
          </el-select>
        </el-form-item>
        <el-form-item label="提成比例%">
          <el-input-number v-model="form.commissionRate" :min="0" :max="100" />
        </el-form-item>
        <el-divider>登录账号设置</el-divider>
        <el-form-item label="登录账号">
          <el-input v-model="form.username" placeholder="员工登录用的账号" />
        </el-form-item>
        <el-form-item label="初始密码">
          <el-input v-model="form.password" placeholder="初始密码，比如123456" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" placeholder="选择角色">
            <el-option label="老板" value="店主" />
            <el-option label="店长" value="店长" />
            <el-option label="收银员" value="收银员" />
            <el-option label="技师" value="店员" />
          </el-select>
        </el-form-item>
        <el-divider>菜单权限设置（这个员工能看到哪些菜单）</el-divider>
        <el-form-item label="可见菜单">
          <el-checkbox-group v-model="form.menus">
            <el-checkbox value="dashboard">工作台</el-checkbox>
            <el-checkbox value="member">会员管理</el-checkbox>
            <el-checkbox value="appointment">预约管理</el-checkbox>
            <el-checkbox value="service">服务项目</el-checkbox>
            <el-checkbox value="card">卡项管理</el-checkbox>
            <el-checkbox value="order">订单收银</el-checkbox>
            <el-checkbox value="commission">提成管理</el-checkbox>
            <el-checkbox value="marketing">营销中心</el-checkbox>
            <el-checkbox value="stock">库存管理</el-checkbox>
            <el-checkbox value="report">数据报表</el-checkbox>
            <el-checkbox value="staff">员工管理</el-checkbox>
            <el-checkbox value="setting">店铺设置</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getStaffList, createStaff, updateStaff } from '@/api'
import { ElMessage } from 'element-plus'

const tableData = ref<any[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增员工')
const form = ref<any>({ commissionRate: 10 })

async function loadList() {
  try {
    const res = await getStaffList()
    tableData.value = res
  } catch (error) {
    console.error('加载员工列表失败', error)
  }
}

function handleAdd() {
  dialogTitle.value = '新增员工'
  form.value = {
    commissionRate: 10,
    role: '店员',
    password: '123456',
    menus: ['order', 'appointment', 'commission']
  }
  dialogVisible.value = true
}

function handleEdit(row: any) {
  dialogTitle.value = '编辑员工'
  form.value = {
    ...row,
    menus: row.menus || [], // 确保menus是数组
  }
  dialogVisible.value = true
}

async function handleSave() {
  try {
    if (form.value.id) {
      await updateStaff(form.value.id, form.value)
      ElMessage.success('更新成功')
    } else {
      await createStaff(form.value)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadList()
  } catch (error) {
    console.error('保存失败', error)
  }
}

onMounted(() => { loadList() })
</script>

<style scoped>
.staff-card {
  text-align: center;
  margin-bottom: 20px;
}
.staff-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: #909399;
}
.position {
  color: #409eff;
  font-size: 13px;
  margin: 4px 0;
}
.phone {
  color: #909399;
  font-size: 13px;
  margin-bottom: 8px;
}
.commission {
  font-size: 13px;
  color: #606266;
  margin-bottom: 12px;
}
</style>
