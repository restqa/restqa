<template>
  <card
    title="API collection"
    emoji="🌒"
    class="card"
    v-if="collection.enabled"
  >
    <el-carousel :interval="4000">
      <el-carousel-item v-for="item in tools" :key="item">
        <img :src="require(`@/assets/images/logos/${item}.png`)" />
      </el-carousel-item>
    </el-carousel>
    <el-link type="primary" v-on:click.stop.prevent="goTo()"
      >Access to your API collections</el-link
    >
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card";

export default {
  name: "CollectionWidget",
  components: {
    Card
  },
  data() {
    const collection = this.$store.getters.projectStatus.collection;
    return {
      collection,
      tools: Object.keys(collection.data)
    };
  },
  methods: {
    goTo() {
      this.$router.push({name: "collection"});
    }
  }
};
</script>
<style scoped>
.card {
  text-align: center;
}
img {
  width: 100%;
}
</style>
