<template>
  <div class="main">
    <br />
    <el-row style="">
      <el-col :span="4"></el-col>
      <el-col :span="16">
        Hand-crafted with ❤️ using
        <el-link href="https://vuejs.org/" type="success" target="_blank"
          >vuejs</el-link
        >
        and
        <el-link type="info" href="https://element.eleme.io" target="_blank"
          >element</el-link
        >
        <br />
        -
        <br />
        <span v-if="version">v{{ version }}</span>
        <el-link v-else type="primary" href="https://restqa.io"
          >Try RestQA, The Next in class microservice testing Framework</el-link
        >
      </el-col>
      <el-col :span="4">
        <div style="float: right">
          <el-switch
            v-model="isDark"
            :inactive-action-icon="sunny"
            :active-action-icon="moon"
            @change="getDark($event)"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { Moon, Sunny } from "@element-plus/icons-vue";
import { Toggle, Get } from "@/services/utils/dark-mode.js";

export default {
  name: "FooterPartial",
  data() {
    return {
      isDark: Get(),
    };
  },
  methods: {
    getDark() {
      this.isDark = Toggle();
    },
  },
  computed: {
    moon() {
      return Moon;
    },
    sunny() {
      return Sunny;
    },
    version() {
      return this.$store.getters.result.version;
    },
  },
};
</script>
<style scoped>
div.main {
  border-top: 1px solid rgb(230, 230, 230);
  text-align: center;
  font-size: 11px;
}
</style>
