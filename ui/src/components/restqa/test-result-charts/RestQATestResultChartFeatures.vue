<template>
  <card title="Features" emoji="🏆">
    <highcharts :options="featuresForChart"></highcharts>
    <el-row :gutter="20">
      <el-col :span="16"> {{ nbFeatures }} Features </el-col>
      <el-col :span="8" style="text-align: right">
        <el-link
          type="primary"
          v-on:click.stop.prevent="goToDetail()"
          v-if="accessLink"
          >Access to all the detail test result</el-link
        >
      </el-col>
    </el-row>
  </card>
</template>
<script>
import Card from "@/components/UI/card/Card.vue";
import Highcharts from "@/components/UI/highcharts/Highcharts.vue";

export default {
  name: "RestqaTestChartFeatures",
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
  components: {
    Card,
    Highcharts,
  },
  methods: {
    getFeatureData() {
      return [
        {
          label: "Passed",
          data: this.data.passed,
        },
        {
          label: "Skipped",
          data: this.data.skipped,
        },
        {
          label: "Failed",
          data: this.data.failed,
        },
      ];
    },
    goToDetail() {
      this.$router.push({
        name: "features",
      });
    },
  },
  computed: {
    nbFeatures() {
      return this.data.features.length;
    },
    featuresForChart() {
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
      let { success, danger, info } = colors;
      let series = [
        {
          name: "Features",
          data: this.getFeatureData().map((s) => {
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
            showInLegend: true,
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
        colors: [success, info, danger],
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
