<script setup>
import { ref, reactive, onMounted, computed, nextTick, watch } from 'vue'
import { getCurrentInstance } from 'vue'
import * as echarts from 'echarts'

const { proxy } = getCurrentInstance()

const dateRange = ref([])

// 根据日期范围过滤数据
const filteredSalesData = computed(() => {
  if (!dateRange.value || dateRange.value.length === 0) return reportData.salesData
  const startMonth = dateRange.value[0].getMonth() + 1
  const endMonth = dateRange.value[1].getMonth() + 1
  return reportData.salesData.filter(item => {
    const month = parseInt(item.month)
    return month >= startMonth && month <= endMonth
  })
})

// 模拟报表数据
const reportData = reactive({
  salesData: [
    { month: '1月', amount: 4200, orders: 120 },
    { month: '2月', amount: 3800, orders: 98 },
    { month: '3月', amount: 5100, orders: 145 },
    { month: '4月', amount: 4600, orders: 130 },
    { month: '5月', amount: 5800, orders: 168 },
    { month: '6月', amount: 6200, orders: 190 },
    { month: '7月', amount: 7100, orders: 210 },
    { month: '8月', amount: 6500, orders: 185 },
    { month: '9月', amount: 5900, orders: 160 },
    { month: '10月', amount: 6800, orders: 195 },
    { month: '11月', amount: 7500, orders: 220 },
    { month: '12月', amount: 8200, orders: 250 },
  ],
  categoryData: [
    { name: '电子产品', value: 35 },
    { name: '服装鞋帽', value: 25 },
    { name: '食品饮料', value: 20 },
    { name: '家居用品', value: 12 },
    { name: '图书文具', value: 8 },
  ],
  regionData: [
    { region: '华东', sales: 3200, growth: 12 },
    { region: '华南', sales: 2800, growth: 8 },
    { region: '华北', sales: 2600, growth: 15 },
    { region: '西南', sales: 1800, growth: 20 },
    { region: '西北', sales: 1200, growth: 5 },
    { region: '东北', sales: 1500, growth: 3 },
  ]
})

// 统计概览
const overview = computed(() => {
  const totalAmount = filteredSalesData.value.reduce((s, i) => s + i.amount, 0)
  const totalOrders = filteredSalesData.value.reduce((s, i) => s + i.orders, 0)
  const avgOrder = totalOrders > 0 ? Math.round(totalAmount / totalOrders) : 0
  return [
    { label: '总销售额', value: '¥' + totalAmount.toLocaleString(), icon: 'Money', color: '#409EFF' },
    { label: '总订单数', value: totalOrders.toLocaleString(), icon: 'ShoppingCart', color: '#67C23A' },
    { label: '平均客单价', value: '¥' + avgOrder, icon: 'TrendCharts', color: '#E6A23C' },
    { label: '同比增长', value: '18.5%', icon: 'Top', color: '#F56C6C' },
  ]
})

const initSalesChart = () => {
  const chart = echarts.init(proxy.$refs['salesChart'])
  if (!chart) return
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['销售额', '订单数'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: filteredSalesData.value.map(i => i.month) },
    yAxis: [
      { type: 'value', name: '销售额(元)', axisLabel: { formatter: '¥{value}' } },
      { type: 'value', name: '订单数' }
    ],
    series: [
      {
        name: '销售额', type: 'bar', data: filteredSalesData.value.map(i => i.amount),
        itemStyle: { color: '#409EFF', borderRadius: [4, 4, 0, 0] }
      },
      {
        name: '订单数', type: 'line', yAxisIndex: 1,
        data: filteredSalesData.value.map(i => i.orders),
        itemStyle: { color: '#67C23A' }, smooth: true
      }
    ]
  })
  return chart
}

const initCategoryChart = () => {
  const chart = echarts.init(proxy.$refs['categoryChart'])
  if (!chart) return
  chart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { top: 'bottom' },
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['50%', '45%'],
      data: reportData.categoryData,
      label: { formatter: '{b}\n{d}%' },
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } }
    }]
  })
  return chart
}

const initRegionChart = () => {
  const chart = echarts.init(proxy.$refs['regionChart'])
  if (!chart) return
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['销售额', '增长率'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: reportData.regionData.map(i => i.region) },
    yAxis: [
      { type: 'value', name: '销售额(元)' },
      { type: 'value', name: '增长率(%)', axisLabel: { formatter: '{value}%' } }
    ],
    series: [
      {
        name: '销售额', type: 'bar', data: reportData.regionData.map(i => i.sales),
        itemStyle: { color: '#5470C6', borderRadius: [4, 4, 0, 0] }
      },
      {
        name: '增长率', type: 'line', yAxisIndex: 1,
        data: reportData.regionData.map(i => i.growth),
        itemStyle: { color: '#EE6666' }, smooth: true,
        areaStyle: { color: 'rgba(238,102,102,0.15)' }
      }
    ]
  })
  return chart
}

