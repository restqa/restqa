<template>
  <div id="dashboard-analytics">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{name: 'homepage'}"
            >Dashboard</el-breadcrumb-item
          >
          <el-breadcrumb-item :to="{name: 'features'}"
            >Test Report</el-breadcrumb-item
          >
          <el-breadcrumb-item>{{ name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h2 :class="{success: ok, error: !ok}">
          <i v-if="ok" class="el-icon-success success" />
          <i v-else class="el-icon-error danger" />
          {{ name }}
        </h2>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <card title="Feature Detail" class="ccard">
          <el-descriptions :column="1" :border="true">
            <el-descriptions-item label="Tag">Testing</el-descriptions-item>
            <el-descriptions-item label="Unique identifier">{{
              this.feature.id
            }}</el-descriptions-item>
            <el-descriptions-item label="Filename">{{
              this.feature.uri
            }}</el-descriptions-item>
            <el-descriptions-item label="Time">{{
              this.feature.timestamp
            }}</el-descriptions-item>
            <el-descriptions-item label="Total scenario">{{
              this.feature.total
            }}</el-descriptions-item>
            <el-descriptions-item label="Scenario passed">{{
              this.feature.passed
            }}</el-descriptions-item>
            <el-descriptions-item label="Scenario failed">{{
              this.feature.failed
            }}</el-descriptions-item>
            <el-descriptions-item label="Scenario skipped">{{
              this.feature.skipped
            }}</el-descriptions-item>
          </el-descriptions>
        </card>
      </el-col>
      <el-col :span="12">
        <restqa-test-result-chart-scenarios></restqa-test-result-chart-scenarios>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <br />
        <runner :data="feature" :read-only="true" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RestqaTestResultChartScenarios from "@/components/restqa/test-result-charts/RestQATestResultChartScenarios.vue";
import Runner from "@/components/restqa/project-editor/runner/RestQAProjectEditorRunner";
import Card from "@/components/UI/card/Card";

export default {
  name: "RestQATestReportFeature",
  components: {
    RestqaTestResultChartScenarios,
    Runner,
    Card
  },
  data() {
    return {
      id: this.$route.params.id,
      testReport: this.$store.getters.testReport
    };
  },
  computed: {
    feature() {
      return this.$store.getters.testReport.features.find(
        (_) => _.id === this.id
      );
    },
    name() {
      return this.feature.feature_name;
    },
    ok() {
      return Boolean(this.feature.result);
    }
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
    }
  }
};
</script>

<style>
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
