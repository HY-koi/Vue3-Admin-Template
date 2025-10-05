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
import {ref,computed} from 'vue'
import {useALLDataStore} from '@/stores'
const store =useALLDataStore()
const tags =computed(()=>store.state.tags)
const route =useRoute()
const router =useRouter()

const handleMenu=(tag)=>{
  router.push(tag.name)
  store.selectMenu(tag)
}
const handleClose=(tag,index)=>{
  //关闭标签,tag是由pinia传过来的标签对象，index是标签的索引
  if(route.name!==tag.name){
    //如果关闭的标签不是当前路由，则不做任何操作
     store.undateTags(tag)//调用pinia中的方法，传入tag和index
    return
  }

  if(index === (store.state.tags.length-1)){
    //如果关闭的是最后一个标签，则跳转到前一个标签
    store.selectMenu(tags.value[index-1])
    router.push(tags.value[index-1].name)
  }else{
    //否则跳转到下一个标签
    store.selectMenu(tags.value[index])
    router.push(tags.value[index].name)
  }
   store.undateTags(tag) //调用pinia中的方法，传入tag和index
}

</script>

<style lang="less">
// .tags{
//   margin: 10px 0 0 20px;
// }
// .el-tag{
//   margin-right: 10px;
// }
.tags{
  margin: 10px 0 0 20px; /* 减少上边距 */
  height: 32px; /* 限制高度 */
  display: flex;
  align-items: center;
}
.el-tag{
  margin-right: 8px;
  height: 26px; /* 固定标签高度 */
  line-height: 24px;
}
</style>