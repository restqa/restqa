<template>
  <div id="dashboard-analytics">
    <div class="vx-col w-full lg:w-1/3 mb-base" >
      <RestQATeamNote />
    </div>
    <div class="vx-col w-full lg:w-1/3 mb-base" >
      <RestQATeamBlog />
    </div>
    <div class="vx-col w-full lg:w-1/3 mb-base" >
      <RestQATeamVideo />
    </div>
    <div class="vx-col w-full lg:w-1/3 mb-base" >
      <RestQASponsors />
    </div>
  </div>
</template>

<script>
import RestQATeamNote from '@/components/restqa/team-note/RestQATeamNote.vue'
import RestQATeamBlog from '@/components/restqa/team-blog/RestQATeamBlog.vue'
import RestQATeamVideo from '@/components/restqa/team-video/RestQATeamVideo.vue'
import RestQASponsors from '@/components/restqa/sponsors/RestQASponsors.vue'

export default {
  data () {
    return {}
  },
  components: {
    RestQATeamNote,
    RestQATeamBlog,
    RestQATeamVideo,
    RestQASponsors
  },
  created () {
  }
}
</script>

<style lang="scss">
</style>
