<template>
  <div>
    <detail></detail>
    <br />
    <br />
    <h4>Download the collection</h4>
    <el-row :gutter="20">
      <el-col :key="item" v-for="item in data.tools" :span="8">
        <Tool :data="item"></Tool>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Detail from "@/components/restqa/collection/Detail.vue";
import Tool from "@/components/restqa/collection/Tool.vue";

export default {
  name: "CollectionPage",
  components: {
    Detail,
    Tool,
  },
  computed: {
    data() {
      const collection = this.$store.getters.result.collection;
      const tools = Object.entries(collection).map(([name, location]) => {
        return {
          name,
          location,
        };
      });
      return {
        tools,
      };
    },
  },
};
</script>
