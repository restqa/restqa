<template>
  <card title="Documentation" emoji="📖" class="card">
    <img :src="`images/mascot/${key}.png`" class="option-img" />
    <br /><br />

    <el-link type="primary" v-on:click.stop.prevent="goTo()"
      >Access to the documentation</el-link
    >
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card.vue";

export default {
  name: "DocumentationWidget",
  components: {
    Card,
  },
  data() {
    return {
      key: "documentation",
    };
  },
  methods: {
    goTo() {
      const route = {
        name: "documentationPage",
        params: {
          id: "introduction",
        },
      };
      this.$router.push(route);
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
