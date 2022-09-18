<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import {useState} from "vue-gtag-next";

export default {
  name: "App",
  computed: {
    telemetry() {
      return this.$store.getters.preferences.telemetry || false;
    }
  },
  created() {
    this.$store.dispatch("config");
    this.$store.dispatch("preferences");
  },
  watch: {
    telemetry(val) {
      const {isEnabled} = useState();
      isEnabled.value = val;
    }
  }
};
</script>
