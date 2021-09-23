<template>
  <card title="Sponsors" emoji="⭐️" :loading="null === sponsors">
    <div class="sponsors" v-if="sponsors">
      <a
        v-for="(sponsor, index) in sponsors"
        :key="index"
        :href="
          sponsor.url +
          '?utm_source=dashboard&utm_medium=referral&utm_campaign=restqa'
        "
        :title="sponsor.name"
        class="sponsor"
        target="_blank"
      >
        <img :src="sponsor.logo" :alt="sponsor.name" />
      </a>
    </div>
    <div class="join">
      <el-link href="https://github.com/sponsors/restqa" target="_blank"
        >Your logo here</el-link
      >
    </div>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card";

export default {
  name: "RestQASponsors",
  components: {
    Card
  },
  computed: {
    sponsors() {
      const {sponsors} = this.$store.getters.info || {sponsors: null};
      return sponsors;
    }
  }
};
</script>
<style src="./RestQASponsors.scss" lang="scss" scoped />
