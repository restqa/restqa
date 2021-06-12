<template>
  <div id="step-definition">
    <el-input placeholder="Please input" v-model="searchTerm" class="search" clear="search" clearable></el-input>
    <br />
    <br />
    <RestQAProjectSteps :keyword="keyword" :key="index" :data="steps[keyword]" v-for="(keyword, index) in keywords" />
  </div>
</template>

<script>

import RestQAProjectSteps from '@/components/restqa/project-steps/RestQAProjectSteps.vue'

const keywords = [
  'given',
  'when',
  'then'
]

export default {
  name: 'Steps',
  components: {
    RestQAProjectSteps
  },
  data() {
    return {
      list: this.$store.getters.steps,
      searchTerm: '',
      keywords
    }
  },
  computed: {
    steps () {
      const list = this.$store.getters.steps
      return {
        given: list && this.filterStep('given', list),
        when: list && this.filterStep('when', list),
        then: list && this.filterStep('then', list)
      }
    }
  },
  methods: {
    filterStep (keyword, list) {
      return list.filter((step) => {
        return step.keyword.toLowerCase() === keyword
          && (
            step.step.toLowerCase().includes(this.searchTerm.toLowerCase())
            || step.comment.toLowerCase().includes(this.searchTerm.toLowerCase())
          )
      })
    }
  },
  created() {
    this.$store.dispatch('steps')
  }
}
</script>

