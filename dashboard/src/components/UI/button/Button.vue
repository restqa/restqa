<template>
   <el-button type="primary"><slot></slot></el-button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    msg: String
  }
}
</script>

<style scoped></style>

