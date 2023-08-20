<template>
  <el-row>
    <el-container>
      <el-main class="main">
        <el-row>
          <el-col :offset="6" :span="12">
            <search-page @render="goTo"></search-page>
          </el-col>
        </el-row>
        <render-page :page="id" />
        <div v-if="isStepDefinitionPage">
          <hr />
          <h3>😀 Missing step definition?</h3>
          <p>
            Don't you can create your own step defintion in a few seconds!
            <a href="#/documentation/custom-step"
              >Check out the documentation</a
            >
          </p>
        </div>
        <br />
        <br />
        <el-row>
          <el-col :span="5">
            <small>Previous</small><br />
            <el-link
              :icon="CaretLeft"
              v-if="previous"
              type="primary"
              @click="goTo({ id: previous.id })"
              >{{ previous.title }}</el-link
            >
          </el-col>
          <el-col :span="5" :offset="14" style="text-align: right">
            <small>Next</small> <br />
            <el-link v-if="next" type="primary" @click="goTo({ id: next.id })"
              >{{ next.title }}<el-icon><CaretRight /></el-icon
            ></el-link>
          </el-col>
        </el-row>
        <el-divider />
        <br />
        <div class="support">
          <small
            >An issue in the page? Support us by
            <el-link type="primary" :href="filename" target="_blank"
              >contributing to this this page</el-link
            ></small
          >
        </div>
      </el-main>
      <el-aside class="menu" width="250px">
        <h4>Table of Content</h4>
        <el-tree
          ref="menu"
          :highlight-current="true"
          :data="data"
          :props="defaultProps"
          :expand-on-click-node="false"
          @node-click="goTo"
          node-key="id"
        />
      </el-aside>
    </el-container>
  </el-row>
</template>
<script>
import docs from "@restqa/docs";
import renderPage from "@/components/restqa/documentation/Render.vue";
import searchPage from "@/components/restqa/documentation/Search.vue";
import { CaretRight, CaretLeft } from "@element-plus/icons-vue";

export default {
  name: "DocumentationPage",
  components: {
    renderPage,
    searchPage,
    CaretRight,
  },
  setup() {
    return {
      CaretLeft,
    };
  },
  data() {
    return {
      defaultProps: {
        children: "items",
        label: "name",
      },
      data: docs.menu.items,
    };
  },
  methods: {
    goTo({ id }) {
      this.$router.push({
        name: "documentationPage",
        params: {
          id,
        },
      });
    },
  },
  computed: {
    id() {
      let id = this.$route.params.id;
      if (!docs.exists(id)) {
        id = "not-found";
      }
      return id;
    },
    filename() {
      return (
        `https://github.com/restqa/restqa/blob/master/docs/` +
        docs.getFilePath(this.id)
      );
    },
    isStepDefinitionPage() {
      return /^(given|then|when)-.+/.test(this.id);
    },
    previous() {
      return docs.getNavigation(this.id).previous.attributes;
    },
    next() {
      return docs.getNavigation(this.id).next.attributes;
    },
  },
  updated() {
    this.$refs.menu.setCurrentKey(this.id);
  },
  notFound() {
    return this.id === "not-found";
  },
  mounted() {
    this.$refs.menu.setCurrentKey(this.id);
  },
};
</script>
<style>
.el-tree-node__label {
  font-weight: bold;
  color: #606770;
}

.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content
  .el-tree-node__label {
  color: #7f00ff;
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background: #fff;
}

.main {
  padding-left: 0px;
}

.menu {
  border-left: 1px solid #dadde1;
  padding-left: 10px;
}

div.support {
  text-align: right;
}
</style>
