<template>
  <div>
    <h2><i class="el-icon-odometer" /> Performance Testing</h2>
    <el-row :gutter="20">
      <el-col :span="24" v-if="enabled === false">
        <editor :config="result.config"></editor>
      </el-col>
      <el-col :span="24" v-else>
        <performance
          :data="result.performance"
          :config="result.config"
        ></performance>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Editor from "@/components/restqa/performance/Editor.vue";
import Performance from "@/components/restqa/performance/Performance.vue";

export default {
  name: "PerformancePage",
  components: {
    Editor,
    Performance,
  },
  data() {
    return {
      performance,
    };
  },
  computed: {
    result() {
      return this.$store.getters.result;
    },
    enabled() {
      return this.result.performance.length !== 0;
    },
  },
};
</script>
