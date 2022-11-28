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
    <span v-if="version">v{{ version }}</span>
    <el-link type="primary" href="https://restqa.io"
      >Try RestQA, The Next in class microservice testing Framework</el-link
    >
  </div>
</template>
<script>
export default {
  name: "FooterPartial",
  computed: {
    version() {
      return this.$store.getters.result.version;
    },
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
