<template>
  <div id="dashboard-analytics">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ name: 'homepage' }"
            >Dashboard</el-breadcrumb-item
          >
          <el-breadcrumb-item>Test Report</el-breadcrumb-item>
        </el-breadcrumb>
        <h2 :class="{ success: ok, error: !ok }">
          <i v-if="ok" class="el-icon-success success" />
          <i v-else class="el-icon-error danger" />
          {{ name }}
        </h2>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <restqa-test-result-chart-features></restqa-test-result-chart-features>
      </el-col>
      <el-col :span="12">
        <restqa-test-result-chart-scenarios></restqa-test-result-chart-scenarios>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <br />
        <restqa-test-result-list></restqa-test-result-list>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RestqaTestResultList from "@/components/restqa/test-result-list/RestQATestResultList.vue";
import RestqaTestResultChartFeatures from "@/components/restqa/test-result-charts/RestQATestResultChartFeatures.vue";
import RestqaTestResultChartScenarios from "@/components/restqa/test-result-charts/RestQATestResultChartScenarios.vue";

export default {
  name: "RestQATestReportFeatures",
  components: {
    RestqaTestResultList,
    RestqaTestResultChartFeatures,
    RestqaTestResultChartScenarios,
  },
  data() {
    return {
      testReport: this.$store.getters.testReport,
    };
  },
  computed: {
    name() {
      return this.testReport.name;
    },
    ok() {
      return Boolean(this.testReport.success);
    },
  },
};
</script>

<style scoped>
.w100,
.el-space__item {
  width: 100%;
}
h2.success {
  color: green;
}
h2.error {
  color: red;
}
</style>
