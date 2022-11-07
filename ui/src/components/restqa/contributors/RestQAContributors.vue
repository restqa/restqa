<template>
  <card title="Contributors" emoji="💪" v-if="contributors.data.length">
    <div
      class="contrib"
      v-for="(contributor, index) in contributors.data"
      :key="index"
    >
      <el-avatar
        :size="70"
        :src="
          contributor.avatar +
          '?d=https://restqa.io/assets/img/illustrations/UI/mascot.png'
        "
      ></el-avatar>
      <br /><br />
      <small>{{ contributor.commits }} commits</small><br />
      <span>{{ contributor.username }}</span>
    </div>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card.vue";

export default {
  name: "RestQA",
  components: {
    Card,
  },
  data() {
    const contributors = Object.assign(
      this.$store.getters.projectStatus.contributors,
      {}
    );
    return {
      contributors,
    };
  },
};
</script>

<style lang="scss" scoped>
.contrib {
  height: 140px;
  text-align: center;
  float: left;
  margin-right: 20px;

  small {
    font-size: 10px;
    font-weight: bold;
  }

  span {
    font-size: 10px;
  }
}
</style>
