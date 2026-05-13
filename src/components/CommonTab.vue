<template>
  <div class="tags">
    <el-tag 
        v-for="(tag,index) in tags"
        :key="tag.name"
        :closable="tag.name!== 'home'"
        :effect="route.name===tag.name?'dark':'plain'"
        @click="handleMenu(tag)"
        @close="handleClose(tag,index)"
    >
    {{tag.label}}
    </el-tag>
  </div>
</template>

<script setup>
import {useRoute,useRouter} from 'vue-router'
import {computed} from 'vue'
import {useALLDataStore} from '@/stores'

const store = useALLDataStore()
const tags = computed(() => store.state.tags)
const route = useRoute()
const router = useRouter()

const handleMenu = (tag) => {
  // 确保路径以/开头
  const path = tag.path?.startsWith('/') ? tag.path : `/${tag.path}`
  // 使用path跳转而不是name，避免路由未注册的问题
  router.push(path).catch(err => {
    // 忽略路由重复导航的错误
    if (err.name !== 'NavigationDuplicated') {
      console.warn('路由跳转失败:', err)
    }
  })
  store.selectMenu(tag)
}

const handleClose = (tag, index) => {
  // 首页不能关闭
  if (tag.name === 'home') {
    return
  }
  
  // 从store中移除标签
  store.undateTags(tag)
  
  // 如果关闭的是当前激活的标签
  if (route.name === tag.name) {
    const remainingTags = tags.value.filter(t => t.name !== tag.name)
    
    if (remainingTags.length > 0) {
      // 找到下一个可用的标签（优先选择前一个，如果没有则选择最后一个）
      let nextTag = null
      if (index > 0) {
        nextTag = remainingTags[index - 1] || remainingTags[remainingTags.length - 1]
      } else {
        nextTag = remainingTags[0] || remainingTags[remainingTags.length - 1]
      }
      
      if (nextTag) {
        store.selectMenu(nextTag)
        const nextPath = nextTag.path?.startsWith('/') ? nextTag.path : `/${nextTag.path}`
        router.push(nextPath).catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            console.warn('路由跳转失败:', err)
          }
        })
      }
    } else {
      // 如果没有其他标签，跳转到首页
      const homeTag = { name: 'home', label: '首页', path: '/home' }
      store.selectMenu(homeTag)
      router.push({ name: 'home' })
    }
  }
}
</script>

<style lang="less">
.tags{
  margin: 10px 0 0 20px;
  height: 32px;
  display: flex;
  align-items: center;
}
.el-tag{
  margin-right: 8px;
  height: 26px;
  line-height: 24px;
}
</style>