<template>
  <Card class="card" :title="title">
    <img :src="`images/logos/${data.name}.png`" />
    <br />
    <br />
    <el-link
      v-if="data.location"
      :href="getLocation(data.location)"
      target="_blank"
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
  data() {
    return {
      folder: this.$store.getters.result.folder,
    };
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
  methods: {
    getLocation(location) {
      return this.$store.getters.result.getLocation(location);
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
