<template>
  <card title="Latest test Result (coming soon)" emoji="📈">
    <img :src="img" />
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card";

export default {
  name: "RestQAProjectResult",
  components: {
    Card
  },
  data() {
    return {
      dev: null,
      img: require("@/assets/images/preview.png")
    };
  }
};
</script>
<style scoped>
img {
  width: 100%;
  opacity: 0.5;
}

h5 {
  text-align: center;
}
</style>
