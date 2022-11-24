<template>
  <div class="sidebar-wrapper">
    <nav
        :class="{sidebar: true, sidebarStatic, sidebarOpened}"
        @mouseenter="sidebarMouseEnter"
        @mouseleave="sidebarMouseLeave"
    >
      <header class="logo">
        <router-link to="/"><span class="primary-word"><img :src="logo" width="50" /></span></router-link>
      </header>
      <ul class="nav">
        <NavLink
            :activeItem="activeItem"
            header="Dashboard"
            link="/"
            iconName="flaticon-home"
            index="dashboard"
            isHeader
        />
        <NavLink
            :activeItem="activeItem"
            header="Features"
            iconName="flaticon-network"
            index="components"
            v-bind:childrenLinks="featuresChild"
        />
      </ul>
      <h5 class="navTitle">
        Documentation
      </h5>
      <ul class="sidebarLabels">
        <li>
          <a href="https://docs.restqa.io" target="_blank">
            <i class="fa fa-heart text-danger"/>
            <span class="labelName">RestQA docs</span>
          </a>
        </li>
        <li>
          <a href="https://github.com/restqa/restqa" target="_blank">
            <i class="fa fa-github text-primary"/>
            <span class="labelName">Github project</span>
          </a>
        </li>
        <li>
          <a href="https://medium.com/restqa" target="_blank">
            <i class="fa fa-medium text-primary"/>
            <span class="labelName">Blog Article</span>
          </a>
        </li>
        <li>
          <a href="https://discord.gg/q8pKfsyq67" target="_blank">
            <i class="fa fa-circle text-primary"/>
            <span class="labelName">Discord</span>
          </a>
        </li>
      </ul>
      <h5 class="navTitle">
        Social Media
      </h5>
      <ul class="sidebarLabels">
        <li>
          <a href="https://twitter.com/restqa" target="_blank">
            <i class="fa fa-twitter text-success"/>
            <span class="labelName">Twitter</span>
          </a>
        </li>
        <li>
          <a href="https://linkedin.com/company/restqa" target="_blank">
            <i class="fa fa-linkedin text-success"/>
            <span class="labelName">Linkedin</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import isScreen from '@/core/screenHelper';
import NavLink from './NavLink/NavLink';
import logo from '../../assets/logo.png';

export default {
  name: 'Sidebar',
  components: { NavLink },
  data() {
    return {
      logo,
      featuresChild: this.getResult().features.map(feature => {
        return {
          header: feature.feature_name,
          iconName: feature.result ? 'glyphicon-ok-sign' : 'glyphicon-remove-sign',
          link: this.$router.resolve({ 
            name: 'FeaturePage',
            params: { id: feature.id}
          }).resolved.fullPath
        }
      })
    };
  },
  methods: {
    ...mapActions('layout', ['changeSidebarActive', 'switchSidebar']),
    setActiveByRoute() {
      const paths = this.$route.fullPath.split('/');
      paths.pop();
      this.changeSidebarActive(paths.join('/'));
    },
    sidebarMouseEnter() {
      if (!this.sidebarStatic && (isScreen('lg') || isScreen('xl'))) {
        this.switchSidebar(false);
        this.setActiveByRoute();
      }
    },
    sidebarMouseLeave() {
      if (!this.sidebarStatic && (isScreen('lg') || isScreen('xl'))) {
        this.switchSidebar(true);
        this.changeSidebarActive(null);
      }
    },
  },
  created() {
    this.setActiveByRoute();
  },
  computed: {
    ...mapState('layout', {
      sidebarStatic: state => state.sidebarStatic,
      sidebarOpened: state => !state.sidebarClose,
      activeItem: state => state.sidebarActiveElement,
    }),
  },
};
</script>

<!-- Sidebar styles should be scoped -->
<style src="./Sidebar.scss" lang="scss" scoped/>
