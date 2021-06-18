<template>
  <card :title="file" :loading="loading" emoji="🚀">
    <pre>{{ content }}</pre>
  </card>
</template>

<script>
import Card from '@/components/UI/card/Card'
import * as Service from '@/services/restqa/project'

export default {
  name: 'RestQAProjectEditor',
  components: {
    Card
  },
  data() {
    return {
      loading: false,
      content: ''
    }
  },
  computed: {
    file () {
      return this.$store.getters.selectedFile
    }
  },
  methods: {
    async load (name) {
      this.loading = true
      try {
        const result = await Service.getFeatureFile(name)
        this.content = result
      } catch(e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  },
  watch: {
    file (n) {
      this.load(n)
    }
  }
}

</script>
<style src="./RestQAProjectEditor.scss" lang="scss" scoped />
