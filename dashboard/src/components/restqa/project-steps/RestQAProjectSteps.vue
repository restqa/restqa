<template>
  <card :title="title" :loading="null === data">
    <div class="step-definitions" >
      <div class="step-definition" :key="index" v-for="(step, index) in data">
        <div class="plugin">{{ step.plugin }}</div>
        <div class="keyword">{{ step.keyword }}</div>
        <pre class="step" language="gherkin">{{ step.step }}</pre>
        <div class="comment">{{ step.comment }}</div>
      </div>
    </div>
  </card>
</template>

<script>
import Card from '@/components/UI/card/Card'

export default {
  name: 'RestQAProjectSteps',
  components: {
    Card
  },
  props: {
    keyword: {
      type: String
    },
    data: {
      type: Array,
      default: null
    }
  },
  computed: {
    title () {
      return `Keyword: ${ this.keyword[0].toUpperCase() + this.keyword.substring(1) }`
    }
  }
}
</script>
