<template>
  <el-container>
    <i
      class="el-icon-search"
      style="z-index: 1000; position: absolute; right: 310px; top: 100px"
    ></i>
    <el-select
      style="width: 100%; margin-right: 270px; text-align: right"
      v-model="value"
      filterable
      remote
      size="small"
      placeholder="Please enter a keyword"
      :remote-method="remoteMethod"
      :loading="loading"
      @change="select"
      clearable
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </el-container>
</template>

<script>
import docs from "@restqa/docs";

export default {
  name: "SearchPage",
  data() {
    const list = Object.values(docs.getElements())
      .filter((item) => true !== Boolean(item.attributes.disabled))
      .map((item) => {
        return {
          label: item.attributes.title,
          content: item.html.replace(/<\/?[^>]+(>|$)/g, "").toLowerCase(),
          value: item.attributes.id,
        };
      });
    return {
      list,
      options: [],
      value: [],
      loading: false,
    };
  },
  methods: {
    select(id) {
      id && this.$emit("render", { id });
    },
    remoteMethod(query) {
      this.loading = true;
      if (query) {
        if (query.length < 3) return;
        this.loading = false;
        this.options = this.list.filter((item) => {
          return item.content.includes(query.toLowerCase());
        });
      } else {
        this.options = [];
      }
    },
  },
};
</script>
