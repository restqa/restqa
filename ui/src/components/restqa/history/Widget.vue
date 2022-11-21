<template>
  <card title="History" emoji="⌛" class="card">
    <div class="container">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :color="activity.color"
          :hollow="activity.hollow"
          :timestamp="activity.timestamp"
          placement="top"
          @click="goToHistory(activity.id)"
        >
          <h4 v-if="activity.current">{{ activity.id }}</h4>
          <p v-else>{{ activity.id }}</p>
        </el-timeline-item>
      </el-timeline>
    </div>
  </card>
</template>
<script>
import History from "@/services/history";
import Card from "@/components/UI/card/Card.vue";
export default {
  name: "HistoryWidget",
  components: {
    Card,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      history: History.list(),
    };
  },
  methods: {
    goToHistory(id) {
      this.$store.dispatch("history", id);
    },
  },
  computed: {
    activities() {
      return History.list()
        .reverse()
        .map((item) => {
          const date = new Date(item.RESTQA_RESULT.timestamp);
          return {
            id: item.id,
            content: item.id,
            timestamp: date.toLocaleString("en-GB", { timeZone: "UTC" }),
            color: item.RESTQA_RESULT.success ? "#0bbd87" : "#EB6A2C",
            size: "large",
            current: this.data.id === item.id,
          };
        });
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
