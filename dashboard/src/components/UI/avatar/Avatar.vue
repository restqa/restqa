<template>
  <img :src="src" :class="size" />
</template>

<script>
export default {
  name: "Avatar",
  props: {
    src: {
      type: String
    },
    size: {
      type: String,
      default: "large"
    }
  }
};
</script>

<style lang="scss" scoped>
img {
  border-radius: 50%;

  &.large {
    width: 60px;
    height: 60px;
  }
}
</style>
