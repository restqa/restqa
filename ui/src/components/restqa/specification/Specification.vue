<template>
  <div class="swagger" id="swagger"></div>
</template>

<script>
export default {
  name: "SpecificationView",
  data() {
    const specification = this.$store.getters.projectStatus.specification;
    return {
      specification,
    };
  },
  mounted() {
    SwaggerUIBundle({
      spec: this.specification.data,
      dom_id: "#swagger",
    });
  },
};
</script>
