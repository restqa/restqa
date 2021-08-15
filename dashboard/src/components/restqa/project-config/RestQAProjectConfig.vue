<template>
  <card
    :title="
      'Project Configuration (' + config.environment.name.toUpperCase() + ')'
    "
    emoji="🔧"
  >
    <el-descriptions :column="1" :border="true" class="config">
      <el-descriptions-item class="url" label="URL">{{
        config.environment.url
      }}</el-descriptions-item>
      <el-descriptions-item label="CODE">{{
        config.code
      }}</el-descriptions-item>
      <el-descriptions-item label="NAME">{{
        config.name
      }}</el-descriptions-item>
      <el-descriptions-item label="DESCRIPTION">{{
        config.description
      }}</el-descriptions-item>
      <el-descriptions-item label="OUTPUTS">
        <el-tag
          size="small"
          v-for="(item, index) in config.environment.outputs"
          :key="index"
          >{{ item.type }}</el-tag
        >
      </el-descriptions-item>
    </el-descriptions>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card";

export default {
  name: "RestQAProjectConfig",
  components: {
    Card
  },
  computed: {
    config() {
      const {metadata, environments} = this.$store.getters.config;

      let env = environments.find(
        (_) => _.name === this.$store.getters.selectedEnv
      );
      env = env || environments.find((_) => _.default);

      const plugin = env.plugins.find((_) => _.name.includes("restqapi"));

      return {
        ...metadata,
        environment: {
          name: env.name,
          url: plugin.config.url,
          outputs: env.outputs
        }
      };
    }
  }
};
</script>
