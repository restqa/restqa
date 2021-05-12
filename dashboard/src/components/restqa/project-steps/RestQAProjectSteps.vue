<template>
  <vx-card :title="title" class="mt-base" slot="no-body" >
    <Loader :show="!data.length" />
    <div class="step-definitions" v-if="data.length">
      <div class="step-definition" :key="index" v-for="(step, index) in data">
        <div class="plugin">{{ step.plugin }}</div>
        <div class="keyword">{{ step.keyword }}</div>
        <prism class="step" language="gherkin">{{ step.step }}</prism>
        <div class="comment">{{ step.comment }}</div>
      </div>
    </div>
  </vx-card>
</template>

<script>
import Prism from 'vue-prism-component'
import VxCard from '../../global/vx-card/VxCard'
import Loader from '../../utils/loader/Loader'
import * as Service from '@/services/restqa/project'

export default {
  name: 'RestQAProjectSteps',
  components: {
    VxCard,
    Loader,
    Prism
  },
  props: {
    keyword: {
      type: String
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      steps: [],
      searchTerm: '',
      Service
    }
  },
  computed: {
    title () {
      return `Keyword: ${ this.keyword[0].toUpperCase() + this.keyword.substring(1) }`
    }
  }
}
</script>
