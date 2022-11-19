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
      v-for="(item, index) in isNotOutput"
      :key="index"
      :index="String(item.index)"
      :route="{ name: item.route, params: item.params || {} }"
      :disabled="!item.enabled"
    >
      <i :class="item.icon"></i>
      {{ item.label }}
    </el-menu-item>

    <el-sub-menu index="100">
     <template #title>
       <i class="el-icon-ice-cream-square"></i> Delicious Outputs
     </template>
     <el-menu-item
       v-for="(item, index) in isOutput"
       :key="index"
       :index="String(item.index)"
       :route="{ name: item.route, params: item.params || {} }"
       :disabled="!item.enabled"
     >
       <i :class="item.icon"></i>
       {{ item.label }}
     </el-menu-item>
    </el-sub-menu>

    <el-menu-item index="200" :route="{ name: 'documentationPage', params: { id: 'introduction'} }">
      <i class="el-icon-reading"></i>
      Documentation
    </el-menu-item>

    <el-divider />

    <el-menu-item
      v-for="(item, index) in staticMenu"
      :key="index"
      :route="{ name: 'goTo', params: { link: item.link } }"
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
        index:1,
        route: "homepage",
        label: "Dashboard",
        icon: "el-icon-house",
        enabled: true,
        isOutput: false,
      },
      {
        index:2,
        route: "features",
        label: "Test Report",
        icon: "el-icon-wind-power",
        enabled: true,
        isOutput: false,
      },
      {
        index:3,
        route: "coverage",
        label: "Code Coverage",
        icon: "el-icon-aim",
        enabled: true,
        isOutput: false,
      },
      {
        index:4,
        route: "specification",
        label: "API Specification",
        icon: "el-icon-collection",
        enabled: status.specification.enabled,
        isOutput: false,
      },
      {
        index:5,
        route: "integration-testing",
        label: "Integration testing",
        icon: "el-icon-guide",
        enabled: status.integration.enabled,
        isOutput: true,
      },
      {
        index:6,
        route: "performance",
        label: "Performance testing",
        icon: "el-icon-odometer",
        enabled: status.performance.enabled,
        isOutput: true,
      },
      {
        index:7,
        route: "collection",
        label: "API Collection",
        icon: "el-icon-moon",
        enabled: status.collection.enabled,
        isOutput: true,
      },
      {
        index:8,
        route: "http-mock",
        label: "HTTP mocks",
        icon: "el-icon-basketball",
        enabled: status.httpMocks.enabled,
        isOutput: true,
      },
      {
        index:9,
        route: "continuous-integration",
        label: "Continuous Integration",
        icon: "el-icon-ship",
        enabled: false,
        isOutput: true,
      },
    ];
    return {
      isCollapse: false,
      menu: menu,
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
      if ('documentationPage' === this.$router.currentRoute.value.name) return String(200)
      const item = this.menu.find((item) => {
        return (
          item.route === this.$router.currentRoute.value.name ||
          item.route === this.$router.currentRoute.value.meta.parentRoute
        );
      });
      return item.index && String(item.index) || "0";
    },
    isOutput () {
      return this.menu.filter(item => item.isOutput === true)
    },
    isNotOutput () {
      return this.menu.filter(item => item.isOutput === false)
    }
  }
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
      animation: float 6s ease-in-out infinite;
    }
  }
}
.el-icon-ice-cream-square {
  margin-right: 8px;
  margin-left: 5px;
}

@keyframes float {
	0% {
		transform: translatey(0px);
	}
	50% {
		transform: translatey(-20px);
	}
	100% {
		transform: translatey(0px);
	}
}
</style>
