<template>
  <div class="full-page">
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.full-page {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url("~@/assets/images/pages/full-page-bg.jpg");
}
</style>
