<template>
<div v-if="hasEnv">
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
      env: null
    }
  },
  computed: {
    hasEnv () {
      if (!this.env) {
        this.env = this.$store.getters.selectedEnv
      }
      return Boolean(this.$store.getters.environments.length)
    },
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
