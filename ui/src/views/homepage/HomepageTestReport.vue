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
        <performance-widget class="widget"></performance-widget>
      </el-col>
      <el-col :span="6">
        <specification-widget class="widget"></specification-widget>
      </el-col>
      <el-col :span="6">
        <collection-widget class="widget"></collection-widget>
      </el-col>
      <el-col :span="6">
        <documentation-widget class="widget"></documentation-widget>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <restqa-contributors></restqa-contributors>
      </el-col>
    </el-row>
  </el-space>
</template>

<script>
import RestqaTestResultChartFeatures from "@/components/restqa/test-result-charts/RestQATestResultChartFeatures.vue";
import RestqaProjectStatus from "@/components/restqa/project-status/RestQAProjectStatus.vue";
import RestqaContributors from "@/components/restqa/contributors/RestQAContributors.vue";
import PerformanceWidget from "@/components/restqa/performance/Widget.vue";
import SpecificationWidget from "@/components/restqa/specification/Widget.vue";
import CollectionWidget from "@/components/restqa/collection/Widget.vue";
import DocumentationWidget from "@/components/restqa/documentation/Widget.vue";

export default {
  name: "HomepageTestReport",
  components: {
    RestqaTestResultChartFeatures,
    RestqaProjectStatus,
    RestqaContributors,
    PerformanceWidget,
    SpecificationWidget,
    CollectionWidget,
    DocumentationWidget
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
.widget {
  text-align: center;
  img {
    height: 20px;
  }
}
</style>
