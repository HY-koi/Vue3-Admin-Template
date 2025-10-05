<script setup>
import {ref,getCurrentInstance,onMounted,reactive} from 'vue'
import * as echarts from 'echarts'
//import axios from 'axios'
const {proxy} =getCurrentInstance()//获取当前组件实例
//console.log(proxy.$api)//访问全局属性中的api对象

const getImageUrl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href
}
const tableData = ref([])
const countData = ref([])
const chartData = ref([])
const observer = ref(null)
const tableLabel = ref({
    name: "课程",
    todayBuy: "今日购买",
    monthBuy: "本月购买",
    totalBuy: "总购买",
})

//这个是折线图和柱状图 两个图表共用的公共配置
//echarts官网
const xOptions = reactive({
      // 图例文字颜色
      textStyle: {
        color: "#333",
      },
      legend: {
        top: 'top',
      },
      grid: {
        left: "20%",
      },
      // 提示框
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category", // 类目轴
        data: [],
        axisLine: {
          lineStyle: {
            color: "#17b3a3",
          },
        },
        axisLabel: {
          interval: 0,
          color: "#333",
        },
      },
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
        },
      ],
      color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
      series: [],
})

const pieOptions = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {
    top: 'top',
  },
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: []
})

// axios({
//   url:'/api/home/getTableData',
//   // 后端接口,请求路径,请求方法
//   method:'get'
// }).then(res=>{
//   //console.log(res.data)
//   // console.log('完整响应:', res)
//   // console.log('响应数据:', res.data)
//   // console.log('数据路径:', res.data.data)
//   // console.log('表格数据:', res.data.data.tableData)
//   //假设后端返回的数据格式正确,做假数据,把交互的请求的流程,根据接口文档跑通
//   //工具:拦截住请求,返回假数据,根据接口文档来的 mock.js
//   //tableData.value = res.data.data.tableData
//   if(res.data.code===200){
//     console.log(res.data.data.tableData)
//     tableData.value=res.data.data.tableData
//   }
// })



//封装一个函数,专门用来获取表格数据
const getTableData=async()=>{
  //封装一个函数,专门用来获取表格数据
  const data =await proxy.$api.getTableData()
  tableData.value=data.tableData
}

const getCountData=async()=>{
  //封装一个函数,专门用来获取表格数据
  const data =await proxy.$api.getCountData()
  countData.value=data
}



const getChartData = async () => {
    const {orderData,userData,videoData} = await proxy.$api.getChartData()
    //对第一个图表的xAxis和series赋值
    xOptions.xAxis.data=orderData.date
    xOptions.series = Object.keys(orderData.data[0]).map(val=>({
      name:val,
      data:orderData.data.map(item=>item[val]),
      type: "line"
    })
    )
    //one               echarts.init方法初始化ECharts实例，需要传入dom对象
    const OneEcharts = echarts.init(proxy.$refs["echart"])
    //setOption方法应用配置对象
    OneEcharts.setOption(xOptions)
    
	//对第二个图表的xAxis和series赋值
    xOptions.xAxis.data = userData.map((item) => item.date)
    xOptions.series = [
        {
          name: "新增用户",
          data: userData.map((item) => item.new),
          type: "bar",
        },
        {
          name: "活跃用户",
          data: userData.map((item) => item.active),
          type: "bar",
        }
      ]
    //two
    const TwoEcharts = echarts.init(proxy.$refs["userEchart"])
    TwoEcharts.setOption(xOptions)
    
	//对第三个图表的series赋值
    pieOptions.series = [
        {
          data: videoData,
          type: "pie",
        },
      ]
    //three
    const ThreeEcharts = echarts.init(proxy.$refs["videoEchart"])
    ThreeEcharts.setOption(pieOptions);

    //ResizeObserver 如果监视的容器大小变化，如果改变会执行传递的回调
    observer.value = new ResizeObserver(entries => {
        OneEcharts.resize()
        TwoEcharts.resize()
        ThreeEcharts.resize()
    })
    //如果这个容器存在
    if (proxy.$refs["echart"]) {
        //则调用监视器的observe方法，监视这个容器的大小
      observer.value.observe(proxy.$refs["echart"]);
    }
}
onMounted(()=>{
   getTableData()
   getCountData()
   getChartData()
})

</script>

<template>
  <el-row class="home":gutter="20">
    <el-col :span="8" style="margin-top:20px">
      <el-card shadow="hover" >
        <div class="user">
          <img :src="getImageUrl('user')"class="user"/>
          <div class="user-info">
            <p class="user-info-admin">Admin</p>
            <p>超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录的时间:<span>2025-09-23</span></p>
          <p>上次登录的地点:<span>月之森</span></p>
        </div>

      </el-card>

      <el-card shadow="hover" class="user-table" >
        <el-table :data="tableData">
        <el-table-column 
          v-for="(val,key) in tableLabel"
          :key="key"
          :prop="key" 
          :label="val"
        >
        </el-table-column>>
        </el-table>

      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top:20px">
      <div class="num">
        <el-card 
        :body-style="{display: 'flex', padding: 0}"
        v-for="item in countData"
        :key="item.name"
        >
       <!-- shadow="hover" class="count-table" -->
            <component :is="item.icon" class="icons" :style="{background: item.color}" >
            </component>
            <div class="detail">
              <p class="num_text">￥{{ item.value }}</p>
              <p class="txt">￥{{ item.name }}</p>
            </div>

      </el-card>
      </div>

      <el-card class="top-echart">
         <div ref="echart" style="height:280px" ></div>
      </el-card>

      <div class="graph">
         <el-card>
          <div ref="userEchart" style="height:240px"></div>
         </el-card>
         <el-card>
          <div ref="videoEchart" style="height:240px"></div>
         </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped lang="less">
.home{
  height: 100%;
  overflow:hidden;
  .user{
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    img{
      width:150px;
      height:150px;
      border-radius: 50%;
      margin-right: 40px;
    }
    .user-info{
      p{
        line-height: 40px;
      }
      .user-info-admin{
        font-size: 35px;
        // font-weight: bold; // 增加字体加粗
        // color: #333;
      }
      .user-info-p{
        color:#999;
      }
    }
  }
  .login-info{
    p{
      font-size: 14px;
      line-height:30px;
      color: #999;
      span{
        margin-left:60px;
        color:#666;
      }
    }
  }
  .user-table{
      margin-top: 20px;
  }
  .num{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .el-card{
        width: 32%;
        margin-bottom: 20px;
      }
      .icons{
        width:80px;
        height:80px;
        font-size:30px;
        text-align: center  ;
        line-height: 80px;
        color:#fff;
      }
      .detail{
        margin-left:15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .num{
          font-size: 30px;
        margin-bottom: 10px;
        }
        .txt{
        font-size: 15px;
        text-align: center;
        color:#666;
        }
      }
  }
  .graph{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        .el-card{
          width: 48%;
          height:260px;
        }
  }
}
</style>
