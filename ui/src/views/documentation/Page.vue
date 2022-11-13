<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ name: 'homepage' }"
      >Dashboard</el-breadcrumb-item
    >
    <el-breadcrumb-item>Documentation</el-breadcrumb-item>
  </el-breadcrumb>
  <el-container>
    <el-main class="main">
      <render-page :page="id" />
      <div v-if="isStepDefinitionPage">
        <hr />
        <h3>😀 Missing step definition?</h3>
        <p>
          Don't you can create your own step defintion in a few seconds!
          <a href="#/documentation/custom-step">Check out the documentation</a>
        </p>
      </div>
      <br />
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
      <h4>Search</h4>
      <search-page @render="goTo"></search-page>
    </el-aside>
  </el-container>
</template>
<script>
import docs from "@restqa/docs";
import renderPage from "@/components/restqa/documentation/Render.vue";
import searchPage from "@/components/restqa/documentation/Search.vue";

export default {
  name: "DocumentationPage",
  components: {
    renderPage,
    searchPage,
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
        `https://github.com/restqa/restqa/blob/master/docs/content/` +
        docs.getFilePath(this.id)
      );
    },
    isStepDefinitionPage() {
      return /^(given|then|when)-.+/.test(this.id);
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
