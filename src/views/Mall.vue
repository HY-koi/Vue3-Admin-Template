<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Mock from 'mockjs'

// 商品分类
const categories = ['电子产品', '服装鞋帽', '食品饮料', '家居用品', '图书文具']

// 生成模拟商品数据
const goodsList = ref([])
const count = 50
for (let i = 0; i < count; i++) {
  goodsList.value.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cword(2, 6) + '商品' + (i + 1),
    category: categories[Mock.Random.integer(0, categories.length - 1)],
    price: Mock.Random.float(10, 9999, 2, 2),
    stock: Mock.Random.integer(0, 500),
    sales: Mock.Random.integer(0, 1000),
    status: Mock.Random.integer(0, 1),
    image: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm'),
    description: Mock.Random.cparagraph(1, 2)
  }))
}

// 搜索和分页
const searchForm = reactive({ name: '', category: '', status: '' })
const page = ref(1)
const limit = ref(10)

const filteredGoods = computed(() => {
  return goodsList.value.filter(item => {
    if (searchForm.name && !item.name.includes(searchForm.name)) return false
    if (searchForm.category && item.category !== searchForm.category) return false
    if (searchForm.status !== '' && item.status !== searchForm.status) return false
    return true
  })
})

const pagedGoods = computed(() => {
  const start = (page.value - 1) * limit.value
  return filteredGoods.value.slice(start, start + limit.value)
})

const total = computed(() => filteredGoods.value.length)

const stats = computed(() => ({
  total: goodsList.value.length,
  onSale: goodsList.value.filter(g => g.status === 1).length,
  offSale: goodsList.value.filter(g => g.status === 0).length,
  lowStock: goodsList.value.filter(g => g.stock < 10).length,
}))

// 弹窗
const dialogVisible = ref(false)
const action = ref('add')
const form = ref({ name: '', category: '', price: 0, stock: 0, status: 1, description: '' })

const handleAdd = () => {
  action.value = 'add'
  form.value = { name: '', category: '', price: 0, stock: 0, status: 1, description: '' }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  action.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = () => {
  if (!form.value.name.trim()) { ElMessage.warning('请输入商品名称'); return }
  if (!form.value.category) { ElMessage.warning('请选择分类'); return }
  if (form.value.price <= 0) { ElMessage.warning('价格必须大于0'); return }
  if (form.value.stock < 0) { ElMessage.warning('库存不能为负'); return }

  if (action.value === 'add') {
    goodsList.value.unshift({
      ...form.value,
      id: Mock.Random.guid(),
      sales: 0,
      image: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
      createTime: new Date().toLocaleString()
    })
    ElMessage.success('添加成功')
  } else {
    const idx = goodsList.value.findIndex(g => g.id === form.value.id)
    if (idx > -1) goodsList.value[idx] = { ...goodsList.value[idx], ...form.value }
    ElMessage.success('编辑成功')
  }
  dialogVisible.value = false
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除商品"' + row.name + '"？', '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(() => {
    const idx = goodsList.value.findIndex(g => g.id === row.id)
    if (idx > -1) goodsList.value.splice(idx, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const toggleStatus = (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  const msg = newStatus === 1 ? '上架' : '下架'
  ElMessageBox.confirm('确认' + msg + '商品"' + row.name + '"？', '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(() => {
    row.status = newStatus
    ElMessage.success(msg + '成功')
  }).catch(() => {})
}

const selectedRows = ref([])
const handleSelectionChange = (rows) => { selectedRows.value = rows }

const handleBatchStatus = (status) => {
  if (selectedRows.value.length === 0) { ElMessage.warning('请先选择商品'); return }
  const msg = status === 1 ? '上架' : '下架'
  ElMessageBox.confirm('确认批量' + msg + selectedRows.value.length + '个商品？', '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(() => {
    selectedRows.value.forEach(row => { row.status = status })
    ElMessage.success('批量' + msg + '成功')
  }).catch(() => {})
}

const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) { ElMessage.warning('请先选择商品'); return }
  ElMessageBox.confirm('确认批量删除' + selectedRows.value.length + '个商品？', '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(() => {
    const ids = selectedRows.value.map(r => r.id)
    goodsList.value = goodsList.value.filter(g => !ids.includes(g.id))
    ElMessage.success('批量删除成功')
  }).catch(() => {})
}

const handleSearch = () => { page.value = 1 }
const handleReset = () => {
  searchForm.name = ''; searchForm.category = ''; searchForm.status = ''
  page.value = 1
}

const detailVisible = ref(false)
const currentGoods = ref(null)
const showDetail = (row) => { currentGoods.value = row; detailVisible.value = true }
</script>

