<template>
  <div class="page-container">
    <el-card>
      <div class="header-bar">
        <div class="left">
          <el-date-picker
            v-model="weekStart"
            type="week"
            placeholder="选择周"
            format="YYYY年第ww周"
            @change="loadSchedule"
          />
          <el-button style="margin-left: 12px" @click="handleCopyLastWeek">
            复制上周排班
          </el-button>
        </div>
        <el-button type="primary" @click="handleSaveAll">保存排班</el-button>
      </div>

      <el-table :data="scheduleData" v-loading="loading" border style="margin-top: 20px">
        <el-table-column prop="staffName" label="员工姓名" width="120" fixed />
        <el-table-column prop="position" label="岗位" width="100" />
        <el-table-column v-for="day in weekDays" :key="day.date" :label="day.label" min-width="140">
          <template #default="{ row }">
            <div
              class="day-cell"
              :class="getDayData(row, day.date).status"
              @click="openDayDialog(row, day.date)"
            >
              <div v-if="getDayData(row, day.date).status === 'off'" class="cell-content">
                休息
              </div>
              <div v-else-if="getDayData(row, day.date).status === 'leave'" class="cell-content">
                请假
              </div>
              <div v-else class="cell-content">
                <el-tag size="small" type="success">
                  {{ dayText[getDayData(row, day.date).status] }}
                </el-tag>
                <div class="time">{{ getDayData(row, day.date).startTime }} - {{ getDayData(row, day.date).endTime }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑单日排班弹窗 -->
    <el-dialog v-model="dialogVisible" title="设置排班" width="400px">
      <el-form label-width="80px">
        <el-form-item label="员工">
          <el-input v-model="currentRow.staffName" disabled />
        </el-form-item>
        <el-form-item label="日期">
          <el-input v-model="currentDate" disabled />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="dayForm.status">
            <el-radio value="morning">上午班</el-radio>
            <el-radio value="afternoon">下午班</el-radio>
            <el-radio value="evening" disabled>晚班（暂未开放）</el-radio>
            <el-radio value="off">休息</el-radio>
            <el-radio value="leave">请假</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="dayForm.status === 'morning'">
          <el-form-item label="上班时间">
            <el-time-picker v-model="dayForm.startTime" format="HH:mm" value-format="HH:mm" />
          </el-form-item>
          <el-form-item label="下班时间">
            <el-time-picker v-model="dayForm.endTime" format="HH:mm" value-format="HH:mm" />
          </el-form-item>
        </template>
        <template v-if="dayForm.status === 'afternoon'">
          <el-form-item label="上班时间">
            <el-time-picker v-model="dayForm.startTime" format="HH:mm" value-format="HH:mm" />
          </el-form-item>
          <el-form-item label="下班时间">
            <el-time-picker v-model="dayForm.endTime" format="HH:mm" value-format="HH:mm" />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDaySave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const weekStart = ref(new Date().toISOString().slice(0, 10))
const scheduleData = ref<any[]>([])

// 排班状态文字
const dayText: Record<string, string> = {
  morning: '上午班',
  afternoon: '下午班',
  evening: '晚班',
  off: '休息',
  leave: '请假',
}
const weekDays = ref([
  { date: '', label: '周一' },
  { date: '', label: '周二' },
  { date: '', label: '周三' },
  { date: '', label: '周四' },
  { date: '', label: '周五' },
  { date: '', label: '周六' },
  { date: '', label: '周日' },
])

const dialogVisible = ref(false)
const currentRow = ref<any>({})
const currentDate = ref('')
const dayForm = ref<any>({
  status: 'morning',
  startTime: '10:00',
  endTime: '14:00',
})

async function loadSchedule() {
  loading.value = true
  try {
    const res = await request.get('/schedules', { params: { weekStart: weekStart.value } })
    scheduleData.value = res

    if (res.length > 0 && res[0].days) {
      weekDays.value = res[0].days.map((d: any, i: number) => ({
        date: d.date,
        label: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
      }))
    }
  } catch (error) {
    console.error('加载排班失败', error)
  } finally {
    loading.value = false
  }
}

function getDayData(row: any, date: string) {
  return row.days.find((d: any) => d.date === date) || { status: 'off', startTime: '', endTime: '' }
}

function openDayDialog(row: any, date: string) {
  currentRow.value = row
  currentDate.value = date
  const day = getDayData(row, date)
  dayForm.value = {
    status: day.status,
    startTime: day.startTime || '10:00',
    endTime: day.endTime || '20:00',
  }
  dialogVisible.value = true
}

async function handleDaySave() {
  // 更新本地数据
  const day = currentRow.value.days.find((d: any) => d.date === currentDate.value)
  if (day) {
    day.status = dayForm.value.status
    day.startTime = dayForm.value.startTime
    day.endTime = dayForm.value.endTime
  }
  dialogVisible.value = false
}

async function handleSaveAll() {
  // 批量保存所有修改过的排班
  for (const row of scheduleData.value) {
    for (const day of row.days) {
      if (day.status !== 'off') { // 只保存不是休息的
        await request.post('/schedules', {
          staffId: row.staffId,
          staffName: row.staffName,
          workDate: day.date,
          startTime: day.startTime,
          endTime: day.endTime,
          status: day.status,
        })
      }
    }
  }
  ElMessage.success('排班保存成功')
  loadSchedule()
}

async function handleCopyLastWeek() {
  await request.post('/schedules/copy-last-week', { targetWeekStart: weekStart.value })
  ElMessage.success('已复制上周排班')
  loadSchedule()
}

onMounted(() => { loadSchedule() })
</script>

<style scoped>
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.day-cell {
  text-align: center;
  padding: 8px 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}
.day-cell:hover {
  background: #ecf5ff;
}
.day-cell.off .cell-content {
  color: #909399;
}
.day-cell.leave .cell-content {
  color: #f56c6c;
}
.day-cell.working .time {
  font-size: 12px;
  color: #606266;
  margin-top: 4px;
}
</style>
