<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{name: 'homepage'}">Dashboard</el-breadcrumb-item>
    <el-breadcrumb-item>API Specification</el-breadcrumb-item>
  </el-breadcrumb>
  <h2><i class="el-icon-collection" /> API Specification</h2>
  <el-row :gutter="20">
    <el-col :span="24" v-if="specification.enabled === false">
      <editor></editor>
    </el-col>
    <el-col :span="24" v-else>
      <specification></specification>
    </el-col>
  </el-row>
</template>

<script>
import Editor from "@/components/restqa/specification/Editor.vue";
import Specification from "@/components/restqa/specification/Specification.vue";

export default {
  components: {
    Editor,
    Specification
  },
  name: "Openapi",
  data() {
    const specification = this.$store.getters.projectStatus.specification;
    return {
      specification
    };
  }
};
</script>
