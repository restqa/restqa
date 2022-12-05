<template>
  <card title="Features" emoji="🏆">
    <el-row :gutter="20">
      <el-col :span="16"
        ><highcharts :options="featuresForChart"></highcharts
      ></el-col>
      <el-col :span="8" style="text-align: right">
        <el-card class="statusCard" shadow="Hover">
          <el-image class="statusImg" :src="statusImageUrl" :fit="fit" />
          <div class="detailText">{{ statusDesc }}</div>
          <div class="detailLink">
            <el-link
              type="primary"
              v-on:click.stop.prevent="goToDetail()"
              v-if="accessLink"
              >See details</el-link
            >
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="16"> {{ nbFeatures }} Features </el-col>
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
    statusImageUrl() {
      return `images/reportStatus/${
        this.data.success
          ? "statusSuccess.png"
          : "statusFailed.png"
      }`;
    },
    statusDesc() {
      return this.data.success
        ? "Perfect, you reach the maximum level."
        : "Oops, something went wrong.";
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
          enabled: false,
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
<style>
.statusImg {
  display: flex !important;
  justify-content: center;
}
.statusImg .el-image__inner {
  width: 150px;
}
.statusCard {
  display: flex;
  text-align: left;
  height: 100%;
}
.statusCard .el-card__body {
  display: flex;
  flex-direction: column;
}
.detailText {
  margin-top: auto;
}
.detailLink {
  padding-top: 10px;
  display: flex;
}
</style>
