<template>
  <el-tree
    default-expand-all
    :data="data"
    :props="defaultProps"
    @node-click="goTo"
  />
</template>
<script>
import docs from "@restqa/docs";

export default {
  name: "DocumentationMain",
  data() {
    return {
      defaultProps: {
        children: "items",
        label: "name",
      },
      data: docs.menu.items,
    };
  },
  methods: {
    goTo({ id }) {
      this.$router.push({
        name: "documentationPage",
        params: {
          id,
        },
      });
    },
  },
};
</script>