const initRadarChart = () => {
  const chart = echarts.init(proxy.$refs['radarChart'])
  if (!chart) return
  chart.setOption({
    tooltip: {},
    radar: {
      indicator: [
        { name: '销售', max: 100 },
        { name: '管理', max: 100 },
        { name: '技术', max: 100 },
        { name: '客服', max: 100 },
        { name: '研发', max: 100 },
        { name: '市场', max: 100 }
      ]
    },
    series: [{
      type: 'radar',
      data: [
        { value: [90, 80, 75, 85, 70, 88], name: '本月', areaStyle: { color: 'rgba(64,158,255,0.2)' } },
        { value: [70, 65, 80, 70, 85, 75], name: '上月', areaStyle: { color: 'rgba(103,194,58,0.2)' } }
      ]
    }]
  })
  return chart
}

const handleExport = () => {
  // 模拟导出
  const csvContent = [
    ['月份', '销售额', '订单数'].join(','),
    ...reportData.salesData.map(i => [i.month, i.amount, i.orders].join(','))
  ].join('\n')
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '销售报表.csv'
  link.click()
  URL.revokeObjectURL(link.href)
}

let charts = []
let observer = null

// 监听日期变化重新渲染图表
watch(dateRange, () => {
  if (charts[0]) {
    charts[0].setOption({
      xAxis: { data: filteredSalesData.value.map(i => i.month) },
      series: [
        { name: '销售额', type: 'bar', data: filteredSalesData.value.map(i => i.amount), itemStyle: { color: '#409EFF', borderRadius: [4, 4, 0, 0] } },
        { name: '订单数', type: 'line', yAxisIndex: 1, data: filteredSalesData.value.map(i => i.orders), itemStyle: { color: '#67C23A' }, smooth: true }
      ]
    })
  }
})

onMounted(async () => {
  await nextTick()
  charts = [
    initSalesChart(),
    initCategoryChart(),
    initRegionChart(),
    initRadarChart()
  ].filter(Boolean)

  observer = new ResizeObserver(() => {
    charts.forEach(c => c?.resize())
  })
  const container = proxy.$refs['reportContainer']
  if (container) observer.observe(container)
})
</script>

<template>
  <div class="report-container" ref="reportContainer">
    <!-- 概览统计 -->
    <el-row :gutter="20" class="overview-row">
      <el-col :span="6" v-for="item in overview" :key="item.label">
        <el-card shadow="hover" class="overview-card">
          <div class="overview-item">
            <div class="overview-icon" :style="{ background: item.color }">
              <el-icon :size="28" color="#fff"><component :is="item.icon" /></el-icon>
            </div>
            <div class="overview-info">
              <span class="overview-value">{{ item.value }}</span>
              <span class="overview-label">{{ item.label }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 操作栏 -->
    <div class="action-bar">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="small"
      />
      <el-button type="primary" size="small" @click="handleExport">
        <el-icon><Download /></el-icon> 导出报表
      </el-button>
    </div>

    <!-- 图表区域 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="hover" class="chart-card">
          <template #header><span>销售趋势</span></template>
          <div ref="salesChart" style="height:350px"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="chart-card">
          <template #header><span>品类分布</span></template>
          <div ref="categoryChart" style="height:350px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header><span>区域分析</span></template>
          <div ref="regionChart" style="height:300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header><span>能力雷达</span></template>
          <div ref="radarChart" style="height:300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="less">
.report-container {
  padding: 10px;
}
.overview-row {
  margin-bottom: 20px;
}
.overview-card {
  :deep(.el-card__body) { padding: 15px; }
}
.overview-item {
  display: flex;
  align-items: center;
  gap: 15px;
}
.overview-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.overview-info {
  display: flex;
  flex-direction: column;
  .overview-value {
    font-size: 22px;
    font-weight: bold;
    color: #333;
  }
  .overview-label {
    font-size: 13px;
    color: #999;
    margin-top: 4px;
  }
}
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.chart-card {
  :deep(.el-card__header) {
    padding: 12px 20px;
    font-weight: bold;
    color: #333;
  }
}
</style>
