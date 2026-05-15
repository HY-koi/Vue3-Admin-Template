<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import draggable from 'vuedraggable'

const STORAGE_KEY = 'todo_list_data'

// 从localStorage读取数据
const loadTodos = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const todos = ref(loadTodos())

// 监听变化自动保存
watch(todos, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

const activeTag = ref('all')
const tags = ['all', 'work', 'study', 'life']
const tagLabels = { all: '全部', work: '工作', study: '学习', life: '生活' }
const tagColors = { work: '#409EFF', study: '#67C23A', life: '#E6A23C' }

let nextId = Date.now()
const genId = () => ++nextId

const dialogVisible = ref(false)
const form = ref({ title: '', tag: 'work', priority: 'medium' })
const action = ref('add')
const editId = ref(-1)

const filteredTodos = computed(() => {
  if (activeTag.value === 'all') return todos.value
  return todos.value.filter(t => t.tag === activeTag.value)
})

const stats = computed(() => ({
  total: todos.value.length,
  done: todos.value.filter(t => t.done).length,
  pending: todos.value.filter(t => !t.done).length
}))

const handleAdd = () => {
  action.value = 'add'
  form.value = { title: '', tag: 'work', priority: 'medium' }
  dialogVisible.value = true
}

const handleEdit = (item) => {
  action.value = 'edit'
  editId.value = item.id
  form.value = { ...item }
  dialogVisible.value = true
}

const handleSubmit = () => {
  if (!form.value.title.trim()) {
    ElMessage.warning('请输入待办事项')
    return
  }
  if (action.value === 'add') {
    todos.value.unshift({
      ...form.value,
      id: genId(),
      done: false,
      createdAt: new Date().toLocaleString()
    })
    ElMessage.success('添加成功')
  } else {
    const idx = todos.value.findIndex(t => t.id === editId.value)
    if (idx > -1) {
      todos.value[idx] = { ...todos.value[idx], ...form.value }
    }
    ElMessage.success('编辑成功')
  }
  dialogVisible.value = false
}

const handleDelete = (item) => {
  ElMessageBox.confirm('确认删除该待办事项？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const idx = todos.value.findIndex(t => t.id === item.id)
    if (idx > -1) todos.value.splice(idx, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const toggleDone = (item) => {
  item.done = !item.done
}

const clearDone = () => {
  ElMessageBox.confirm('确认清除所有已完成的事项？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    todos.value = todos.value.filter(t => !t.done)
    ElMessage.success('清除成功')
  }).catch(() => {})
}

const priorityLabel = (p) => {
  const map = { high: '高', medium: '中', low: '低' }
  return map[p] || '中'
}

const priorityColor = (p) => {
  const map = { high: '#F56C6C', medium: '#E6A23C', low: '#67C23A' }
  return map[p] || '#E6A23C'
}
</script>

<template>
  <div class="todo-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <span class="stat-num total">{{ stats.total }}</span>
            <span class="stat-label">全部任务</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <span class="stat-num pending">{{ stats.pending }}</span>
            <span class="stat-label">待完成</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <span class="stat-num done">{{ stats.done }}</span>
            <span class="stat-label">已完成</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 操作栏 -->
    <div class="action-bar">
      <div class="tag-filter">
        <el-radio-group v-model="activeTag" size="small">
          <el-radio-button v-for="tag in tags" :key="tag" :value="tag">
            {{ tagLabels[tag] }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="action-btns">
        <el-button type="danger" size="small" @click="clearDone" :disabled="stats.done === 0">
          清除已完成
        </el-button>
        <el-button type="primary" size="small" @click="handleAdd">
          新增待办
        </el-button>
      </div>
    </div>

    <!-- 待办列表（可拖拽） -->
    <div class="todo-list">
      <draggable v-model="todos" item-key="id" handle=".drag-handle" animation="300">
        <template #item="{ element, index }">
          <el-card
            v-show="activeTag === 'all' || element.tag === activeTag"
            shadow="hover"
            class="todo-item"
            :class="{ 'is-done': element.done }"
          >
            <div class="todo-content">
              <el-icon class="drag-handle"><Rank /></el-icon>
              <el-checkbox
                :model-value="element.done"
                @change="toggleDone(element)"
              />
              <div class="todo-info">
                <span class="todo-title">{{ element.title }}</span>
                <div class="todo-meta">
                  <el-tag size="small" :color="tagColors[element.tag]" effect="dark" style="border:none">
                    {{ tagLabels[element.tag] }}
                  </el-tag>
                  <el-tag size="small" :color="priorityColor(element.priority)" effect="dark" style="border:none">
                    {{ priorityLabel(element.priority) }}
                  </el-tag>
                  <span class="todo-time">{{ element.createdAt }}</span>
                </div>
              </div>
              <div class="todo-actions">
                <el-button type="primary" size="small" link @click="handleEdit(element)">编辑</el-button>
                <el-button type="danger" size="small" link @click="handleDelete(element)">删除</el-button>
              </div>
            </div>
          </el-card>
        </template>
      </draggable>

      <el-empty v-if="filteredTodos.length === 0" description="暂无待办事项" />
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="action === 'add' ? '新增待办' : '编辑待办'" width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入待办事项" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.tag" style="width:100%">
            <el-option label="工作" value="work" />
            <el-option label="学习" value="study" />
            <el-option label="生活" value="life" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-radio-group v-model="form.priority">
            <el-radio value="high">高</el-radio>
            <el-radio value="medium">中</el-radio>
            <el-radio value="low">低</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.todo-container {
  padding: 10px;
}
.stats-row {
  margin-bottom: 20px;
  .stat-card {
    text-align: center;
    :deep(.el-card__body) {
      padding: 15px;
    }
  }
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .stat-num {
    font-size: 32px;
    font-weight: bold;
    &.total { color: #409EFF; }
    &.pending { color: #E6A23C; }
    &.done { color: #67C23A; }
  }
  .stat-label {
    font-size: 14px;
    color: #999;
    margin-top: 5px;
  }
}
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  .action-btns {
    display: flex;
    gap: 10px;
  }
}
.todo-list {
  max-height: 520px;
  overflow-y: auto;
}
.todo-item {
  margin-bottom: 10px;
  transition: all 0.3s;
  &.is-done {
    opacity: 0.6;
    .todo-title {
      text-decoration: line-through;
      color: #999;
    }
  }
  :deep(.el-card__body) {
    padding: 12px 16px;
  }
}
.todo-content {
  display: flex;
  align-items: center;
  gap: 12px;
}
.drag-handle {
  cursor: move;
  color: #ccc;
  font-size: 18px;
  &:hover { color: #409EFF; }
}
.todo-info {
  flex: 1;
  .todo-title {
    font-size: 15px;
    color: #333;
  }
  .todo-meta {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 6px;
    .todo-time {
      font-size: 12px;
      color: #bbb;
    }
  }
}
.todo-actions {
  display: flex;
  gap: 5px;
}
</style>
