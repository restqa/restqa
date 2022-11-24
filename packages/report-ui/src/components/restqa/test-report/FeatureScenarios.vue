<template>
  <card :loading="loading">
    <el-collapse-transition>
      <div class="result" v-if="hasResult">
        <el-alert
          effect="dark"
          :closable="false"
          v-if="result.scenarios.failed"
          type="error"
          show-icon
          ><template #title
            >{{ result.scenarios.failed }}/{{ scenarios.length }} scenarios
            failed</template
          ></el-alert
        >
        <el-alert
          effect="dark"
          :closable="false"
          v-else-if="result.scenarios.passed"
          type="success"
          show-icon
          ><template #title
            >{{ result.scenarios.passed }}/{{ scenarios.length }} scenarios
            successfully passed</template
          ></el-alert
        >
        <el-alert
          effect="dark"
          :closable="false"
          v-else-if="result.scenarios.skipped"
          type="warning"
          show-icon
          ><template #title
            >{{ result.scenarios.skipped }}/{{ scenarios.length }} scenarios
            skipped</template
          ></el-alert
        >
        <el-collapse v-model="activeSection">
          <el-collapse-item
            :name="scenario.id"
            v-for="(scenario, index) in scenarios"
            :key="index"
          >
            <template #title>
              <span class="title" :class="scenario.status">
                <i
                  v-if="scenario.status == 'passed'"
                  class="header-icon el-icon-success"
                ></i>
                <i
                  v-else-if="scenario.status === 'failed'"
                  class="header-icon el-icon-error"
                ></i>
                <i
                  v-else-if="scenario.status === 'skipped'"
                  class="header-icon el-icon-warning"
                ></i>
                Scenario: {{ scenario.name }}
              </span>
              <el-tag
                size="default"
                v-for="(item, index) in scenario.tags"
                :key="index"
              >
                {{ item.name }}
              </el-tag>
            </template>
            <step
              class="step"
              v-for="(step, index) in scenario.steps"
              :key="index"
              :data="step"
            />
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-collapse-transition>
  </card>
</template>
<script>
import Card from "@/components/UI/card/Card.vue";
import Step from "./steps/Step.vue";

export default {
  name: "RestQAProjectEditorRunner",
  components: {
    Card,
    Step,
  },
  props: {
    data: {
      type: Object,
      default: null,
      required: false,
    },
  },
  data() {
    let result = {
      scenarios: {
        failed: 0,
        passed: 0,
        skipped: 0,
        undefined: 0,
      },
    };
    if (this.data) {
      result.scenarios.failed = this.data.failed;
      result.scenarios.passed = this.data.passed;
      result.scenarios.skipped = this.data.skipped;
      result.scenarios.undefined = this.data.undefined;
      result.features = [this.data];
    }
    return {
      loading: false,
      result,
      activeSection: [],
    };
  },
  computed: {
    scenarios() {
      return (
        (this.result &&
          this.result.features &&
          this.result.features[0] &&
          this.result.features[0].elements) ||
        []
      );
    },
    env() {
      return this.$store.getters.selectedEnv;
    },
    hasResult() {
      return true;
    },
  },
};
</script>
<style src="./FeatureScenarios.scss" lang="scss" scoped />
