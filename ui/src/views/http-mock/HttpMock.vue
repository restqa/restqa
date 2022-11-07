<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ name: 'homepage' }"
      >Dashboard</el-breadcrumb-item
    >
    <el-breadcrumb-item>HTTP Mocks</el-breadcrumb-item>
  </el-breadcrumb>
  <h2><i class="el-icon-basketball" /> HTTP Mocks</h2>
  <el-row :gutter="20">
    <el-col :span="24">
      <http-mock></http-mock>
    </el-col>
  </el-row>
</template>

<script>
import HttpMock from "@/components/restqa/http-mock/HttpMock.vue";

export default {
  name: "HttpMockPage",
  components: {
    HttpMock,
  },
};
</script>
