<template>
  <h1>{{ title }}</h1>
  <div v-if="hasPreRequisit">
    <h2></h2>
    <el-collapse>
      <el-collapse-item name="1">
        <template #title>
          ℹ️ Click here to access the prerequisites document you must read.
        </template>
        <ul>
          <li :key="index" v-for="(id, index) in preRequisit">
            <el-link @click="goTo(id)" type="primary">{{
              getTitle(id)
            }}</el-link>
          </li>
        </ul>
      </el-collapse-item>
    </el-collapse>
  </div>
  <youtube-video :url="video" />
  <div class="content" v-html="content"></div>
</template>
<script>
import docs from "@restqa/docs";
import YoutubeVideo from "./Video.vue";

export default {
  name: "DocumentationRender",
  components: {
    YoutubeVideo,
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
      return docs.getElement(this.page).attributes.video;
    },
    hasPreRequisit() {
      return (
        docs.getElement(this.page).attributes["pre-requisit"] !== undefined
      );
    },
    preRequisit() {
      return docs.getElement(this.page).attributes["pre-requisit"];
    },
  },
  methods: {
    getTitle(id) {
      return docs.getTitle(id);
    },
    goTo(id) {
      this.$router.push({
        name: "documentationPage",
        params: {
          id,
        },
      });
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
