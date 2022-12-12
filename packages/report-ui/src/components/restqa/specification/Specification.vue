<template>
  <el-alert
    title="An error occured while trying to load the swagger ui... Sorry about that"
    type="error"
    :closable="false"
    v-if="hasError"
  />
  <div class="spacer" v-if="loading">
    Wait a second, your api specification is baking!
  </div>
  <div class="swagger" id="swagger" v-loading="loading"></div>
</template>

<script>
import { LoadScript, LoadStyle } from "@/services/utils/lazy-loader.js";

export default {
  name: "SpecificationView",
  props: {
    data: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      loading: true,
      hasError: false,
    };
  },
  methods: {
    loadSwagger(spec) {
      this.loading = false;
      SwaggerUIBundle({
        spec,
        dom_id: "#swagger",
      });
    },
  },
  watch: {
    content: {
      handler(to) {
        this.loadSwagger(to);
      },
    },
  },
  mounted() {
    Promise.all([
      LoadStyle("./vendors/swagger-ui.css"),
      LoadScript("./vendors/swagger-ui-bundle.js"),
      LoadScript("./vendors/swagger-ui-standalone-preset.js"),
    ])
      .then(() => {
        this.loadSwagger(this.data);
      })
      .catch(() => {
        this.hasError = true;
      });
  },
};
</script>
<style scoped>
.spacer {
  padding-top: 100px;
  height: 60px;
  text-align: center;
  color: #8c40ff;
}
div.swagger div {
}
</style>
