<template>
  <div v-if="hasArguments">
    <div :key="index" v-for="(argument, index) in data">
      <pre
        v-if="argument.content"
      ><code class="language-json">{{ argument.content }}</code></pre>
      <el-table
        :data="formatTableData"
        :border="true"
        style="width: 100%"
        v-if="argument.rows"
      >
        <el-table-column prop="key" label="Property" />
        <el-table-column prop="value" label="Value" />
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "StepTable",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasArguments() {
      return (this.data || []).length;
    },
    formatTableData() {
      return this.data[0].rows.map((row) => {
        return {
          key: row.cells[0],
          value: row.cells[1],
        };
      });
    },
  },
  watch: {
    data: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          Prism.highlightAll();
        });
      },
    },
  },
};
</script>
<style scoped>
pre {
  background: #f0f0f0;
}
</style>
