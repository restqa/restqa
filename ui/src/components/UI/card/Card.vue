<template>
  <el-card class="card" body-style="{ width: 100% }">
    <div class="header" v-if="title">
      <h5>{{ title }}</h5>
      <el-tag v-if="tagLabel" :type="tagType">{{ tagLabel }}</el-tag>
      <span v-if="emoji">{{ emoji }}</span>
    </div>
    <div class="body" v-loading="loading">
      <slot></slot>
    </div>
  </el-card>
</template>

<script>
function tagTypeValidator(value) {
  return ["success", "info", "warning", "danger"].includes(value);
}

export default {
  name: "UiCard",
  components: {},
  props: {
    title: {
      type: String,
    },
    emoji: {
      type: String,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    tagLabel: {
      type: String,
    },
    tagType: {
      type: String,
      default: "warning",
      validator: tagTypeValidator,
    },
  },
};
</script>

<style src="./Card.scss" lang="scss" scoped />
