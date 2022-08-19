<template>
  <div class="swagger" id="swagger"></div>
</template>

<script>
import SwaggerUI from "swagger-ui";
import "swagger-ui/dist/swagger-ui.css";

export default {
  name: "Specification",
  data() {
    const specification = this.$store.getters.projectStatus.specification;
    return {
      specification
    };
  },
  mounted() {
    SwaggerUI({
      spec: this.specification.data,
      dom_id: "#swagger"
    });
  }
};
</script>
