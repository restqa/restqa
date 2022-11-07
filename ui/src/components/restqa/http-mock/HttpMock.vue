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
  <i>{{ mocks.data.outputFolder }}</i
  >:
  <ul>
    <li v-for="(item, index) in mocks.data.files" :key="index">
      <el-link :href="'file://' + item" target="_blank">{{
        item.replace(mocks.data.outputFolder, "")
      }}</el-link>
    </li>
  </ul>

  <!--
  <h3>Learn how to use this feature (todo)</h3>

  <iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/NpEaa2P7qZI"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
--></template>
<script>
export default {
  data() {
    const mocks = this.$store.getters.projectStatus.httpMocks;
    return {
      mocks,
    };
  },
};
</script>
