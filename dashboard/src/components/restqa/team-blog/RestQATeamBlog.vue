<template>
  <card title="Latest article" emoji="📝" :loading="!blog.url">
    <div class="team-blog" v-if="blog.url">
      <div class="article">
        <div class="date">{{ date }}</div>
        <a :href="blog.last.url" target="_blank">
          <img class="image" :src="blog.last.image" />
          <div class="author">
            <avatar :src="blog.last.author.avatar" size="medium" />
          </div>
          <h6 class="title">{{ blog.last.title }}</h6>
        </a>
      </div>
      <div class="blog">
        <el-link :href="blog.url" target="_blank" type="primary"
          >Access to all the article</el-link
        >
      </div>
    </div>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card";
import Avatar from "@/components/UI/avatar/Avatar";

export default {
  name: "RestQATeamBlog",
  components: {
    Card,
    Avatar
  },
  computed: {
    date() {
      const d = new Date(this.blog.last.date);
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric"
      };
      return d.toLocaleDateString("en-CA", options);
    },
    blog() {
      const {blog} = (this.$store.getters.info &&
        this.$store.getters.info.team) || {blog: {}};
      return blog;
    }
  }
};
</script>

<style src="./RestQATeamBlog.scss" lang="scss" scoped />
