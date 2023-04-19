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
            <el-descriptions-item>
              <template #label>
                <i class="el-icon-timer blue"></i> Time
              </template>
              {{ this.feature.timestamp }}
            </el-descriptions-item>
            <el-descriptions-item label="Total scenario">{{
              this.feature.total
            }}</el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <i class="el-icon-circle-check green"></i> Passed
              </template>
              {{ this.feature.passed }}
              <el-button
                type="primary"
                style="float: right"
                @click="open('passed')"
                v-if="this.feature.passed"
                >View</el-button
              >
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <i class="el-icon-circle-close red"></i> Failed
              </template>
              {{ this.feature.failed }}
              <el-button
                type="primary"
                style="float: right"
                @click="open('failed')"
                v-if="this.feature.failed"
                >View</el-button
              >
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <i class="el-icon-warning orange"></i> Skipped
              </template>
              {{ this.feature.skipped }}
              <el-button
                link
                type="primary"
                style="float: right"
                @click="open('skipped')"
                v-if="this.feature.skipped"
                >View</el-button
              >
            </el-descriptions-item>
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
        <feature-scenarios
          :data="feature"
          :read-only="true"
          :select="select"
          ref="list"
        />
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
      select: "",
    };
  },
  methods: {
    open(type) {
      if (this.select === type) type = undefined;
      this.select = type;
    },
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

.red {
  color: red;
}

.blue {
  color: blue;
}

.orange {
  color: orange;
}

.green {
  color: green;
}
</style>
