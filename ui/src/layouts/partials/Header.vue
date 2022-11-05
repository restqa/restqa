<template>
  <div class="menu">
    <el-avatar class="avatar" icon="el-icon-user-solid"></el-avatar>
  </div>
</template>
<script>
export default {
  name: "HeaderPartial",
  components: {},
};
</script>

<style lang="scss" scoped>
.menu {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid rgb(230, 230, 230);

  .avatar {
    margin: 0 0 0 15px;
  }
}
</style>
