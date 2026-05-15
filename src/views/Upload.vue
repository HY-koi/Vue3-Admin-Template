<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled, ZoomIn, Delete, Download } from '@element-plus/icons-vue'

const fileList = ref([])
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const activeTag = ref('all')

const tags = ['all', 'image', 'document', 'video']
const tagLabels = { all: '全部', image: '图片', document: '文档', video: '视频' }

// 模拟上传
const handleUpload = (options) => {
  const { file } = options
  const isImage = file.type.startsWith('image/')
  const isDocument = file.type.includes('pdf') || file.type.includes('doc') || file.type.includes('xls')
  const isVideo = file.type.startsWith('video/')

  let tag = 'image'
  if (isDocument) tag = 'document'
  if (isVideo) tag = 'video'

  const reader = new FileReader()
  reader.onload = (e) => {
    fileList.value.unshift({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type,
      tag,
      url: isImage ? e.target.result : '',
      uploadTime: new Date().toLocaleString(),
      status: 'success'
    })
    ElMessage.success(`${file.name} 上传成功`)
  }
  reader.readAsDataURL(file)
}

const filteredFiles = computed(() => {
  if (activeTag.value === 'all') return fileList.value
  return fileList.value.filter(f => f.tag === activeTag.value)
})

const stats = computed(() => ({
  total: fileList.value.length,
  image: fileList.value.filter(f => f.tag === 'image').length,
  document: fileList.value.filter(f => f.tag === 'document').length,
  video: fileList.value.filter(f => f.tag === 'video').length,
  totalSize: fileList.value.reduce((s, f) => s + parseFloat(f.size), 0).toFixed(1) + ' KB'
}))

const handlePreview = (file) => {
  if (file.url) {
    dialogImageUrl.value = file.url
    dialogVisible.value = true
  } else {
    ElMessage.info('该文件不支持预览')
  }
}

const handleDelete = (index) => {
  ElMessageBox.confirm('确认删除该文件？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    fileList.value.splice(index, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleBatchDelete = () => {
  ElMessageBox.confirm('确认清空所有文件？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    fileList.value = []
    ElMessage.success('清空成功')
  }).catch(() => {})
}

const handleDownload = (file) => {
  if (file.url) {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    link.click()
  } else {
    ElMessage.info('该文件不支持下载')
  }
}

const tagColor = (tag) => {
  const map = { image: '#409EFF', document: '#67C23A', video: '#E6A23C' }
  return map[tag] || '#909399'
}

// 加载示例数据
const loadDemoData = () => {
  const demoImages = [
    'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2787c4fbaa72a2d3c7jpeg.jpeg',
    'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    'https://fuss10.elemecdn.com/9/bb/e27809e3e3317db7e1f4e32fbc6fjpeg.jpeg',
    'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
    'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  ]
  demoImages.forEach((url, i) => {
    fileList.value.push({
      id: Date.now() + i,
      name: `示例图片${i + 1}.jpg`,
      size: (Math.random() * 500 + 100).toFixed(1) + ' KB',
      type: 'image/jpeg',
      tag: 'image',
      url,
      uploadTime: new Date(Date.now() - i * 86400000).toLocaleString(),
      status: 'success'
    })
  })
  ElMessage.success('已加载示例数据')
}

// 初始加载示例
loadDemoData()
</script>

<template>
  <div class="upload-container">
    <!-- 统计 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="4">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-num" style="color:#409EFF">{{ stats.total }}</div>
          <div class="stat-label">总文件</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-num" style="color:#67C23A">{{ stats.image }}</div>
          <div class="stat-label">图片</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-num" style="color:#E6A23C">{{ stats.document }}</div>
          <div class="stat-label">文档</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-num" style="color:#F56C6C">{{ stats.video }}</div>
          <div class="stat-label">视频</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-num" style="color:#909399">{{ stats.totalSize }}</div>
          <div class="stat-label">总大小</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 操作栏 -->
    <div class="action-bar">
      <el-radio-group v-model="activeTag" size="small">
        <el-radio-button v-for="tag in tags" :key="tag" :value="tag">
          {{ tagLabels[tag] }}
        </el-radio-button>
      </el-radio-group>
      <div class="action-btns">
        <el-button type="danger" size="small" @click="handleBatchDelete" :disabled="fileList.length === 0">
          清空文件
        </el-button>
        <el-button type="primary" size="small" @click="loadDemoData">
          加载示例
        </el-button>
      </div>
    </div>

    <!-- 上传区域 -->
    <el-upload
      class="upload-area"
      drag
      multiple
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleUpload"
      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.mp4,.avi"
    >
      <el-icon class="el-icon--upload" :size="50" color="#C0C4CC"><UploadFilled /></el-icon>
      <div class="el-upload__text">拖拽文件到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">支持图片、文档、视频文件，单文件不超过10MB</div>
      </template>
    </el-upload>

    <!-- 文件列表 -->
    <div class="file-grid">
      <el-card
        shadow="hover"
        class="file-card"
        v-for="(file, index) in filteredFiles"
        :key="file.id"
      >
        <div class="file-preview">
          <img v-if="file.url" :src="file.url" alt="" />
          <div v-else class="file-icon">
            <el-icon :size="40" color="#909399"><Document /></el-icon>
          </div>
          <div class="file-overlay">
            <el-icon :size="24" color="#fff" @click="handlePreview(file)"><ZoomIn /></el-icon>
            <el-icon :size="24" color="#fff" @click="handleDownload(file)"><Download /></el-icon>
            <el-icon :size="24" color="#fff" @click="handleDelete(file)"><Delete /></el-icon>
          </div>
        </div>
        <div class="file-info">
          <span class="file-name" :title="file.name">{{ file.name }}</span>
          <div class="file-meta">
            <el-tag size="small" :color="tagColor(file.tag)" effect="dark" style="border:none">
              {{ tagLabels[file.tag] }}
            </el-tag>
            <span class="file-size">{{ file.size }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <el-empty v-if="filteredFiles.length === 0" description="暂无文件，请上传" />

    <!-- 图片预览 -->
    <el-dialog v-model="dialogVisible" title="图片预览" width="600px">
      <img :src="dialogImageUrl" alt="" style="width:100%" />
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.upload-container {
  padding: 10px;
}
.stats-row {
  margin-bottom: 20px;
  .stat-card {
    text-align: center;
    :deep(.el-card__body) { padding: 12px; }
  }
  .stat-num { font-size: 24px; font-weight: bold; }
  .stat-label { font-size: 12px; color: #999; margin-top: 4px; }
}
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  .action-btns { display: flex; gap: 10px; }
}
.upload-area {
  margin-bottom: 20px;
  :deep(.el-upload-dragger) {
    width: 100%;
    padding: 30px;
  }
}
.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.file-card {
  :deep(.el-card__body) { padding: 0; }
}
.file-preview {
  position: relative;
  height: 160px;
  overflow: hidden;
  background: #f5f7fa;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .file-icon {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .file-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    opacity: 0;
    transition: opacity 0.3s;
    .el-icon { cursor: pointer; }
  }
  &:hover .file-overlay { opacity: 1; }
}
.file-info {
  padding: 10px;
  .file-name {
    display: block;
    font-size: 13px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .file-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
    .file-size { font-size: 12px; color: #999; }
  }
}
</style>
