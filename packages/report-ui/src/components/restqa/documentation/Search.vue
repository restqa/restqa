<template>
  <el-select
    class="searchbar"
    v-model="value"
    filterable
    remote
    size="large"
    placeholder="Search in the documentation"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="select"
    clearable
    remote-show-suffix
    :suffix-icon="Search"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
import docs from "@restqa/docs";
import { Search } from "@element-plus/icons-vue";

export default {
  name: "SearchPage",
  setup() {
    return {
      Search,
    };
  },
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
<style lang="scss">
.searchbar {
  margin: 0 auto 20px auto;
  width: 100%;

  div.el-input {
    width: 100%;
    border: 0;
    div.el-input__wrapper {
      width: 100%;
      border: 0;
      input.el-input__inner {
        border: 0;
      }
      .el-input__suffix {
        rotate: 180deg;
      }
    }
  }
}
</style>
