<template>
  <vx-card title="Team's note" emoji="❤️ ❤️ ❤️ ❤️ ❤️" class="mt-base" slot="no-body" >
    <Loader :show="!note.message" />
    <div class="team-note" v-if="note.message" >
      <img  key="onlineImg" :src="note.avatar" alt="team user-img" class="rounded-full shadow-md cursor-pointer block" />
      <div class="quote">
        <div class="message">"{{ note.message }}"</div>
        <div class="from">{{ note.from }}</div>
      </div>
    </div>
  </vx-card>
</template>

<script>
import VxCard from '../../global/vx-card/VxCard'
import Loader from '../../utils/loader/Loader'
import * as Service from '@/services/restqa/info'

export default {
  name: 'RestQATeamNote',
  components: {
    VxCard,
    Loader
  },
  data () {
    return {
      Service,
      note: {}
    }
  },
  async beforeMount () {
    try {
      this.note = await this.Service.getTeamNote()
    } catch (e) {
      this.note = {
        message: 'Thanks for testing with RestQA. It\'s a pleasure to support you on increasing the quality of your product.',
        from: 'RestQA',
        avatar: '/logo.png'
      }
    }
  }
}
</script>

<style src="./RestQATeamNote.scss" lang="scss" scoped />
