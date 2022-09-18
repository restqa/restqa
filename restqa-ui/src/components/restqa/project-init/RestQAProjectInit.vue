<template>
  <card title="Project Initialization" emoji="🚀" :loading="loader">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="API Url">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="Environment">
        <el-input v-model="form.env"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
      </el-form-item>
    </el-form>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card";
import * as Service from "@/services/restqa/project";
import {ValidationError} from "../../../services/http";

export default {
  name: "RestQAProjectInit",
  components: {
    Card
  },
  data() {
    return {
      loader: false,
      form: {}
    };
  },
  methods: {
    async onSubmit() {
      this.loader = true;
      try {
        await Service.initialize(this.form);
        this.$notify({
          title: "Let's go!",
          message: "🚀🚀 Your project has been created successfully!",
          type: "success"
        });
        this.$store.dispatch("config");
      } catch (e) {
        this.$notify({
          title: "Oups",
          message: e.message,
          type: e instanceof ValidationError ? "warning" : "error"
        });
      }
      this.loader = false;
    }
  }
};
</script>
<style src="./RestQAProjectInit.scss" lang="scss" scoped />
