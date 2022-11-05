<template>
  <card style="height: 410px" title="Health Service" emoji="❤️">
    <span v-if="status">
      What a nice service, I love to see delicious developer experience.
    </span>
    <span v-else>
      Currently your service is not ready to provide an amazing happiness to
      your team.<br />
      Take a look at the items below.
    </span>
    <br />
    <br />
    <br />
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        size="large"
      >
        <span v-if="activity.enabled">{{ activity.content }}</span>
        <span v-else>
          <el-popconfirm
            :hideIcon="true"
            @confirm="configure(activity.key)"
            title="Do you want to configure it now ?"
          >
            <template #reference>
              <el-link href="#">{{ activity.content }}</el-link>
            </template>
          </el-popconfirm>
        </span>
      </el-timeline-item>
    </el-timeline>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card.vue";

export default {
  name: "RestQAProjectStatus",
  components: {
    Card,
  },
  data() {
    const status = this.$store.getters.projectStatus;
    const data = Object.keys(status)
      .map((key) => {
        const el = status[key];
        return {
          ...el,
          key,
          content: el.label,
          type: el.enabled ? "success" : "danger",
        };
      })
      .filter((el) => {
        return !el.hidden;
      });
    return {
      activities: data,
      status: data.reduce((state, el) => {
        return state && (el.enabled || false);
      }, true),
    };
  },
  computed: {
    name() {
      return this.testReport.name;
    },
  },
  methods: {
    configure(name) {
      this.$router.push({ name });
    },
  },
};
</script>
