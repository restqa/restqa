<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ name: 'homepage' }"
      >Dashboard</el-breadcrumb-item
    >
    <el-breadcrumb-item>Performance Testing</el-breadcrumb-item>
  </el-breadcrumb>
  <h2><i class="el-icon-odometer" /> Performance Testing</h2>
  <el-row :gutter="20">
    <el-col :span="24" v-if="performance.enabled === false">
      <editor></editor>
    </el-col>
    <el-col :span="24" v-else>
      <performance></performance>
    </el-col>
  </el-row>
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
    const performance = this.$store.getters.projectStatus.performance;
    return {
      performance,
    };
  },
};
</script>
