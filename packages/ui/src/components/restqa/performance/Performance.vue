<template>
  <card
    v-if="data.length"
    title="Performance test has been successfully generated"
  >
    <el-row :gutter="20">
      <el-col :span="2">
        <img :src="`images/logos/${configPerf.tool}.png`" class="option-img" />
      </el-col>
      <el-col :span="22">
        <el-tree :data="files" />
      </el-col>
    </el-row>
  </card>
  <card v-if="data.length" title="Run your performance test">
    In order to run your test you will just need to run the command:
    <br /><br />
    <pre><code class="language-bash">{{ bashCommand }}</code></pre>
    <br /><br />
    More information are available on the
    <a href="#/documentation/performance-testing">Documentation</a>
  </card>
  <card v-else title="Any performance test has been generated.">
    Do not forget if you want to generate test scenario you need to add the tag
    <strong>@performance</strong> on you test scenario.
    <br />
    <br />
    Example:
    <pre><code class="language-gherkin">@performance
Scenario: The product doesn't exist into the database
Given a request
  And the headers:
  | accept-language | en               |
  | content-type    | application/json |
When GET "/api/products/111112222233333"
Then status = 404
  And "message" = "Product doesn't exists"</code></pre>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card.vue";

export default {
  name: "PerformanceView",
  components: {
    Card,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
  },
  computed: {
    bashCommand() {
      const { tool, outputFolder } = this.configPerf;
      let cmd = "";
      switch (tool) {
        case "artillery":
          cmd = `artillery -c <your-config-file>  ${outputFolder}`;
          break;
      }
      return cmd;
    },
    configPerf() {
      return this.config.tests.performance;
    },
    files() {
      return [
        {
          label: "List of performance tests (" + this.data.length + " files)",
          children: this.data.map((file) => {
            return {
              label: file,
            };
          }),
        },
      ];
    },
  },
  mounted() {
    this.$nextTick(() => {
      Prism.highlightAll();
    });
  },
};
</script>

<style scoped>
.ide {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 8px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}

img {
  height: 80px;
}
</style>
