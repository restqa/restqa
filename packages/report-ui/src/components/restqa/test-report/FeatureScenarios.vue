<template>
  <card :loading="loading">
    <el-collapse-transition>
      <div class="result">
        <el-alert
          effect="dark"
          :closable="false"
          v-if="feature.failed"
          type="error"
          show-icon
          ><template #title
            >{{ feature.failed }}/{{ scenarios.length }} scenarios
            failed</template
          ></el-alert
        >
        <el-alert
          effect="dark"
          :closable="false"
          v-else-if="feature.passed"
          type="success"
          show-icon
          ><template #title
            >{{ feature.passed }}/{{ scenarios.length }} scenarios successfully
            passed</template
          ></el-alert
        >
        <el-alert
          effect="dark"
          :closable="false"
          v-else-if="feature.skipped"
          type="warning"
          show-icon
          ><template #title
            >{{ feature.skipped }}/{{ scenarios.length }} scenarios
            skipped</template
          ></el-alert
        >
        <el-collapse>
          <el-collapse-item
            :name="index + scenario.name"
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
    };
  },
  computed: {
    feature() {
      return this.data;
    },
    scenarios() {
      return this.feature.elements;
    },
  },
};
</script>
<style src="./FeatureScenarios.scss" lang="scss" scoped />
