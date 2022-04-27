<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{name: 'homepage'}">Dashboard</el-breadcrumb-item>
    <el-breadcrumb-item>API Specification</el-breadcrumb-item>
  </el-breadcrumb>
  <div class="swagger" id="swagger"></div>
</template>

<script>
import SwaggerUI from "swagger-ui";
import "swagger-ui/dist/swagger-ui.css";

export default {
  name: "Openapi",
  mounted() {
    SwaggerUI({
      spec: window.RESTQA_OPENAPI,
      dom_id: "#swagger"
    });
  }
};
</script>
