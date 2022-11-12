<template>
  <h1>{{ title }}</h1>
  <youtube-video :url="video" />
  <div class="content" v-html="content"></div>
</template>
<script>
import docs from "@restqa/docs";
import YoutubeVideo from "./video.vue"

export default {
  name: "DocumentationRender",
  components: {
    YoutubeVideo
  },
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
    video() {
      return docs.getElement(this.page).attributes.video
    }
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
