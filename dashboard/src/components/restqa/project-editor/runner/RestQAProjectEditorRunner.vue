<template>
<card  :loading="loading" >
  <el-collapse-transition>
    <div class="result" v-if="result">
      <el-alert effect="dark" :closable="false" v-if="result.scenarios.failed" type="error" show-icon><template #title>{{ scenarios.length }} scenarios failed</template></el-alert>
      <el-alert effect="dark" :closable="false" v-else-if="result.scenarios.passed" type="success" show-icon><template #title>{{ result.scenarios.passed }} scenarios successfully passed</template></el-alert>
      <el-alert effect="dark" :closable="false" v-else-if="result.scenarios.skipped" type="warning" show-icon><template #title>{{ scenarios.length }} scenarios skipped</template></el-alert>
      <el-collapse v-model="activeSection">
        <el-collapse-item :name="scenario.id" v-for="(scenario, index) in scenarios" :key="index">
          <template #title>
            <span class="title" :class="scenario.status">
              <i v-if="scenario.status == 'passed'" class="header-icon el-icon-success"></i>
              <i v-else-if="scenario.status === 'failed'" class="header-icon el-icon-error"></i>
              <i v-else-if="scenario.status === 'skipped'" class="header-icon el-icon-warning"></i>
              Scenario: {{ scenario.name }}
            </span>
          </template>
          <step class="step" v-for="(step, index) in scenario.steps" :key="index" :data="step" />
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-collapse-transition>
  <el-button class="btn" @click="run()"  type="primary" round>Run the test on the {{ env }} environment</el-button>
</card>
</template>
<script>
import Card from '@/components/UI/card/Card'
import { testFeature } from '@/services/restqa/project'
import Step from './step/RestQAProjectEditorRunnerStep'

export default {
  name: 'RestQAProjectEditorRunner',
  components: {
    Card,
    Step
  },
  props: {
    file: {
      type: String,
      default: '',
      required:true
    }
  },
  data() {
    return {
      loading: false,
      result: null,
      activeSection: []
    }
  },
  computed: {
    scenarios() {
      return (this.result && this.result.features[0] && this.result.features[0].elements) || []
    },
    env () {
      return this.$store.getters.selectedEnv
    }
  },
  methods: {
    async run () {
      this.loading = true
      try {
        this.result = (await testFeature(this.file)).data
        this.activeSection = this.result.features[0].elements.filter(feat => feat.status === 'failed').map(feat => feat.id)
        this.$emit('status', {
          success: this.result.success,
          file: this.file
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style src="./RestQAProjectEditorRunner.scss" lang="scss" scoped />
