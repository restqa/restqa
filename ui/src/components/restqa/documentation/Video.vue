<template>
  <card v-if="isVisible" title="Screencast" emoji="🍿" class="card">
    <iframe
      class="video"
      :src="`https://www.youtube.com/embed/` + id"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card.vue";

export default {
  name: "DocumentationVideo",
  components: {
    Card,
  },
  props: {
    url: {
      type: String,
      require: true,
    },
  },
  data() {
    const match = (this.url || "").match(/v=(.+)$/);
    const id = match && match[1];
    return {
      id,
    };
  },
  computed: {
    isVisible() {
      return this.url && navigator.onLine;
    },
  },
};
</script>
<style scoped>
.video {
  aspect-ratio: 16 / 9;
  width: 80%;
}
.card {
  text-align: center;
}
</style>
