<template>
  <div class="layout">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ name: 'homepage' }"
        >Dashboard</el-breadcrumb-item
      >
      <el-breadcrumb-item>Code Coverage</el-breadcrumb-item>
    </el-breadcrumb>
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
  components: {},
  data() {
    const url = this.$store.getters.projectStatus.coverage.data;
    return {
      url,
    };
  },
  mounted() {},
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
