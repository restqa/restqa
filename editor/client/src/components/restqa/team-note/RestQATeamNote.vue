<template>
  <vx-card title="Team's note" emoji="❤️ ❤️ ❤️ ❤️ ❤️" class="mt-base" slot="no-body" >
    <div class="team-note">
      <img  key="onlineImg" :src="note.avatar" alt="team user-img" class="rounded-full shadow-md cursor-pointer block" />
      <div class="quote">
        <div class="message">"{{ note.message }}"</div>
        <div class="from">{{ note.from }}</div>
      </div>
    </div>
  </vx-card>
</template>

<script>
import VxCard from '../../vx-card/VxCard'
import * as Service from '@/services/restqa/team-note'

export default {
  name: 'RestQATeamNote',
  components: {
    VxCard
  },
  data () {
    return {
      Service,
      note: {}
    }
  },
  async beforeMount () {
    try {
      this.note = await this.Service.get()
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
