<template>
  <div class="page-container">
    <div class="card">
      <div class="search-bar">
        <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        <el-select v-model="statusFilter" placeholder="预约状态" clearable style="width: 150px">
          <el-option label="待确认" value="pending" />
          <el-option label="已确认" value="confirmed" />
          <el-option label="进行中" value="ongoing" />
          <el-option label="已完成" value="completed" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
        <el-button type="primary" @click="loadList">查询</el-button>
        <el-button type="success" @click="handleAdd">
          <el-icon><Plus /></el-icon>新建预约
        </el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="memberName" label="客户" width="100" />
        <el-table-column prop="serviceName" label="服务项目" width="150" />
        <el-table-column prop="staffName" label="技师" width="100" />
        <el-table-column prop="appointmentTime" label="预约时间" width="180" />
        <el-table-column prop="duration" label="时长(分钟)" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTypeMap[row.status] || 'info'">
              {{ statusTextMap[row.status] || row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" size="small" type="success" @click="handleStatus(row, 'confirmed')">确认</el-button>
            <el-button v-if="row.status === 'confirmed'" size="small" type="primary" @click="handleStatus(row, 'completed')">完成</el-button>
            <el-button v-if="['pending','confirmed'].includes(row.status)" size="small" type="danger" @click="handleStatus(row, 'cancelled')">取消</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, next"
        style="margin-top: 20px; justify-content: flex-end; display: flex"
        @current-change="loadList"
      />
    </div>

    <!-- 新建预约弹窗 -->
    <el-dialog v-model="dialogVisible" title="新建预约" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="客户姓名">
          <el-input v-model="form.memberName" placeholder="客户姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.memberPhone" placeholder="客户手机号" />
        </el-form-item>
        <el-form-item label="服务项目">
          <el-select v-model="form.serviceName" placeholder="选择项目" style="width: 100%">
            <el-option label="基础护理 60min" value="基础护理" />
            <el-option label="深度清洁 90min" value="深度清洁" />
          </el-select>
        </el-form-item>
        <el-form-item label="预约时间">
          <el-date-picker v-model="form.appointmentTime" type="datetime" placeholder="选择时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" />
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
import { getAppointmentList, createAppointment, updateAppointmentStatus } from '@/api/appointment'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const tableData = ref<any[]>([])
const dateRange = ref<Date[]>([])
const statusFilter = ref('')
const page = ref(1)
const pageSize = ref(50)
const total = ref(0)

const dialogVisible = ref(false)
const form = ref<any>({})

const statusTypeMap: Record<string, string> = {
  pending: 'warning',
  confirmed: 'primary',
  ongoing: 'success',
  completed: 'success',
  cancelled: 'info',
  no_show: 'danger',
}

const statusTextMap: Record<string, string> = {
  pending: '待确认',
  confirmed: '已确认',
  ongoing: '进行中',
  completed: '已完成',
  cancelled: '已取消',
  no_show: '缺席',
}

async function loadList() {
  loading.value = true
  try {
    const params: any = { page: page.value, pageSize: pageSize.value }
    if (statusFilter.value) params.status = statusFilter.value
    if (dateRange.value?.length === 2) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }
    const res = await getAppointmentList(params)
    tableData.value = res.list
    total.value = res.total
  } catch (error) {
    console.error('加载预约列表失败', error)
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  form.value = {}
  dialogVisible.value = true
}

async function handleSave() {
  try {
    await createAppointment(form.value)
    ElMessage.success('预约创建成功')
    dialogVisible.value = false
    loadList()
  } catch (error) {
    console.error('创建预约失败', error)
  }
}

async function handleStatus(row: any, status: string) {
  try {
    await updateAppointmentStatus(row.id, { status })
    ElMessage.success('状态更新成功')
    loadList()
  } catch (error) {
    console.error('更新状态失败', error)
  }
}

onMounted(() => {
  loadList()
})
</script>
