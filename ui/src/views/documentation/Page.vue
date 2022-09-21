<template>
  <el-container>
    <el-main>
      <h1>{{ title }}</h1>
      <div v-html="content"></div>
    </el-main>
    <el-aside width="200px">
      <h4>Menu</h4>
      <el-tree
        ref="menu"
        default-expand-all
        :highlight-current="true"
        :data="data"
        :props="defaultProps"
        :expand-on-click-node="false"
        @node-click="goTo"
        node-key="id"
        icon-class="el-icon-semi-select"
      />
    </el-aside>
  </el-container>
</template>
<script>
import docs from "@restqa/docs";

export default {
  name: "DocumentationPage",
  data() {
    return {
      defaultProps: {
        children: 'items',
        label: 'name',
      },
      data: docs.menu.items,
    }
  },
  methods: {
    goTo ({ id }) {
      this.$router.push({
        name: 'documentationPage',
        params: {
          id
        }
      })
    }
  },
  computed: {
    id () {
      return this.$route.params.id
    },
    title () {
      return docs.getTitle(this.id)
    },
    content () {
      return docs.getHtml(this.id)
    }
  },
  updated () {
    this.$refs.menu.setCurrentKey(this.id)
  },
  mounted () {
    this.$refs.menu.setCurrentKey(this.id)
  }

}

</script>

