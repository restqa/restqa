<template>
  <h2>How Many Microservices depend on this Microservice?</h2>

  The microservice architecture brings a complexity that we tend to forget:
  Mocks management. Can you count how many times do you need to mock the
  microservice response to test a feature in another microservice?

  <br />
  <br />
  RestQA help you to solve this challenge by simply generating the mock fixture
  that you could reuse for your test in any microservice.

  <br />
  <br />
  Currently {{ mocks.data.files.length }} has been generated in the folder
  <i>{{ mocks.data.outputFolder }}</i
  >:
  <ul>
    <li v-for="(item, index) in mocks.data.files" :key="index">
      <el-link href="{{ item }}" target="_blank">{{
        item.replace(mocks.data.outputFolder, "")
      }}</el-link>
    </li>
  </ul>

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
</template>
<script>
export default {
  data() {
    const mocks = this.$store.getters.projectStatus.httpMocks;
    return {
      mocks
    };
  }
};
</script>
