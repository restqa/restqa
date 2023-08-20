<template>
  <card title="History" emoji="⌛" class="card">
    <highcharts :options="historyForChart"></highcharts>
  </card>
</template>
<script>
import History from "@/services/history";
import Highcharts from "@/components/UI/highcharts/Highcharts.vue";
import Card from "@/components/UI/card/Card.vue";
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
    return {
      _current: null,
      history: History.list(),
    };
  },
  methods: {
    goToHistory(id) {
      this.$store.dispatch("history", id);
      this._current = id
    },
  },
  computed: {
    current () {
      return this._current || this.data.id
    },
    historyForChart() {
      const colors = {
        success: "#21AE8C",
        info: "#1A86D0",
        danger: "#FD5F00",
      };
      let { success, danger, info } = colors;
      let xAxis = {
        labels: {
          formatter:  ({ value }) => {
            const item = History.get(value)
            const date = new Date(item.RESTQA_RESULT.timestamp);
            let text = date.toLocaleString("en-GB", { timeZone: "UTC" })
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
          .map((item) => item.id)
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
                this.goToHistory(item.point.category)
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
};
</script>
<style scoped>
.container {
  overflow: scroll;
  height: 320px;
}
</style>
