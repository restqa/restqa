<template>
  <card title="Contributors" emoji="💪">
    <div class="label" v-if="!data.length">
      So far we could identify the list of code contributor 🤨, Are you using
      Git?
    </div>
    <div class="label" v-if="data.length">
      Find below, the key person you need to contact for more support on this
      service:
    </div>
    <div class="contrib" v-for="(contributor, index) in data" :key="index">
      <el-avatar
        :size="70"
        @error="errorHandler"
        :src="contributor.avatar + '?d=404'"
      >
        <img :src="`./images/mascot.png`" />
      </el-avatar>
      <br /><br />
      <small>{{ contributor.commits }} commits</small><br />
      <span>{{ contributor.username }}</span>
    </div>
    <el-alert
      show-icon
      v-if="busFactor"
      type="warning"
      @close="gotcha"
      close-text="Gotcha"
    >
      <template #title> Hey something grabbed my attention... </template>
      It's sounds like you have an important
      <el-link
        href="https://en.wikipedia.org/wiki/Bus_factor"
        type="primary"
        target="_blank"
        >Bus Factor</el-link
      >
      on <strong>{{ busFactor.username }}</strong> he owns more that
      <strong>{{ busFactor.percent }}%</strong> of the commits. you should watch
      it out!
    </el-alert>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card.vue";

export default {
  name: "RestQA",
  components: {
    Card,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    gotcha() {
      localStorage.setItem("contribution.busFactor", this.busFactor.username);
    },
    errorHandler() {
      return true;
    },
  },
  computed: {
    busFactor() {
      const result = this.data.filter((item) => {
        return item.percent > 50;
      });
      const knowns = localStorage.getItem("contribution.busFactor") || "";
      if (result.length === 1 && knowns !== result[0].username) {
        return result[0];
      }
      return undefined;
    },
  },
};
</script>

<style lang="scss" scoped>
.contrib {
  height: 120px;
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
.label {
  margin-bottom: 20px;
  margin-top: -10px;
  width: 100%;
}
</style>
