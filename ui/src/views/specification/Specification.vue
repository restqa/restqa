<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ name: 'homepage' }"
        >Dashboard</el-breadcrumb-item
      >
      <el-breadcrumb-item>API Specification</el-breadcrumb-item>
    </el-breadcrumb>
    <h2><i class="el-icon-collection" /> API Specification</h2>
    <el-row :gutter="20">
      <el-col :span="24">
        <specification></specification>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Specification from "@/components/restqa/specification/Specification.vue";

export default {
  components: {
    Specification,
  },
  name: "SpecificationPage",
};
</script>
