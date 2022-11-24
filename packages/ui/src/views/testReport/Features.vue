<template>
  <div id="dashboard-analytics">
    <el-row :gutter="20">
      <el-col :span="24">
        <h2 :class="{ success: ok, error: !ok }">
          <i v-if="ok" class="el-icon-success success" />
          <i v-else class="el-icon-error danger" />
          {{ testReport.name }}
        </h2>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <restqa-test-result-chart-features
          :data="testReport"
        ></restqa-test-result-chart-features>
      </el-col>
      <el-col :span="12">
        <restqa-test-result-chart-scenarios
          :data="testReport.scenarios"
        ></restqa-test-result-chart-scenarios>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <br />
        <restqa-test-result-list :data="testReport"></restqa-test-result-list>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RestqaTestResultList from "@/components/restqa/test-report/FeatureList.vue";
import RestqaTestResultChartFeatures from "@/components/restqa/test-report/charts/Features.vue";
import RestqaTestResultChartScenarios from "@/components/restqa/test-report/charts/Scenarios.vue";

export default {
  name: "RestQATestReportFeatures",
  components: {
    RestqaTestResultList,
    RestqaTestResultChartFeatures,
    RestqaTestResultChartScenarios,
  },
  computed: {
    testReport() {
      return this.$store.getters.result.local;
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
