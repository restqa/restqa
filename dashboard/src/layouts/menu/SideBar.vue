<template>
<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
  <el-submenu index="1">
    <template #title>
      <i class="el-icon-location"></i>
      <span>Navigator One</span>
    </template>
    <el-menu-item-group>
      <template #title><span>Group One</span></template>
      <el-menu-item index="1-1" @click="goTo('homepage')">Homepage</el-menu-item>
      <el-menu-item index="1-2" @click="goTo('steps')">Steps</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group title="Group Two">
      <el-menu-item index="1-3">item three</el-menu-item>
    </el-menu-item-group>
    <el-submenu index="1-4">
      <template #title><span>item four</span></template>
      <el-menu-item index="1-4-1">item one</el-menu-item>
    </el-submenu>
  </el-submenu>
  <el-menu-item index="2">
    <i class="el-icon-menu"></i>
    <template #title>Navigator Two</template>
  </el-menu-item>
  <el-menu-item index="3" disabled>
    <i class="el-icon-document"></i>
    <template #title>Navigator Three</template>
  </el-menu-item>
  <el-menu-item index="4">
    <i class="el-icon-setting"></i>
    <template #title>Navigator Four</template>
  </el-menu-item>
</el-menu>
</template>


<script>
  export default {
    data() {
      return {
        isCollapse: false
      };
    },
    methods: {
      goTo(name) {
        this.$router.push({ name })
      }
    }
  }
</script>
