<template>
  <div>
    <h2><i class="el-icon-collection" /> API Specification</h2>
    <el-row :gutter="20">
      <el-col :span="24">
        <specification :data="result.specification"></specification>
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
  computed: {
    result() {
      return this.$store.getters.result;
    },
  },
};
</script>
