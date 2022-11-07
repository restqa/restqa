<template>
  <card title="Scenarios">
    <vue-highcharts :options="scenariosForChart"></vue-highcharts>
    <br />
  </card>
</template>
<script>
import Card from "@/components/UI/card/Card.vue";
import VueHighcharts from "vue3-highcharts";

export default {
  name: "RestqaTestChartFeatures",
  components: {
    Card,
    VueHighcharts,
  },
  methods: {
    getScenarioData() {
      const data = this.$store.getters.testReport.scenarios;
      return [
        {
          label: "Passed",
          data: data.passed,
        },
        {
          label: "Failed",
          data: data.failed,
        },
        {
          label: "skipped",
          data: data.skipped,
        },
        {
          label: "undefined",
          data: data.undefined,
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
