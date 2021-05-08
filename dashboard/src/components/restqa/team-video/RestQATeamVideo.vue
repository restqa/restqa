<template>
  <vx-card title="Latest video" emoji="🎬" class="mt-base" slot="no-body" >
    <Loader :show="!video.url" />
    <div class="team-video" v-if="video.url" >
      <div class="video">
        <div class="date">{{ date }}</div>
        <a :href="video.last.url" target="_blank">
          <img :src="video.last.image" />
          <h6 class="title">{{ video.last.title }}</h6>
        </a>
      </div>
      <div class="channel">
        <a :href="video.url" target="_blank">Access to all the video</a>
      </div>
    </div>
  </vx-card>
</template>

<script>
import VxCard from '../../vx-card/VxCard'
import Loader from '../../utils/loader/Loader'
import * as Service from '@/services/restqa/info'

export default {
  name: 'RestQATeamVideo',
  components: {
    VxCard,
    Loader
  },
  data () {
    return {
      Service,
      video: {}
    }
  },
  computed: {
    date () {
      const d = new Date(this.video.last.date)
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
      this.video = await this.Service.getTeamVideo()
    } catch (e) {
      this.video = {
        url: 'https://www.youtube.com/channel/UCdT6QenNLmnxNT-aT8nYq_Q',
        last: {
          title: 'RestQA trailer',
          date: '2021-04-17 03:00:30',
          image: 'https://i2.ytimg.com/vi/EberYFGPZPo/hqdefault.jpg',
          url: 'https://www.youtube.com/watch?v=EberYFGPZPo'
        }
      }
    }
  }
}
</script>

<style src="./RestQATeamVideo.scss" lang="scss" scoped />
