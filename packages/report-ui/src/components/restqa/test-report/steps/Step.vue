<template>
  <div v-if="isVisible" class="step-definition" :class="data.result.status">
    <span class="keyword">{{ data.keyword }}</span>
    <span class="step">{{ data.name }}</span>
    <el-link
      type="danger"
      icon="el-icon-error"
      @click.prevent="showError"
      class="btn btn-error"
      v-if="data.result.status === 'failed'"
      >Show errors</el-link
    >
    <el-link
      type="info"
      icon="el-icon-magic-stick"
      @click.prevent="copyCurl()"
      class="btn btn-info"
      v-if="hasCurl"
      >Copy Curl command</el-link
    >
    <el-link
      type="info"
      icon="el-icon-info"
      @click.prevent="showInfo"
      class="btn btn-info"
      v-if="hasAttachement && data.keyword.trim() !== 'When'"
      >Show info</el-link
    >

    <step-format
      class="arguments"
      v-if="data.arguments"
      :data="data.arguments"
      :is-built-in="isBuiltIn"
    />

    <pre class="debug debug-error" v-if="show.error">{{
      data.result.error_message
    }}</pre>

    <div v-if="show.info">
      <step-attachments :data="data.embeddings" />
    </div>
  </div>
</template>
<script>
import { copyText } from "vue3-clipboard";
import StepFormat from "./StepFormat.vue";
import StepAttachments from "./StepAttachments.vue";

export default {
  name: "RestQAProjectEditorRunnerStep",
  components: {
    StepFormat,
    StepAttachments,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      show: {
        error: false,
        info: false,
      },
    };
  },
  computed: {
    hasAttachement() {
      return (this.data.embeddings || []).length;
    },
    isVisible() {
      return (
        (this.data.embeddings && this.data.embeddings.length) ||
        true !== this.data.hidden
      );
    },
    hasArguments() {
      return (this.data.arguments || []).length;
    },
    hasCurl() {
      let result = false;
      if (this.hasAttachement && this.data.keyword.trim() === "When") {
        const curlCommand = this.data.embeddings[0].data;
        if (curlCommand.split(" ")[0].toLowerCase().trim() === "curl") {
          result = true;
        }
      }
      return result;
    },
    isBuiltIn() {
      return [
        'the headers:',
        'the query strings:',
        'the body (json):',
        'the body (form):',
        'headers:',
      ].includes(this.data.name)
    }
  },
  methods: {
    showError() {
      this.show.error = !this.show.error;
    },
    showInfo() {
      this.show.info = !this.show.info;
    },
    copyCurl() {
      const curlCommand = this.data.embeddings[0].data;
      copyText(curlCommand, undefined, (error) => {
        const type = error ? "error" : "success";
        const message = error
          ? error.message
          : "Curl command copied into your clipboard";
        this.$notify({
          message,
          type,
        });
      });
    },
  },
};
</script>
<style src="./Step.scss" lang="scss" scoped />
