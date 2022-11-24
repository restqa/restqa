<template>
  <div ref="container"></div>
</template>

<script>
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
    };
  },
  mounted() {
    this.chart = Highcharts.chart(this.$refs.container, this.options);
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
