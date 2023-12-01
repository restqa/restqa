<template>
  <card title="History" emoji="⌛" class="card">
    <highcharts ref="chart" :options="historyForChart"></highcharts>
  </card>
</template>
<script>
import History from "@/services/history";
import Highcharts from "@/components/UI/highcharts/Highcharts.vue";
import Card from "@/components/UI/card/Card.vue";
import { Listen, Get } from "@/services/utils/dark-mode.js";

export default {
  name: "HistoryWidget",
  components: {
    Card,
    Highcharts,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    let isDark = Get();
    Listen((evt) => {
      this.$refs.chart && this.$refs.chart.update(this.getData(evt.isDark));
      isDark = evt.isDark;
    });
    return {
      isDark,
      currentId: null,
      history: History.list(),
    };
  },
  methods: {
    goToHistory(id) {
      this.$store.dispatch("history", id);
      this.currentId = id;
    },
    getData(isDark) {
      const txtColor = isDark ? "#ffffff" : null;
      const colors = {
        success: "#21AE8C",
        info: "#1A86D0",
        danger: "#FD5F00",
      };
      let { success, danger, info } = colors;
      let xAxis = {
        labels: {
          style: {
            color: txtColor,
          },
          formatter: ({ value }) => {
            const item = History.get(value);
            const date = new Date(item.RESTQA_RESULT.timestamp);
            let text = date.toLocaleString("en-GB", { timeZone: "UTC" });
            /*
            if (this.current === item.id) {
              text  = `<strong>${text}</strong>`
            }
            */
            return text.replace(",", "<br />");
          },
        },
        categories: History.list()
          .reverse()
          .map((item) => item.id),
      };

      let data = History.list()
        .reverse()
        .map((item) => {
          return {
            passed: item.RESTQA_RESULT.passed,
            failed: item.RESTQA_RESULT.failed,
            skipped: item.RESTQA_RESULT.skipped,
          };
        });

      let series = [
        {
          name: "Passed",
          data: data.map((item) => item.passed),
        },
        {
          name: "Skipped",
          data: data.map((item) => item.skipped),
        },
        {
          name: "Failed",
          data: data.map((item) => item.failed),
        },
      ];

      return {
        chart: {
          type: "column",
          height: 300,
          backgroundColor: "transparent",
        },
        credits: {
          enabled: false,
        },
        title: false,
        plotOptions: {
          column: {
            stacking: "normal",
            dataLabels: {
              enabled: false,
            },
            enableMouseTracking: true,
            events: {
              click: (item) => {
                this.goToHistory(item.point.category);
              },
            },
          },
        },
        tooltip: {
          enable: true,
          headerFormat: "<b>{point.x}</b><br/>",
          pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
        },
        colors: [success, info, danger],
        legend: {
          labelFormatter: function () {
            return `<span style="color: ${txtColor}">${this.name}</span>`;
          },
        },
        yAxis: {
          min: 0,
          title: false,
          allowDecimals: false,
          stackLabels: {
            enabled: false,
          },
        },
        exporting: {
          enabled: false,
        },
        xAxis,
        series,
      };
    },
  },
  computed: {
    current() {
      return this.currentId || this.data.id;
    },
    historyForChart() {
      return this.getData(this.isDark);
    },
  },
};
</script>
