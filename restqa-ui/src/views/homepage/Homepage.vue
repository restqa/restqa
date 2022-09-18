<template>
  <div id="dashboard-analytics">
    <homepage-test-report v-if="isResultReport"></homepage-test-report>
    <homepage-dashboard v-else></homepage-dashboard>
  </div>
</template>

<script>
import HomepageTestReport from "./HomepageTestReport.vue";
import HomepageDashboard from "./HomepageDashboard.vue";

export default {
  name: "Homepage",
  components: {
    HomepageTestReport,
    HomepageDashboard
  },
  data() {
    return {
      testReport: this.$store.getters.testReport
    };
  },
  computed: {
    isResultReport() {
      return Boolean(this.testReport);
    }
  }
};
</script>
