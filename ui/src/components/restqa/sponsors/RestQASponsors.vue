<template>
  <div class="sponsor">
    <h5>Sponsors</h5>

    <a
      :href="sponsor.url"
      target="_blank"
      v-for="(sponsor, index) in sponsors"
      :key="index"
    >
      <img :src="sponsor.img" :alt="sponsor.name" />
    </a>
  </div>
</template>

<script>
export default {
  name: "RestQASponsors",
  computed: {
    sponsors() {
      return [
        {
          name: "ATALENT Consulting",
          img: "./images/sponsors/atalent.png",
          url: "https://atalent-consulting.com/",
        },
      ];
    },
  },
};
</script>
<style src="./RestQASponsors.scss" lang="scss" scoped />
