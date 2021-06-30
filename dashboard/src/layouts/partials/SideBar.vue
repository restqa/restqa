<template>
<el-menu :router="true" :default-active="currentIndex" :collapse-transition="false" :collapse="isCollapse" class="menu">
  <div class="logo">
    <a href="https://restqa.io" target="_blank">
      <img src="/logo.png"/><br />
    </a>
  </div>
  <el-menu-item v-for="(item, index) in menu" :key="index" :index="String(index)" :route="{name: item.route}" :disabled="!enabled">
    <i :class="item.icon"></i>
    {{ item.label }}
  </el-menu-item>
  <el-divider />
  <el-menu-item @click="goTo(item.link)" v-for="(item, index) in staticMenu" :key="index">
    <i :class="item.icon"></i>
   {{ item.label }} 
  </el-menu-item>
</el-menu>
</template>

<script>
const menu = [{
  route: 'homepage',
  label: 'Dashboard',
  icon: 'el-icon-house',
 }, {
   route: 'editor',
   label: 'Editor',
   icon: 'el-icon-document',
 }, {
  route: 'steps',
  label: 'Step definition',
  icon: 'el-icon-collection',
}]

const staticMenu = [{
  link: 'https://docs.restqa.io',
  label: 'Documentation',
  icon: 'el-icon-reading'
},{
  link: 'https://restqa.io/chat',
  label: 'Discord',
  icon: 'el-icon-chat-dot-round'
}]

export default {
  data() {
    return {
      isCollapse: false,
      menu,
      staticMenu
    };
  },
  created() {
    this.currentIndex = String(menu.findIndex(item => item.route === this.$router.currentRoute.value.name)) || "0"
  },
  computed: {
    enabled() {
      return Boolean(this.$store.getters.config)
    }
  },
  methods:{ 
    goTo(link) {
      window.open(link, '_blank');
    }
  }
}
</script>
<style lang="scss" scoped>
.menu {
  height: 100%;
  .logo {
    text-align:center;
    img {
      width: 60px;
    }
  }
}
</style>
