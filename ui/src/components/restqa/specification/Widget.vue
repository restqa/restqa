<template>
  <card
    title="API specification"
    emoji="📚"
    class="card"
    v-if="specification.enabled"
  >
    <img
      :src="`images/logos/${config.specification.tool}.png`"
      class="option-img"
    />
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
  data() {
    const specification = this.$store.getters.projectStatus.specification;
    const config = this.$store.getters.projectConfiguration;
    return {
      specification,
      config,
    };
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
