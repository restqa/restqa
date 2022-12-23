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
  <br />
  <div v-if="example">
    <el-divider> ⭐ Talk is cheap, show me code! ⭐ </el-divider>
    <br />
    <el-button @click="goExample()" type="primary" style="width: 100%">
      Click here to look at the demo of this feature
    </el-button>
    <br />
    <el-divider />
  </div>
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
    example() {
      return docs.getElement(this.page).attributes.example;
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
    goExample() {
      const link = `https://github.com/restqa/restqa/tree/master/examples/${this.example}`;
      window.open(link, "_blank");
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
