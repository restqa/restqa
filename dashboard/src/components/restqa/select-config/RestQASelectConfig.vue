<template>
<div>
  <label for="environments">Current environment: </label>
  <el-select class="select" id="environments"  v-model="env"  @change="update">
    <el-option class="option" v-for="(name, index) in environments" :key="index" :label="name" :value="name"></el-option>
  </el-select>
</div>
</template>
<script>
export default {
  name: 'RestQASelectConfig',
  data() {
    return {
      env:  this.$store.getters.selectedEnv
    }
  },
  computed: {
    environments () {
      return this.$store.getters.environments
    }
  },
  methods: {
    update () {
      this.$store.dispatch('selectedEnv', this.env)
    }
  }
}
</script>
<style src="./RestQASelectConfig.scss" lang="scss" scoped />
