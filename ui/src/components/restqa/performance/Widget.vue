<template>
  <card title="Performance testing" emoji="🏎" class="card">
    <img
      :src="`images/logos/${config.tests.performance.tool}.png`"
      class="option-img"
    />
    <br /><br />
    <el-link type="primary" v-on:click.stop.prevent="goTo()"
      >Access to your Performance tests</el-link
    >
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card.vue";

export default {
  name: "PerformanceWidget",
  components: {
    Card,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
  },
  methods: {
    goTo() {
      this.$router.push({ name: "performance" });
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
