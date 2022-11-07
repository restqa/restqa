<template>
  <Card class="card" :title="title">
    <img :src="`images/logos/${name}.png`" />
    <br />
    <br />
    <el-link v-if="location" :href="location" target="_blank"
      >Download the {{ name }} collection</el-link
    >
  </Card>
</template>
<script>
import Card from "@/components/UI/card/Card.vue";

export default {
  name: "CollectionTool",
  props: {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  components: {
    Card,
  },
  method: {},
  computed: {
    title() {
      const name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
      return name + (this.location ? "" : " (coming soon)");
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
