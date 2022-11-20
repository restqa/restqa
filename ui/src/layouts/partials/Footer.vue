<template>
  <div>
    <br />
    Hand-crafted with ❤️ using
    <el-link href="https://vuejs.org/" type="success" target="_blank"
      >vuejs</el-link
    >
    and
    <el-link type="info" href="https://element.eleme.io" target="_blank"
      >element</el-link
    >
    <br />
    -
    <br />
    v{{ version }}
  </div>
</template>
<script>
export default {
  name: "FooterPartial",
  data() {
    return {
      version: this.$store.getters.version,
    };
  },
};
</script>
<style scoped>
div {
  border-top: 1px solid rgb(230, 230, 230);
  text-align: center;
  font-size: 11px;
}
</style>
