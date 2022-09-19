<template>
  <div id="dashboard-analytics">
    <el-row :gutter="20">
      <el-col :span="19">
        <restqa-project-editor></restqa-project-editor>
      </el-col>
      <el-col :span="5">
        <restqa-project-tree></restqa-project-tree>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RestqaProjectTree from "@/components/restqa/project-tree/RestQAProjectTree.vue";
import RestqaProjectEditor from "@/components/restqa/project-editor/RestQAProjectEditor.vue";

export default {
  name: "Editor",
  components: {
    RestqaProjectTree,
    RestqaProjectEditor
  },
  computed: {
    d() {
      return this.$store.getters.selectedFile;
    }
  },
  mounted() {
    this.$store.dispatch("features");
  }
};
</script>
