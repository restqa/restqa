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
  mounted() {
    Highcharts.chart(this.$refs.container, this.options);
  },
};
</script>
