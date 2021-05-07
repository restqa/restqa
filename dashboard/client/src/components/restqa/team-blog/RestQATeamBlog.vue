<template>
  <vx-card title="Latest article" emoji="📝" class="mt-base" slot="no-body" >
    <Loader :show="!blog.url" />
    <div class="team-blog" v-if="blog.url" >
      <div class="article">
        <div class="date">{{ date }}</div>
        <a :href="blog.last.url" target="_blank">
          <img :src="blog.last.image" />
          <div class="author">
            <img :src="blog.last.author.avatar"  class="rounded-full shadow-md cursor-pointer block" />
          </div>
          <h6 class="title">{{ blog.last.title }}</h6>
        </a>
      </div>
      <div class="blog">
        <a :href="blog.url" target="_blank">Access to all the articles</a>
      </div>
    </div>
  </vx-card>
</template>

<script>
import VxCard from '../../vx-card/VxCard'
import Loader from '../../utils/loader/Loader'
import * as Service from '@/services/restqa/info'

export default {
  name: 'RestQATeamBlog',
  components: {
    VxCard,
    Loader
  },
  data () {
    return {
      Service,
      blog: {}
    }
  },
  computed: {
    date () {
      const d = new Date(this.blog.last.date)
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
      return d.toLocaleDateString('en-CA', options)
    }
  },
  async beforeMount () {
    try {
      this.blog = await this.Service.getTeamBlog()
    } catch (e) {
      this.blog = {
        url: 'https://medium.com/restqa',
        last: {
          title: 'RestQA is here! Do your end-to-end API test integration, the right way!',
          date: '2021-02-02 02:24:19',
          image: 'https://cdn-images-1.medium.com/max/1024/1*iyyY6QkAAE2bOzNRevfCuw.png',
          author: {
            username: '@Olivierodo',
            avatar: 'https://cdn-images-1.medium.com/fit/c/150/150/1*acYALd6w84KRScRNMpFLUg.jpeg'
          },
          url: 'https://medium.com/restqa/restqa-is-here-do-your-end-to-end-api-test-integration-the-right-way-84b7313e1291'
        }
      }
    }
  }
}
</script>

<style src="./RestQATeamBlog.scss" lang="scss" scoped />

