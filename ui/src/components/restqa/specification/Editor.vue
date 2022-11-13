<template>
  <card title="Only 1 step is required to setup your API specification">
    <el-select
      v-model="value"
      @change="selectTool()"
      class="m-2 select"
      placeholder="Select your favorite api specification tool"
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
      <pre><code class="language-yaml">{{ code }}</code></pre>
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
import "prismjs/components/prism-core";
import { stringify } from "yaml";
import { copyText } from "vue3-clipboard";

export default {
  name: "SpecificationEditor",
  components: {
    Card,
  },
  data() {
    const performance = this.$store.getters.projectStatus.performance;
    const config = JSON.parse(
      JSON.stringify(this.$store.getters.projectConfiguration)
    );
    return {
      config,
      performance,
      value: null,
      code: "",
      tools: [
        {
          value: "swagger",
          label: "Swagger (OAS)",
          disabled: false,
          link: "https://swagger.io/",
        },
        {
          value: "raml",
          label: "Raml (coming soon)",
          disabled: true,
          link: "https://raml.org",
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
      };
      this.config.specification = tmpl;
      this.code = "---\n" + stringify(this.config);
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
.ide {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}

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
