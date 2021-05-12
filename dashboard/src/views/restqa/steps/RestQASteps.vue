<template>
  <div id="step-definition">
    <input type="text" v-model="searchTerm" class="search" />
    <RestQAProjectSteps :keyword="keyword" :key="index" :data="steps[keyword]" v-for="(keyword, index) in keywords" />
  </div>
</template>

<script>
import RestQAProjectSteps from '@/components/restqa/project-steps/RestQAProjectSteps.vue'
import * as Service from '@/services/restqa/project.js'

export default {
  data () {
    return {
      Service,
      list: [],
      searchTerm: '',
      keywords: [
        'given',
        'when',
        'then'
      ]
    }
  },
  components: {
    RestQAProjectSteps
  },
  computed: {
    steps () {
      return {
        given: this.filterStep('given'),
        when: this.filterStep('when'),
        then: this.filterStep('then')
      }
    }
  },
  methods: {
    filterStep (keyword) {
      return this.list.filter((step) => {
        return step.keyword.toLowerCase() === keyword
          && (
            step.step.toLowerCase().includes(this.searchTerm.toLowerCase())
            || step.comment.toLowerCase().includes(this.searchTerm.toLowerCase())
          )
      })
    }
  },
  async beforeMount () {
    this.list = await this.Service.getStepDefinition()
  }
}
</script>

<style lang="scss">
</style>

