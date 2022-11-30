<template>
  <h2>How Many Microservices depend on this Microservice?</h2>

  The microservice architecture brings a complexity that we tend to forget:
  Mocks management.
  <br />
  <br />
  RestQA would like to support you on that annoying task.<br />
  What if you could simply get up to date mock of the current microservice that
  you can use directly while you are testing another microservice?
  <br />
  <br />
  This is exactly what RestQA did for you!
  <br />
  <br />
  See below the list of mocks that has been generated in the folder
  <i>{{ outputFolder }}</i
  >:
  <ul>
    <li v-for="(item, index) in list" :key="index">
      <el-link :href="item.location" target="_blank">{{ item.name }}</el-link>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    outputFolder() {
      return this.data.outputFolder.replace(
        this.$store.getters.result.folder,
        ""
      );
    },
    list() {
      return this.data.files.map((item) => {
        return {
          name: item.replace(this.data.outputFolder, ""),
          location: this.$store.getters.result.getLocation(item),
        };
      });
    },
  },
};
</script>
