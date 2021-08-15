<template>
  <card title="Artificial Intelligence Assistant (coming soon 🚀)" emoji="🤖">
    <div class="container">
      <div class="ai" v-for="(el, index) in list" :key="index">
        <img :src="el.img" />
        <span>{{ el.name }}</span>
        <el-button class="btn" disabled type="primary">Enable</el-button>
      </div>
    </div>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card";

export default {
  name: "RestQAProjectAI",
  components: {
    Card
  },
  data() {
    return {
      list: [
        {
          name: "Safe Scenario",
          img: require("@/assets/images/icon/shield.png")
        },
        {
          name: "Data consistency",
          img: require("@/assets/images/icon/analysis.png")
        },
        {
          name: "Open API generator",
          img: require("@/assets/images/icon/magic-wand.png")
        },
        {
          name: "Spell check",
          img: require("@/assets/images/icon/spell-check.png")
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;

  .ai {
    width: 150px;
    margin: 0 5px;
    text-align: center;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }

    img {
      width: 60%;
      margin-bottom: 5px;
    }

    span {
      width: 100%;
      display: block;
      text-align: center;
      height: 30px;
    }

    .btn {
      width: 100%;
      margin-top: 5px;
    }
  }
}
</style>
