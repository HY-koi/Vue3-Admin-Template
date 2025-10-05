<script setup>
import {ref,getCurrentInstance,onMounted,reactive,nextTick} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import { act } from 'react'

const tableData = ref([])
const {proxy} =getCurrentInstance()
//获取当前组件实例
const getUserData= async()=>{
    let data = await proxy.$api.getUserData(config)
    //  console.log(data)
    tableData.value=data.list.map(item=>({
        ...item,
        sexLabel :item.sex === '1' ?'男':'女'
      })) 
    config.total= data.count    
}

// const getUserData = async() => {
//   try {
//     const response = await proxy.$api.getUserData({
//       name: config.name,
//       page: config.page,
//       limit: config.limit
//     })
    
//     console.log('📊 完整响应数据:', response)
    
//     // 调试：检查数据结构
//     console.log('🔍 数据检查:')
//     console.log('- response 类型:', typeof response)
//     console.log('- response 内容:', response)
//     console.log('- 是否有 list:', !!response?.list)
//     console.log('- 是否有 data:', !!response?.data)
//     console.log('- 是否有 code:', response?.code)
    
//     // 安全地处理数据
//     let listData = response
    
//     // 如果响应包含 code 和 data 字段
//     if (response && response.code === 200 && response.data) {
//       listData = response.data
//     }
    
//     // 如果响应直接包含 list 字段
//     if (listData && listData.list && Array.isArray(listData.list)) {
//       tableData.value = listData.list.map(item => ({
//         ...item,
//         sexLabel: item.sex === 1 ? '男' : '女'
//       })) 
//       config.total = listData.count || 0
//       console.log('✅ 数据加载成功，共', tableData.value.length, '条记录')
//     } else {
//       console.error('❌ 数据格式不正确:', listData)
//       ElMessage.error('数据格式错误')
//     }
    
//   } catch (error) {
//     console.error('💥 请求失败:', error)
//     ElMessage.error('数据加载失败')
//   }
// }

const tableLabel=reactive([
  {
    prop:'name',
    label:'姓名',
  },
  {
    prop:'age',
    label:'年龄',
  },
  {
    prop:'sexLabel',
    label:'性别',
  },
  {
    prop:'birth',
    label:'出生日期',
    width:200,
  },
  {
    prop:'addr',
    label:'地址',
    width:400,
  },
])
const formInline =reactive({
  keyWord:''
})
const config =reactive({
  name:'',
  total:0,
  page:1,
  // limit: 10  // ✅ 添加每页条数
})
const handleSearch=()=>{
  config.name=formInline.keyWord
  getUserData()
}
const handleChange=(page)=>{
  config.page=page
  getUserData()
}
const handleDelete=async(row)=>{
  // console.log(row)前端基本操作
  ElMessageBox.confirm('你确认删除吗?').then(async()=>{
    await proxy.$api.deleteUser({id:row.id})//这是向后端发送 HTTP 请求，执行真实的删除操作
    ElMessage ({
      showClose:true,
      message:'删除成功',
      type:'success'
    })
    getUserData()
    // deleteRow(row)
  })
}
const action=ref('add')//新增还是编辑
const dialogVisible=ref(false)
const formUser=reactive({
  sex:'1'//默认值
})
const rules = reactive({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [
    { required: true, message: "年龄是必填项", trigger: "blur" },
    { type: "number", message: "年龄必须是数字" },
  ],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  birth: [{ required: true, message: "出生日期是必选项" }],
  addr:[{ required: true, message: '地址是必填项' }]
})
const handleClose=()=>{
  //获取表单重置表单
  //点击右上角关闭按钮
  dialogVisible.value=false;
  proxy.$refs['userForm'].resetFields()
}
const handleCancel=()=>{
  //点击取消按钮
  dialogVisible.value=false
  proxy.$refs['userForm'].resetFields()
}
const handleAdd=()=>{
  //点击新增按钮
  action.value='add'
  dialogVisible.value=true
  //清空表单
  // Object.keys(formUser).forEach(key=>{
  //   formUser[key]=''
  // })
}
const timeFormat = (time)=>{
  var time = new Date(time);
  var year = time.getFullYear();
  var month =(time.getMonth() + 1).toString().padStart(2, '0');
  var date =(time.getDate()).toString().padStart(2, '0');
  return `${year}-${month}-${date}`;
}
const onSubmit=()=>{
  //点击确定按钮
  // console.log('提交表单',formUser)
  //验证表单
  proxy.$refs['userForm'].validate(async (valid)=>{
    if(valid){
      // console.log('验证通过')
      let res =null;
      formUser.birth=/^\d{4}-\d{2}-\d{2}$/.test(formUser.birth)?formUser.birth
      :timeFormat(formUser.birth)
      if(action.value==='add')
      {//新增
        // console.log(formUser)
        res= proxy.$api.addUser(formUser)
      }else{
        res= proxy.$api.editUser(formUser)
        //编辑
      }
      if(res){
        dialogVisible.value=false
        proxy.$refs['userForm'].resetFields()
        //清空表单
        getUserData()
        //重新获取数据
      }
    } else{
        ElMessage({
          showClose:true,
          message:'表单填写有误',
          type:'error'
        })
      }
    
  })
}
const handleEdit=(val)=>{
  //点击编辑按钮
  action.value='edit'
  dialogVisible.value=true
  // console.log(row)
  // Object.assign(formUser,{...val,sex:''+val.sex})

  nextTick(()=>{
    Object.assign(formUser,{...val,sex:''+val.sex})
  })
}
  //表单回显

