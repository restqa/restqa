<template>
  <card title="API specification" emoji="📚" class="card">
    <img :src="`images/logos/swagger.png`" class="option-img" />
    <br /><br />
    <el-link type="primary" v-on:click.stop.prevent="goTo()"
      >Access to your API specification</el-link
    >
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card.vue";

export default {
  name: "SpecificationWidget",
  components: {
    Card,
  },
  methods: {
    goTo() {
      this.$router.push({ name: "specification" });
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
