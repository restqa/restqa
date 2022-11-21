<template>
  <div>
    <el-space class="w100" direction="vertical">
      <el-row :gutter="20">
        <el-col :span="16">
          <restqa-test-result-chart-features
            class="top"
            :access-link="true"
            :data="result.local"
          ></restqa-test-result-chart-features>
        </el-col>
        <el-col :span="8">
          <history-widget :data="result" class="top"></history-widget>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" v-if="hasPerformance">
          <performance-widget
            :data="result.performance"
            :config="result.config"
            class="widget"
          ></performance-widget>
        </el-col>
        <el-col :span="6" v-if="hasSpecification">
          <specification-widget class="widget"></specification-widget>
        </el-col>
        <el-col :span="6" v-if="hasCollection">
          <collection-widget
            :data="result.collection"
            class="widget"
          ></collection-widget>
        </el-col>
        <el-col :span="6">
          <documentation-widget class="widget"></documentation-widget>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <restqa-contributors
            :data="result.contributors"
          ></restqa-contributors>
        </el-col>
      </el-row>
    </el-space>
  </div>
</template>

<script>
import RestqaTestResultChartFeatures from "@/components/restqa/test-report/charts/Features.vue";
import RestqaContributors from "@/components/restqa/contributors/RestQAContributors.vue";
import PerformanceWidget from "@/components/restqa/performance/Widget.vue";
import SpecificationWidget from "@/components/restqa/specification/Widget.vue";
import CollectionWidget from "@/components/restqa/collection/Widget.vue";
import DocumentationWidget from "@/components/restqa/documentation/Widget.vue";
import HistoryWidget from "@/components/restqa/history/Widget.vue";

export default {
  name: "HomepageTestReport",
  components: {
    RestqaTestResultChartFeatures,
    RestqaContributors,
    PerformanceWidget,
    SpecificationWidget,
    CollectionWidget,
    DocumentationWidget,
    HistoryWidget,
  },
  computed: {
    result() {
      return this.$store.getters.result;
    },
    hasPerformance() {
      return Boolean(this.result.performance.length);
    },
    hasCollection() {
      return Boolean(this.result.collection);
    },
    hasSpecification() {
      return Boolean(this.result.specification);
    },
  },
};
</script>
<style lang="scss" scoped>
.top {
  height: 400px;
}
</style>
