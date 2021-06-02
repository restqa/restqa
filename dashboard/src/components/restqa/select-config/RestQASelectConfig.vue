<template>
<div>
  <label for="environments">Environrments: </label>
  <select id="environments"  v-model="env" @change="update">
    <option v-for="(name, index) in environments" :key="index" :value="name">{{ name }}</option>
  </select>
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
