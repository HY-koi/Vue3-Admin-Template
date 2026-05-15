<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { useALLDataStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const loginForm = reactive({
  username:'',
  password:''
})
const {proxy} =getCurrentInstance()//获取当前组件实例
const store = useALLDataStore()
const router =useRouter()
const handleLogin= async()=>{
  try {
    const res=await proxy.$api.getMenu(loginForm)
    // console.log('登录响应:', res)
    
    if(res && res.menuList) {
      // 确保数据正确传递
      const menuList = res.menuList || []
      const token = res.token || ""
      
      // 保存到store
      store.updateMenuList(menuList)
      store.state.token = token
      
      // 添加路由并跳转
      store.addMenu(router)
      router.push('/home')
    } else {
      // 显示错误信息
      ElMessage.error(res?.message || '登录失败，请检查用户名和密码')
    }
  } catch (error) {
    ElMessage.error(typeof error === 'string' ? error : '登录失败，请检查用户名和密码')
  }
}
// const handleLogin = async () => {
//   try {
//     console.log('🔍 开始登录，表单数据:', loginForm)
    
//     const res = await proxy.$api.getMenu(loginForm)
//     console.log('🔍 完整API响应:', res)
//     console.log('🔍 响应code:', res.code)
//     console.log('🔍 data数据:', res.data)
//     console.log('🔍 menuList数据:', res.data?.menuList)
//     console.log('🔍 menuList类型:', typeof res.data?.menuList)
//     console.log('🔍 menuList是数组:', Array.isArray(res.data?.menuList))
    
//     if (res.code === 200) {
//       console.log('✅ 登录成功，准备保存数据到store')
      
//       // 检查store方法是否存在
//       console.log('🔍 store.updateMenuList方法:', typeof store.updateMenuList)
//       console.log('🔍 保存前的store.menuList:', store.state.menuList)
      
//       // 保存数据
//       store.updateMenuList(res.data.menuList)
//       store.state.token = res.data.token
      
//       // 立即检查保存结果
//       console.log('🔍 保存后的store.menuList:', store.state.menuList)
//       console.log('🔍 保存后的store.token:', store.state.token)
      
//       console.log('🚀 准备跳转到首页')
//       router.push('/home')
//     } else {
//       console.error('❌ 登录失败:', res.data?.message)
//     }
//   } catch (error) {
//     console.error('💥 登录异常:', error)
//   }
// }
</script>

<template>
  <div class="body-login">
    <el-form :model="loginForm" class="login-container">
      <h1>欢迎登录</h1>
      <el-form-item>
        <el-input type="input" v-model="loginForm.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
       <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="less">
.body-login{
  width: 100%;
  height: 100%;
  background-image: url('../assets/images/background.png') ;
  background-size: 100%;
  overflow: hidden;
}
.login-container{
  width: 400px;
  padding: 35px 15px 35px;
  box-shadow: 0 0 25px #cacaca;
  border:1px solid #eaeaea;
  border-radius:15px;
  background-color: #fff;
  margin:250px auto;
  h1{
  text-align: center;
  margin-bottom: 20px;
  color:#505450;
  }
  :deep(.el-form-item__content){
    justify-content:center;
  }
}
</style>
