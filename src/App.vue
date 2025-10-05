<script setup>

</script>

<template>
 <router-view></router-view>

</template>

<style>
/* 当你在Vue组件的style标签中不使用scoped属性时，定义的样式将会成为全局样式。这意味着这些样式规则将会应用到整个项目中的任何符合选择器条件的元素上。这可能会导致样式污染，即不小心影响了其他组件的样式。 */
#app{
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
