<template>
  <div class="component" v-if="show">
    <div class="loading-compo" >
      <div class="effect-1 effects"></div>
      <div class="effect-2 effects"></div>
      <div class="effect-3 effects"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style src="./Loader.css" scoped></style>
