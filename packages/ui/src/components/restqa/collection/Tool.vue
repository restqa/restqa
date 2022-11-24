<template>
  <Card class="card" :title="title">
    <img :src="`images/logos/${data.name}.png`" />
    <br />
    <br />
    <el-link v-if="data.location" :href="data.location" target="_blank"
      >Download the {{ data.name }} collection</el-link
    >
  </Card>
</template>
<script>
import Card from "@/components/UI/card/Card.vue";

export default {
  name: "CollectionTool",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  components: {
    Card,
  },
  computed: {
    title() {
      const name =
        this.data.name.charAt(0).toUpperCase() + this.data.name.slice(1);
      return name + (this.data.location ? "" : " (coming soon)");
    },
  },
};
</script>
<style scoped>
.card {
  text-align: center;
  height: 300px;
}

img {
  height: 170px;
}
</style>
