<template>
  <div id="dashboard-analytics">
    <restqa-project-sandbox></restqa-project-sandbox>
  </div>
</template>

<script>
import RestqaProjectSandbox from "@/components/restqa/project-sandbox/RestQAProjectSandbox.vue";

export default {
  name: "Sandbox",
  components: {
    RestqaProjectSandbox
  }
};
</script>
