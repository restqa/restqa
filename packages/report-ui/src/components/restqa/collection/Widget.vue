<template>
  <card title="API collection" emoji="🌒" class="card">
    <el-carousel arrow="never" :interval="4000">
      <el-carousel-item v-for="item in tools" :key="item">
        <img :src="`images/logos/${item}.png`" />
        <br />
        <br />
        <el-link type="primary" v-on:click.stop.prevent="goTo()"
          >Access to your API collections</el-link
        >
      </el-carousel-item>
    </el-carousel>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card.vue";

export default {
  name: "CollectionWidget",
  components: {
    Card,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    tools() {
      return Object.keys(this.data || {});
    },
  },
  methods: {
    goTo() {
      this.$router.push({ name: "collection" });
    },
  },
};
</script>
<style scoped>
.card {
  text-align: center;
  height: 250px;
}
img {
  height: 100px;
}
</style>
