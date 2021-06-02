<template>
<div class="common-layout">
  <el-container>
    <el-aside width="200px">
      <side-bar></side-bar>
    </el-aside>
    <el-container>
      <el-header>
      <restqa-select-config v-if="hasConfig"></restqa-select-config>

      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</div>
</template>

<script>
import SideBar from './menu/SideBar'
import RestqaSelectConfig from '@/components/restqa/select-config/RestQASelectConfig.vue'

export default {
  name: 'Dashboard',
  components: {
    SideBar,
    RestqaSelectConfig
  },
  computed: {
    hasConfig () {
      return Boolean(this.$store.getters.config)
    }
  },
}
</script>

<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>

