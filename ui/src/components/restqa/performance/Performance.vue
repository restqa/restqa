<template>
  <card
    v-if="performance.data.length"
    title="Performance test has been successfully generated"
  >
    <el-row :gutter="20">
      <el-col :span="2">
        <img :src="`images/logos/${config.tool}.png`" class="option-img" />
      </el-col>
      <el-col :span="22">
        <el-tree :data="files" />
      </el-col>
    </el-row>
  </card>
  <card v-else title="Any performance test has been generated.">
    Do not forget if you want to generate test scenario you need to add the tag
    <strong>@performance</strong> on you test scenario.
    <br />
    <br />
    Example:
    <prism-editor
      :readonly="true"
      v-model="scenario"
      class="ide"
      :highlight="highlighterGherkin"
    ></prism-editor>
  </card>
  <card v-if="performance.data.length" title="Run your performance test">
    In order to run your test you will just need to run the command:
    <br /><br />
    <prism-editor
      :readonly="true"
      class="ide"
      v-model="bashCommand"
      :highlight="highlighterBash"
    ></prism-editor>
    <br /><br />
    More information are available on the
    <a href="#/documentation/performance-testing">Documentation</a>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card.vue";
import { PrismEditor } from "vue-prism-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-gherkin";

export default {
  name: "PerformanceView",
  components: {
    Card,
    PrismEditor,
  },
  data() {
    const performance = this.$store.getters.projectStatus.performance;
    const config = this.$store.getters.projectConfiguration.tests.performance;
    return {
      performance,
      config,
      scenario: `
@performance
Scenario Outline: The product doesn't exist into the database
Given I have the api gateway
  And I have the path "/api/products/111112222233333"
  And I have the method "GET"
  And the header contains "accept-language" as "<language>"
  And the header contains "content-type" as "application/json"
When I run the API
Then I should receive a response with the status 404
  And the response body at "message" should equal "<message>"
  And the response time is under 1000 ms
Examples:
| language | message                    |
| en       | The product doesn't exist. |
| fr       | Le produit n'existe pas.   |
| it       | Le produit n'existe pas.   |
| default  | Le produit n'existe pas.   |

      `.trim(),
      files: [
        {
          label:
            "List of performance tests (" + performance.data.length + " files)",
          children: performance.data.map((file) => {
            return {
              label: file,
            };
          }),
        },
      ],
    };
  },
  methods: {
    highlighterBash(code) {
      return highlight(code, languages.bash);
    },
    highlighterGherkin(code) {
      return highlight(code, languages.gherkin);
    },
  },
  computed: {
    bashCommand() {
      const { tool, outputFolder } = this.config;
      let cmd = "";
      switch (tool) {
        case "artillery":
          cmd = `artillery -c <your-config-file>  ${outputFolder}`;
          break;
      }
      return cmd;
    },
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
