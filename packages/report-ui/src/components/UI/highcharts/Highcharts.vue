<template>
  <el-alert
    title="An error occured while trying to load the Highcharts library..."
    type="error"
    :closable="false"
    class="error"
    v-if="hasError"
  />
  <div ref="container" v-loading="loading"></div>
</template>

<script>
import { LoadScript } from "@/services/utils/lazy-loader.js";

export default {
  name: "UiHighcharts",
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
      loading: true,
      hasError: false,
    };
  },
  methods: {
    initiate() {
      this.loading = false;
      this.chart = Highcharts.chart(this.$refs.container, this.options);
    },
    update(opt) {
      this.chart.update(opt);
    },
  },
  mounted() {
    if (undefined === window.Highcharts) {
      LoadScript("./vendors/highcharts.js")
        .then(this.initiate)
        .catch(() => {
          this.hasError = true;
        });
    } else {
      this.initiate();
    }
  },
  watch: {
    options: {
      handler(to) {
        this.chart.update(to);
      },
    },
  },
};
</script>
<style scoped>
.error {
  margin-bottom: 30px;
}
</style>
