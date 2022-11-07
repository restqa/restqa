<template>
  <card
    title="Performance testing"
    emoji="🏎"
    class="card"
    v-if="performance.enabled"
  >
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
  data() {
    const performance = this.$store.getters.projectStatus.performance;
    const config = this.$store.getters.projectConfiguration;
    return {
      performance,
      config,
    };
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
