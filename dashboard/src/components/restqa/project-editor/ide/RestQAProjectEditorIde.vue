<template>
  <div>
    <el-alert :title="error" v-if="error" type="error"></el-alert>
    <prism-editor
      :readonly="readOnly"
      class="ide"
      v-if="code"
      v-model="code"
      :highlight="highlighter"
      line-numbers
    ></prism-editor>
    <el-button
      :loading="saveProgress"
      type="success"
      icon="el-icon-edit"
      v-if="showBtn"
      class="btn-save"
      @click="save"
      plain
      >Save</el-button
    >
  </div>
</template>

<script>
import {PrismEditor} from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css";
import {highlight, languages} from "prismjs/components/prism-core";
import "prismjs/components/prism-gherkin";
import "prismjs/themes/prism-tomorrow.css";
import {saveFeatureFile, getFeatureFile} from "@/services/restqa/project";

export default {
  emits: ["unsave"],
  components: {
    PrismEditor
  },
  props: {
    file: {
      type: String,
      default: ""
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      code: "",
      originalCode: "",
      error: "",
      saveProgress: false
    };
  },
  methods: {
    highlighter(code) {
      return highlight(code, languages.gherkin);
    },
    save() {
      this.saveProgress = true;
      saveFeatureFile(this.file, this.code)
        .then(() => {
          this.originalCode = this.code;
        })
        .finally(() => {
          this.saveProgress = false;
        });
    }
  },
  computed: {
    showBtn() {
      return this.code !== this.originalCode;
    }
  },
  mounted() {
    if (!this.file) {
      this.error = "An error occured: the file can't be loaded";
      return;
    }
    getFeatureFile(this.file)
      .then((res) => {
        this.code = res;
        this.originalCode = res;
      })
      .catch((e) => {
        this.error = "An error occured: " + e.message;
      });
  },
  watch: {
    showBtn(state) {
      this.$emit("unsave", this.file, state);
    }
  }
};
</script>

<style src="./RestQAProjectEditorIde.scss" lang="scss" scoped />
