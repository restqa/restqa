<template>
  <h1>{{ title }}</h1>
  <div class="content" v-html="content"></div>
</template>
<script>
import docs from "@restqa/docs";

export default {
  name: "DocumentationRender",
  props: {
    page: {
      type: String,
      required: true,
    },
  },
  computed: {
    title() {
      return docs.getTitle(this.page);
    },
    content() {
      const result = docs.getHtml(this.page);
      return result;
    },
  },
  watch: {
    content: {
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
<style lang="scss" src="./Documentation.scss" scoped></style>
