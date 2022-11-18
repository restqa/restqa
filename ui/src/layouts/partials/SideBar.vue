<template>
  <el-menu
    :router="true"
    :default-active="currentIndex"
    :collapse-transition="false"
    :collapse="isCollapse"
    class="menu"
  >
    <div class="logo">
      <a href="https://restqa.io" target="_blank">
        <img :src="imageUrl" />
      </a>
    </div>
    <el-menu-item
      v-for="(item, index) in menu"
      :key="index"
      :index="String(index)"
      :route="{ name: item.route, params: item.params || {} }"
      :disabled="!item.enabled"
    >
      <i :class="item.icon"></i>
      {{ item.label }}
    </el-menu-item>
    <el-divider />
    <el-menu-item
      @click="goTo(item.link)"
      v-for="(item, index) in staticMenu"
      :key="index"
    >
      <i :class="item.icon"></i>
      {{ item.label }}
    </el-menu-item>
  </el-menu>
</template>

<script>
const staticMenu = [
  {
    link: "https://restqa.io/chat",
    label: "Discord",
    icon: "el-icon-chat-dot-round",
  },
  {
    link: "https://docs.restqa.io",
    label: "Share your feedback",
    icon: "el-icon-message",
  },
];

export default {
  name: "SidebarPartial",
  data() {
    const status = this.$store.getters.projectStatus;
    const menu = [
      {
        route: "homepage",
        label: "Dashboard",
        icon: "el-icon-house",
        mode: "any",
        enabled: true,
      },
      {
        route: "features",
        label: "Test Report",
        icon: "el-icon-wind-power",
        mode: "test-result",
        enabled: true,
      },
      {
        route: "coverage",
        label: "Code Coverage",
        icon: "el-icon-aim",
        mode: "test-result",
        enabled: true,
      },
      {
        route: "integration",
        label: "Integration testing",
        icon: "el-icon-guide",
        mode: "test-result",
        enabled: status.integration.enabled,
      },
      {
        route: "performance",
        label: "Performance testing",
        icon: "el-icon-odometer",
        mode: "test-result",
        enabled: status.performance.enabled,
      },
      {
        route: "specification",
        label: "API Specification",
        icon: "el-icon-collection",
        mode: "test-result",
        enabled: status.specification.enabled,
      },
      {
        route: "collection",
        label: "API Collection",
        icon: "el-icon-moon",
        mode: "test-result",
        enabled: status.collection.enabled,
      },
      {
        route: "http-mock",
        label: "HTTP mocks",
        icon: "el-icon-basketball",
        mode: "test-result",
        enabled: status.httpMocks.enabled,
      },
      {
        route: "continuous-integration",
        label: "Continuous Integration",
        icon: "el-icon-ship",
        mode: "test-result",
        enabled: false,
      },
      {
        route: "documentationPage",
        label: "Documentation",
        icon: "el-icon-reading",
        mode: "test-result",
        enabled: true,
        params: {
          id: "introduction",
        },
      },
    ];
    return {
      isCollapse: false,
      menu: menu.filter((_) => this.isShowed(_.mode)),
      staticMenu,
      imageUrl: "./images/mascot.png",
    };
  },
  computed: {
    enabled() {
      if (this.$store.getters.testReport) {
        return true;
      }
      return Boolean(this.$store.getters.config);
    },
    currentIndex() {
      const index = this.menu.findIndex((item) => {
        return (
          item.route === this.$router.currentRoute.value.name ||
          item.route === this.$router.currentRoute.value.meta.parentRoute
        );
      });
      return String(index) || "0";
    },
  },
  methods: {
    goTo(link) {
      window.open(link, "_blank");
    },
    isShowed(mode) {
      const allowed = ["any"];
      if (this.$store.getters.testReport) {
        allowed.push("test-result");
      } else {
        allowed.push("dashboard");
      }
      return allowed.includes(mode);
    },
  },
};
</script>
<style lang="scss" scoped>
.menu {
  height: 100%;
  .logo {
    text-align: center;
    img {
      width: 180px;
      border: 1px;
    }
  }
}
</style>
