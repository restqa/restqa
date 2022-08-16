<template>
  <div>
    <el-container>
      <el-aside width="inherit">
        <partial-side-bar></partial-side-bar>
      </el-aside>
      <el-container>
        <!--
        <el-header height="inherit">
          <partial-header></partial-header>
        </el-header>
        -->
        <el-main>
          <router-view v-slot="{Component}">
            <transition>
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </el-main>
        <el-footer>
          <partial-footer></partial-footer>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import PartialHeader from "./partials/Header";
import PartialSideBar from "./partials/SideBar";
import PartialFooter from "./partials/Footer";
import { EVENTS } from "../events/restqa.js";

export default {
  name: "Dashboard",
  components: {
    PartialHeader,
    PartialSideBar,
    PartialFooter
  },
  mounted () {
    window.addEventListener(EVENTS.GO, (e) => {
      this.$router.push(e.route)
    })
  },
};
</script>

<style></style>
