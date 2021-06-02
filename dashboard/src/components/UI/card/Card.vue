<template>
  <el-card class="card" body-style="{ width: 100% }" >
    <div class="header" v-if="title">
      <h5>{{ title }}</h5>
      <span v-if="emoji">{{ emoji }}</span>
    </div>
    <div class="body" v-loading="loading">
      <slot></slot>
    </div>
  </el-card>
</template>

<script>

export default {
  name: 'card',
  components: {
  },
  props: {
    title: {
      type: String
    },
    emoji: {
      type: String
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style src="./Card.scss" lang="scss" scoped />
