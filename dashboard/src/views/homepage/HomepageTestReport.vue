<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{name: 'homepage'}"
          >Dashboard</el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-col>
  </el-row>
  <br />
  <el-space class="w100" direction="vertical">
    <el-row :gutter="20">
      <el-col :span="16">
        <restqa-test-result-chart-features
          :access-link="true"
        ></restqa-test-result-chart-features>
      </el-col>
      <el-col :span="8">
        <restqa-project-status></restqa-project-status>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!--
      <el-col :span="12">
        <card title="Integration Tests" class="ccard">
          <el-descriptions :column="1" :border="true">
            <el-descriptions-item label="Environement">Testing</el-descriptions-item>
            <el-descriptions-item label="URL">https://test.example.com</el-descriptions-item>
          </el-descriptions>
          <el-divider></el-divider>
          <el-descriptions :column="1" :border="true">
            <el-descriptions-item label="Environement">Production</el-descriptions-item>
            <el-descriptions-item label="URL">https://example.com</el-descriptions-item>
          </el-descriptions>
        </card>
      </el-col>
      -->
      <el-col :span="6">
        <performance-widget></performance-widget>
      </el-col>
      <el-col :span="6">
        <specification-widget></specification-widget>
      </el-col>
    </el-row>
    <!--
    <el-row :gutter="20">
      <el-col :span="12">
        <card title="API Specification" class="ccard">
          <img src="@/assets/images/oas3.png"/>
          <br /><br />
          <el-link type="primary">Access to your OpenAPI specification</el-link>
        </card>
      </el-col>
      <el-col :span="12">
        <card title="Postman collection" class="ccard">
          <img src="@/assets/images/postman.png"/>
          <br /><br />
          <el-link type="primary">Access to your postman collection</el-link>
        </card>
      </el-col>
    </el-row>
    -->
    <el-row :gutter="20">
      <el-col :span="24">
        <restqa-contributors></restqa-contributors>
      </el-col>
    </el-row>
  </el-space>
</template>

<script>
//import Card from "@/components/UI/card/Card";
import RestqaTestResultChartFeatures from "@/components/restqa/test-result-charts/RestQATestResultChartFeatures.vue";
import RestqaProjectStatus from "@/components/restqa/project-status/RestQAProjectStatus.vue";
import RestqaContributors from "@/components/restqa/contributors/RestQAContributors.vue";
import PerformanceWidget from "@/components/restqa/performance/Widget.vue";
import SpecificationWidget from "@/components/restqa/specification/Widget.vue";

export default {
  name: "HomepageTestReport",
  components: {
    RestqaTestResultChartFeatures,
    RestqaProjectStatus,
    RestqaContributors,
    PerformanceWidget,
    SpecificationWidget
    //Card
  },
  data() {
    return {
      testReport: this.$store.getters.testReport
    };
  },
  computed: {
    name() {
      return this.testReport.name;
    }
  }
};
</script>
<style lang="scss" scoped>
.ccard {
  text-align: center;
  height: 329px;
  img {
    height: 200px;
  }
}
</style>
