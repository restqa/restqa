<template>
  <card style="height: 610px" title="City" emoji="🏘">
    <Suspense>
      <PhaserContainer />
      <template #fallback>
        <div class="placeholder">Loading ...</div>
      </template>
    </Suspense>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card";
import PhaserContainer from './PhaserContainer.vue'

export default {
  name: "Game",
  components: {
    PhaserContainer,
    Card
  }
}
</script>

<style lang="scss" scoped>
.placeholder {
  font-size: 15px;
  text-align: center;
  padding-top: 80px;
}
</style>

