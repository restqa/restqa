<template>
  <div class="layout">
    <iframe :src="url" width="100%" />
    <el-divider />
    Issues with the coverage report?
    <a href="#/documentation/coverage"
      >Check our recommendation in our documentation.</a
    >
  </div>
</template>
<script>
export default {
  name: "CoveragePage",
  computed: {
    url() {
      return this.$store.getters.result.coverage;
    },
  },
};
</script>
<style scoped>
div.layout {
  height: 100%;
}
iframe {
  border: 0px;
  height: 100%;
}
</style>
