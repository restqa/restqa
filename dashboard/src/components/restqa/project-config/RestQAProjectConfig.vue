<template>
  <div>
    <span class="key">{{ config.code }}</span>
    <span class="name">{{ config.name }}</span>
    <span class="description">{{ config.description }}</span>
    <span class="env">{{ config.environment.name }}</span>
    <span class="url">{{ config.environment.url }}</span>

    <ul>
      <li class="outputs" v-for="(item, index) in config.environment.outputs" :key="index">{{ item.type }}</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'RestQAProjectConfig',
  computed: {
    config () {
      const {
        metadata,
        environments
      } = this.$store.getters.config
      let env = environments.find(_ => _.name === this.$store.getters.selectedEnv)
      env = env || environments.find(_ => _.default)
      const plugin = env.plugins.find(_ => _.name.includes('restqapi'))
      return {
        ...metadata,
        environment: {
          name: env.name,
          url: plugin.config.url,
          outputs: env.outputs
        }
      }
    }
  }
}
</script>
