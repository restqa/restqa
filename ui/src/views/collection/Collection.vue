<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{name: 'homepage'}">Dashboard</el-breadcrumb-item>
    <el-breadcrumb-item>API Collection</el-breadcrumb-item>
  </el-breadcrumb>

  <br />
  <detail></detail>
  <br />
  <br />
  <h4>Download the collection</h4>
  <el-row :gutter="20">
    <el-col :key="item" v-for="item in tools" :span="8">
      <Tool :name="item.name" :location="item.location"></Tool>
    </el-col>
  </el-row>

<!--
  <h4>Tutorial</h4>

  <iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/NpEaa2P7qZI"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
-->
</template>
<script>
import Detail from "@/components/restqa/collection/Detail.vue";
import Tool from "@/components/restqa/collection/Tool.vue";

export default {
  name: "Collection",
  components: {
    Detail,
    Tool
  },
  data() {
    const collection = this.$store.getters.projectStatus.collection.data;
    const tools = Object.entries(collection).map(([name, location]) => {
      return {
        name,
        location
      };
    });
    return {
      tools
    };
  }
};
</script>
