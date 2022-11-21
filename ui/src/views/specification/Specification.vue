<template>
  <div>
    <el-row :gutter="20">
      <p>
        We did some analysis on the transaction request and response from your
        microservice. Then we were able to generate the apis specification
        below.<br />

        If you feel that some information are missing... It simply means that
        your test scenario are not covering all of the expected use cases 😀.
      </p>
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

<style scoped>
p {
  margin-left: 30px;
}
</style>
