<template>
<div v-if="isVisible" class="steps d-flex justify-content-between align-items-center">
  <div class="flex-grow-1" >
    <div class="d-flex align-items-center flex-grow-1">
      <h5 class="mr-3 d-flex " :class="getStepTitleClass(data)">
        <span :class="`mr-2 glyphicon glyphicon-${getStepGlyphiconClass(data)}`" aria-hidden="true"></span>
        <b>{{ data.keyword }}</b>
      </h5>
      <h6 class="text-left"> {{ data.name }}</h6>
      <span class="info" v-if="data.embeddings" @click="info = !info"><i class="fa fa-plus-circle"></i> {{ info ? 'Hide' : 'Show' }} info</span>
      <span class="info" v-if="data.result.error_message"  @click="error = !error"><i class="fa fa-bug"></i> {{ error ? 'Hide' : 'Show' }} error</span>
    </div>
    <div>
      <div v-if="error" class="additional-info error">
        <h6><i class="fa fa-bug"></i> Errors:</h6>
        <pre class="step">{{ data.result.error_message }}</pre>
      </div>
      <Attachments v-if="info" :data="data.embeddings"  class="additional-info" />
      <pre class="step" v-if="data.result.status === 'undefined' && error">
// With Callbacks
{{ data.keyword }}(/^{{ data.name.replace(/"[^"]*"/g, '"\(\[\^\"\]\*\)"')}} $/, (callback) => {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending');
});
      </pre>
    </div>
  </div>
  <p>
    {{ getDurationinMs(data.result.duration) }}
  </p>
</div>
</template>

<script>
import moment from 'moment'
import Attachments from './Attachments'

export default {
  name: 'Steps',
  components: {
    Attachments
  },
  props: {
    data: { type: Object },
  },
  data () {
    return {
      info: false,
      error: this.data.result.error_message
    }
  },
  computed: {
    isVisible () {
      return this.data.embeddings || this.data.hidden !== true
    }
  },
  methods: {
    getStepGlyphiconClass (step) {
      return step.result.status === 'passed' ?
          'ok' : step.result.status === 'failed' ?
              'exclamation-sign' : step.result.status === 'skipped' ?
                  'circle-arrow-right' : step.result.status === 'undefined' ?
                      'question-sign' : ''
    },
    getStepTitleClass (step) {
      return step.result.status === 'passed' ?
          'text-success' : step.result.status === 'failed' ?
              'text-danger' : step.result.status === 'skipped' ?
                  'text-primary' : step.result.status === 'undefined' ?
                      'text-secondary' : ''
    },
    getDurationinMs (duration) {
      return !duration ? '0s' : moment.utc(duration/ 1000000).format('HH:mm:ss.SSS')
    },
  }
}
</script>

<style src="./Steps.scss" lang="scss" scoped />