<template>
  <div class="mall-container">
    <!-- 统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background:#409EFF"><el-icon :size="24" color="#fff"><Goods /></el-icon></div>
            <div><div class="stat-num" style="color:#409EFF">{{ stats.total }}</div><div class="stat-label">总商品</div></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background:#67C23A"><el-icon :size="24" color="#fff"><Sell /></el-icon></div>
            <div><div class="stat-num" style="color:#67C23A">{{ stats.onSale }}</div><div class="stat-label">已上架</div></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background:#909399"><el-icon :size="24" color="#fff"><Sold /></el-icon></div>
            <div><div class="stat-num" style="color:#909399">{{ stats.offSale }}</div><div class="stat-label">已下架</div></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background:#F56C6C"><el-icon :size="24" color="#fff"><Warning /></el-icon></div>
            <div><div class="stat-num" style="color:#F56C6C">{{ stats.lowStock }}</div><div class="stat-label">库存预警</div></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索 -->
    <el-card shadow="hover" class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.name" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="全部分类" clearable style="width:150px">
            <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable style="width:120px">
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">新增商品</el-button>
      <el-button type="success" @click="handleBatchStatus(1)" :disabled="selectedRows.length === 0">批量上架</el-button>
      <el-button type="warning" @click="handleBatchStatus(0)" :disabled="selectedRows.length === 0">批量下架</el-button>
      <el-button type="danger" @click="handleBatchDelete" :disabled="selectedRows.length === 0">批量删除</el-button>
    </div>

    <!-- 表格 -->
    <el-card shadow="hover">
      <el-table :data="pagedGoods" stripe @selection-change="handleSelectionChange" style="width:100%">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="name" label="商品名称" min-width="160">
          <template #default="{ row }">
            <div class="goods-name">
              <el-image :src="row.image" style="width:40px;height:40px;border-radius:4px" fit="cover" />
              <span class="name-text" @click="showDetail(row)">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">¥{{ row.price.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80">
          <template #default="{ row }">
            <span :style="{ color: row.stock < 10 ? '#F56C6C' : '' }">{{ row.stock }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="销量" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
            <el-button :type="row.status === 1 ? 'warning' : 'success'" size="small" link @click="toggleStatus(row)">
              {{ row.status === 1 ? '下架' : '上架' }}
            </el-button>
            <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination v-model:current-page="page" v-model:page-size="limit" :page-sizes="[10,20,50]" :total="total" layout="total, sizes, prev, pager, next, jumper" background />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="action === 'add' ? '新增商品' : '编辑商品'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="商品名称" required><el-input v-model="form.name" placeholder="请输入商品名称" /></el-form-item>
        <el-form-item label="分类" required>
          <el-select v-model="form.category" placeholder="请选择分类" style="width:100%">
            <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" required><el-input-number v-model="form.price" :min="0.01" :precision="2" :step="10" style="width:100%" /></el-form-item>
        <el-form-item label="库存" required><el-input-number v-model="form.stock" :min="0" :step="10" style="width:100%" /></el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status"><el-radio :value="1">上架</el-radio><el-radio :value="0">下架</el-radio></el-radio-group>
        </el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" :title="currentGoods?.name" width="500px">
      <div v-if="currentGoods" class="goods-detail">
        <el-image :src="currentGoods.image" style="width:100%;height:200px;border-radius:8px" fit="cover" />
        <el-descriptions :column="2" border style="margin-top:16px">
          <el-descriptions-item label="分类">{{ currentGoods.category }}</el-descriptions-item>
          <el-descriptions-item label="价格">¥{{ currentGoods.price.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="库存">{{ currentGoods.stock }}</el-descriptions-item>
          <el-descriptions-item label="销量">{{ currentGoods.sales }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentGoods.status === 1 ? 'success' : 'info'" size="small">{{ currentGoods.status === 1 ? '上架' : '下架' }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentGoods.createTime }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ currentGoods.description }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.mall-container { padding: 10px; }
.stats-row { margin-bottom: 20px; }
.stat-card { :deep(.el-card__body) { padding: 15px; } }
.stat-item { display: flex; align-items: center; gap: 15px; }
.stat-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.stat-num { font-size: 24px; font-weight: bold; }
.stat-label { font-size: 13px; color: #999; margin-top: 2px; }
.search-card { margin-bottom: 16px; }
.action-bar { margin-bottom: 16px; }
.goods-name { display: flex; align-items: center; gap: 10px; .name-text { cursor: pointer; &:hover { color: #409EFF; } } }
.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }
.goods-detail { padding: 10px; }
</style>
