<template>
  <card title="Latest video" emoji="🎬" :loading="!video.url">
    <div class="team-video" v-if="video.url">
      <div class="video">
        <div class="date">{{ date }}</div>
        <a :href="video.last.url" target="_blank">
          <img class="image" :src="video.last.image" />
          <h6 class="title">{{ video.last.title }}</h6>
        </a>
      </div>
      <div class="channel">
        <el-link :href="video.url" target="_blank" type="primary"
          >Access to all the video</el-link
        >
      </div>
    </div>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card";

export default {
  name: "RestQATeamVideo",
  components: {
    Card
  },
  computed: {
    date() {
      const d = new Date(this.video.last.date);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric"
      };
      return d.toLocaleDateString("en", options);
    },
    video() {
      const {video} = (this.$store.getters.info &&
        this.$store.getters.info.team) || {video: {}};
      return video;
    }
  }
};
</script>

<style src="./RestQATeamVideo.scss" lang="scss" scoped />
