<template>
  <el-menu
    :router="true"
    :default-active="currentIndex"
    :collapse-transition="false"
    class="menu"
  >
    <div class="logo">
      <a href="https://restqa.io" target="_blank">
        <img :src="`./images/mascot.png`" />
      </a>
    </div>

    <el-menu-item
      v-for="(item, index) in menu"
      :key="index"
      :index="item.index"
      :route="{ name: item.route, params: item.params || {} }"
    >
      <el-icon>
        <component :is="item.icon"></component>
      </el-icon>
      {{ item.label }}
    </el-menu-item>

    <el-sub-menu index="100">
      <template #title>
        <el-icon><IceCreamSquare /></el-icon>
        Delicious Outputs
      </template>
      <el-menu-item
        v-for="(item, index) in subMenu"
        :key="index"
        :index="item.index"
        :route="{ name: item.route, params: item.params || {} }"
        :disabled="!item.enabled"
      >
        <el-icon>
          <component :is="item.icon"></component>
        </el-icon>
        {{ item.label }}
      </el-menu-item>
    </el-sub-menu>

    <el-divider />

    <!-- Static Menu -->
    <el-menu-item
      v-for="(item, index) in staticMenu"
      :index="String(200 + index)"
      :key="index"
      :route="item.route"
    >
      <el-icon>
        <component :is="item.icon"></component>
      </el-icon>
      {{ item.label }}
    </el-menu-item>

    <el-divider />
    <sponsors></sponsors>
  </el-menu>
</template>

<script>
import Sponsors from "@/components/restqa/sponsors/RestQASponsors.vue";
import {
  Odometer,
  Moon,
  Basketball,
  WindPower,
  Aim,
  Collection,
  IceCreamSquare,
  House,
  Reading,
  ChatDotRound,
  Message,
} from "@element-plus/icons-vue";

const staticMenu = [
  {
    link: "https://restqa.io/chat",
    label: "Documentation",
    icon: "Reading",
    route: {
      name: "documentationPage",
      params: {
        id: "introduction",
      },
    },
  },
  {
    label: "Discord",
    icon: "ChatDotRound",
    route: {
      name: "goTo",
      params: {
        link: "https://restqa.io/chat",
      },
    },
  },
  {
    label: "Share your feedback",
    icon: "Message",
    route: {
      name: "goTo",
      params: {
        link: "https://restqa.io/feedback",
      },
    },
  },
];

const menu = [
  {
    index: "1",
    route: "homepage",
    label: "Dashboard",
    icon: "House",
  },
  {
    index: "2",
    route: "features",
    label: "Test Report",
    icon: "WindPower",
  },
  {
    index: "3",
    route: "coverage",
    label: "Code Coverage",
    icon: "Aim",
  },
  {
    index: "4",
    route: "specification",
    label: "API Specification",
    icon: "Collection",
  },
];

export default {
  name: "SidebarPartial",
  components: {
    Sponsors,
    Odometer,
    Moon,
    Basketball,
    WindPower,
    Aim,
    Collection,
    IceCreamSquare,
    House,
    Reading,
    ChatDotRound,
    Message,
  },
  data() {
    return {
      menu,
      staticMenu,
    };
  },
  computed: {
    subMenu() {
      const result = this.$store.getters.result;
      return [
        {
          index: "5",
          route: "performance",
          label: "Performance testing",
          icon: "Odometer",
          enabled: Boolean(result.performance.length),
        },
        {
          index: "6",
          route: "collection",
          label: "API Collection",
          icon: "Moon",
          enabled: result.collection,
        },
        {
          index: "7",
          route: "http-mock",
          label: "HTTP mocks",
          icon: "Basketball",
          enabled: result.httpMocks,
        },
      ];
    },
    currentIndex() {
      if ("documentationPage" === this.$router.currentRoute.value.name) {
        return String(200);
      }

      const route = this.$router.currentRoute.value.name;
      const parentRoute = this.$router.currentRoute.value.meta.parentRoute;

      const item = this.menu.concat(this.subMenu).find((item) => {
        return item.route === route || item.route === parentRoute;
      });
      return (item.index && String(item.index)) || "0";
    },
  },
};
</script>
<style lang="scss" scoped>
.menu {
  height: 100%;
  border-left: 0;
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