onMounted(()=>{
  // testApiConnection()
  getUserData()
})
</script>

<template>
  <div class="user-header">
    <el-button type="primary" @click="handleAdd">新增</el-button>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="请输入">
        <el-input placeholder="请输入用户名" v-model="formInline.keyWord"></el-input>
      </el-form-item>
      <el-form-item >
         <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>

  <div class="table">
   <el-table :data="tableData" style="width: 100%">
      <el-table-column
      v-for="item in tableLabel"
      :key= 'item.prop'
      :width="item.width?item.width:125"
      :prop="item.prop"
      :label="item.label"
    />
      <el-table-column fixed="right" label="Operations" min-width="120">
        <template #="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
  </el-table>
   <el-pagination 
      background 
      layout="prev, pager, next"
      size="small"
      :total="config.total"
      @current-change="handleChange"
      class="pager"
    />
  </div>

  <el-dialog
    v-model="dialogVisible"
    :title="action == 'add' ? '新增用户' : '编辑用户'"
    width="35%"
    :before-close="handleClose"
  >
        <!--需要注意的是设置了:inline="true"，
      会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
      在css进行处理-->
      <el-form :inline="true"  :model="formUser" :rules="rules" ref="userForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formUser.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="select-clearn" label="性别" prop="sex">
              <el-select  v-model="formUser.sex" placeholder="请选择">
                <el-option label="男" value="1" />
                <el-option label="女" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birth">
              <el-date-picker
                v-model="formUser.birth"
                type="date"
                placeholder="请输入"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item
            label="地址"
            prop="addr"
          >
            <el-input v-model="formUser.addr" placeholder="请输入地址" />
          </el-form-item>
        </el-row>
        <el-row style="justify-content: flex-end">
          <el-form-item>
            <el-button type="primary" @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-row>
      </el-form>
  </el-dialog>


</template>

<style scoped lang="less">
.user-header{
  display:flex;
  justify-content: space-between;
}
.table{
  position: relative;
  height: 520px;
  .pager{
    position: absolute;
    right: 10px;
    bottom: 30px;
  }
  .el-table{
    height:500px;
    width:100%;
  }
}
.select-clearn{
  display:flex;
}
</style>
