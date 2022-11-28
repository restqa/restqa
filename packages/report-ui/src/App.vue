<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    const appLoading = document.getElementById("loading-bg");
    if (appLoading) {
      appLoading.style.display = "none";
    }
  },
};
</script>
