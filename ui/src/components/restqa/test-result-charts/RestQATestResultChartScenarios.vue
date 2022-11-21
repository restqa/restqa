<template>
  <card title="Scenarios">
    <highcharts :options="scenariosForChart"></highcharts>
    <br />
  </card>
</template>
<script>
import Card from "@/components/UI/card/Card.vue";
import Highcharts from "@/components/UI/highcharts/Highcharts.vue";

export default {
  name: "RestqaTestChartFeatures",
  components: {
    Card,
    Highcharts,
  },
  props: {
    accessLink: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getScenarioData() {
      return [
        {
          label: "Passed",
          data: this.data.passed,
        },
        {
          label: "Failed",
          data: this.data.failed,
        },
        {
          label: "skipped",
          data: this.data.skipped,
        },
        {
          label: "undefined",
          data: this.data.undefined,
        },
      ];
    },
  },
  computed: {
    scenariosForChart() {
      const colors = {
        sidebar: "#002B49",
        navbar: "#ffffff",
        primary: "#005792",
        secondary: "#798892",
        success: "#21AE8C",
        info: "#1A86D0",
        warning: "#FDA700",
        danger: "#FD5F00",
        inverse: "#0D2B47",
        textColor: "#495057",
        gray: "#D7DFE6",
      };
      let { success, danger, info, secondary } = colors;
      let series = [
        {
          name: "Scenarios",
          data: this.getScenarioData().map((s) => {
            return {
              name: s.label,
              y: s.data,
            };
          }),
        },
      ];
      return {
        chart: {
          type: "pie",
          height: 300,
        },
        credits: {
          enabled: false,
        },
        title: false,
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              format:
                "<b>{point.name}</b>:<br>{point.percentage:.1f} %<br>value: {point.y}",
            },
            borderColor: null,
            //showInLegend: true,
            innerSize: 100,
            size: 200,
            states: {
              hover: {
                halo: {
                  size: 1,
                },
              },
            },
          },
        },
        colors: [success, danger, info, secondary],
        legend: {
          align: "right",
          verticalAlign: "middle",
          layout: "vertical",
          itemStyle: {
            color: "#495057",
            fontWeight: 100,
            fontFamily: "Montserrat",
          },
          itemMarginBottom: 5,
          symbolRadius: 0,
        },
        exporting: {
          enabled: false,
        },
        series,
      };
    },
  },
};
</script>

<style></style>
