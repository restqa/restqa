<template>
  <card title="Explorer" >
    <el-tree  @node-click="selectFile" :default-expand-all="true" :data="features">
    </el-tree>
  </card>
</template>

<script>
import Card from '@/components/UI/card/Card'

export default {
  name: 'RestQAProjectTree',
  components: {
    Card
  },
  computed: {
    features () {
      return this.$store.getters.features
    }
  },
  methods: {
    selectFile (val) {
      this.$store.dispatch('selectedFile', val)
    }
  }
}
</script>
