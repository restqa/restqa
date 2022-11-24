<template>
  <card title="Only 1 step is required to setup your load testing">
    <el-select
      v-model="value"
      @change="selectTool()"
      class="m-2 select"
      placeholder="Select your favorite load testing tool"
      size="large"
    >
      <el-option
        v-for="item in tools"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
        size="large"
      >
        <img :src="`images/logos/${item.value}.png`" class="option-img" />
        <span>{{ item.label }}</span>
      </el-option>
    </el-select>

    <div v-if="code">
      <h4>Here is the new version of your .restqa.yml</h4>
      <pre><code class="language-yml">{{ code }}</code></pre>
      <el-row :gutter="20">
        <el-col :span="12" :offset="6">
          <el-button
            type="primary"
            icon="el-icon-copy-document"
            @click="copyConfig()"
            class="btn-copy"
            plain
            >Copy</el-button
          >
        </el-col>
      </el-row>
      <h4>About {{ tool.label }}</h4>
      Find more information about {{ tool.label }}
      <a :href="tool.link" target="_blank">here</a>.
    </div>
  </card>
</template>
<script>
import Card from "@/components/UI/card/Card.vue";
import { stringify } from "yaml";
import { copyText } from "vue3-clipboard";

export default {
  name: "PerformanceEditor",
  components: {
    Card,
  },
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      value: null,
      code: "",
      tools: [
        {
          value: "artillery",
          label: "Artillery",
          disabled: false,
          link: "https://www.artillery.io/",
        },
        {
          value: "k6",
          label: "K6 (coming soon)",
          disabled: true,
          link: "https://k6.io/",
        },
        {
          value: "jmeter",
          label: "Jmeter (coming soon)",
          disabled: true,
          link: "https://jmeter.apache.org/",
        },
        {
          value: "vegeta",
          label: "Vegeta (coming soon)",
          disabled: true,
          link: "https://github.com/tsenart/vegeta",
        },
      ],
    };
  },
  computed: {
    tool() {
      return this.tools.find((_) => _.value === this.value);
    },
  },
  methods: {
    selectTool() {
      const tmpl = {
        tool: this.value,
        outputFolder: "tests/performances",
        onlySuccess: false,
      };
      const config = JSON.parse(JSON.stringify(this.config));
      config.tests.performance = tmpl;
      this.code = "---\n" + stringify(config);
      this.$nextTick(() => {
        Prism.highlightAll();
      });
    },
    copyConfig() {
      copyText(this.code, undefined, (error) => {
        const type = error ? "error" : "success";
        const message = error
          ? error.message
          : "New configuration copied into your clipboard";
        this.$notify({
          message,
          type,
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-select-dropdown__item {
  height: 60px;
  .option-img {
    height: 50px;
    float: left;
    margin-right: 10px;
  }
  span {
    float: left;
    line-height: 50px;
  }
}

.select {
  width: 400px;
}

.btn-copy {
  width: 100%;
  margin: 20px auto;
}
</style>
