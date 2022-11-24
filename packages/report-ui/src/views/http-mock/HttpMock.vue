<template>
  <div>
    <h2><i class="el-icon-basketball" /> HTTP Mocks</h2>
    <el-row :gutter="20">
      <el-col :span="24">
        <http-mock :data="result"></http-mock>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import HttpMock from "@/components/restqa/http-mock/HttpMock.vue";

export default {
  name: "HttpMockPage",
  components: {
    HttpMock,
  },
  computed: {
    result() {
      return this.$store.getters.result.httpMocks;
    },
  },
};
</script>
