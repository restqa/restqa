<template>
  <div>
    <el-container>
      <el-container>
        <el-header height="inherit">
          <partial-header></partial-header>
        </el-header>
        <el-main>
          <router-view v-slot="{ Component }">
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
import PartialHeader from "./partials/Header.vue";
import PartialFooter from "./partials/Footer.vue";

export default {
  name: "FullScreenLayout",
  components: {
    PartialHeader,
    PartialFooter,
  },
};
</script>

<style></style>
