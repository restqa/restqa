<template>
  <div id="dashboard-analytics">
    <el-row :gutter="20">
      <el-col :span="12">
        <card title="Feature Detail" class="ccard">
          <el-descriptions :column="1" :border="true">
            <el-descriptions-item label="Tag">
              <el-tag
                size="default"
                v-for="(item, index) in this.feature.tags || []"
                :key="index"
              >
                {{ item.name }}
              </el-tag>
            </el-descriptions-item>
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
        <restqa-test-result-chart-scenarios
          :data="this.feature"
        ></restqa-test-result-chart-scenarios>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <br />
        <feature-scenarios :data="feature" :read-only="true" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RestqaTestResultChartScenarios from "@/components/restqa/test-report/charts/Scenarios.vue";
import FeatureScenarios from "@/components/restqa/test-report/FeatureScenarios.vue";
import Card from "@/components/UI/card/Card.vue";

export default {
  name: "RestQATestReportFeature",
  components: {
    RestqaTestResultChartScenarios,
    FeatureScenarios,
    Card,
  },
  data() {
    return {
      id: this.$route.params.id,
    };
  },
  computed: {
    feature() {
      return (
        this.$store.getters.result.local.features.find(
          (_) => _.id === this.id
        ) || {}
      );
    },
    name() {
      return this.feature.feature_name;
    },
    ok() {
      return Boolean(this.feature.result);
    },
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
    },
  },
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
