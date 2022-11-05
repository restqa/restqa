<template>
  <el-button type="primary"><slot></slot></el-button>
</template>

<script>
export default {
  name: "UiButton",
  props: {
    msg: String,
  },
};
</script>

<style scoped></style>
