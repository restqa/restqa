<template>
  <el-breadcrumb v-if="!isHomepage" class="bread" separator=">">
    <el-breadcrumb-item :to="{ name: 'homepage' }"
      >Dashboard</el-breadcrumb-item
    >
    <el-breadcrumb-item
      :key="index"
      v-for="(item, index) in list"
      to="item.router"
      >{{ item.title }}</el-breadcrumb-item
    >
  </el-breadcrumb>
  <el-alert
    v-if="false === isLatestReport"
    type="info"
    show-icon
    :closable="false"
  >
    <template #title>
      Your looking at a previous version of the report from
      <strong>{{ date }}</strong>
    </template>
  </el-alert>
</template>
<script>
export default {
  name: "HeaderPartial",
  computed: {
    result() {
      return this.$store.getters.result;
    },
    isLatestReport() {
      return this.result.isLatestReport();
    },
    date() {
      const date = new Date(this.$store.getters.result.local.timestamp);
      return date.toLocaleString("en-GB", { timeZone: "UTC" });
    },
    isHomepage() {
      return this.$router.currentRoute.value.name === "homepage";
    },
    list() {
      const result = [];
      const { meta, name, params } = this.$router.currentRoute.value;

      if (meta.parentRoute) {
        const parentRoute = this.$router
          .getRoutes()
          .find((route) => meta.parentRoute == route.name);
        result.push({
          route: { name: parentRoute.name },
          title: parentRoute.meta.title,
        });
      }

      const route = {
        title: meta.title,
      };

      if ("feature" == name) {
        route.title = this.result.local.features.find(
          (feature) => feature.id === params.id
        ).feature_name;
      }

      result.push(route);
      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
.bread {
  margin: 15px 0;
}
</style>
