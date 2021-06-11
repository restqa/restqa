<template>
   <el-avatar class="component" fit="cover" shape="circle" :size="size" :src="src"></el-avatar>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    src: {
      type: String
    },
    size: {
      type: String,
      default: 'large'
    }
  }
}

</script>

<style lang="scss">
  .component {
  }
</style>
