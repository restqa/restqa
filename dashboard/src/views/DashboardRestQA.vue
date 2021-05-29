<template>
  <div id="dashboard-analytics">
    <div class="vx-col w-full lg:w-1/3 mb-base" v-if="!hasConfig">
      <RestQAProjectInit />
    </div>
    <div class="vx-col w-full lg:w-1/3 mb-base" v-if="hasConfig">
      <RestQAProjectConfig />
    </div>
    <div class="vx-col w-full lg:w-1/3 mb-base"  v-if="hasConfig">
      <RestQATeamNote />
    </div>
    <div class="vx-col w-full lg:w-1/3 mb-base"  v-if="hasConfig">
      <RestQATeamBlog />
    </div>
    <div class="vx-col w-full lg:w-1/3 mb-base"  v-if="hasConfig">
      <RestQATeamVideo />
    </div>
    <div class="vx-col w-full lg:w-1/3 mb-base"  v-if="hasConfig">
      <RestQASponsors />
    </div>
  </div>
</template>

<script>
import RestQATeamNote from '@/components/restqa/team-note/RestQATeamNote.vue'
import RestQATeamBlog from '@/components/restqa/team-blog/RestQATeamBlog.vue'
import RestQATeamVideo from '@/components/restqa/team-video/RestQATeamVideo.vue'
import RestQASponsors from '@/components/restqa/sponsors/RestQASponsors.vue'
import RestQAProjectInit from '@/components/restqa/project-init/RestQAProjectInit.vue'
import RestQAProjectConfig from '@/components/restqa/project-config/RestQAProjectConfig.vue'

export default {
  components: {
    RestQATeamNote,
    RestQATeamBlog,
    RestQATeamVideo,
    RestQASponsors,
    RestQAProjectInit,
    RestQAProjectConfig
  },
  computed: {
    hasConfig () {
      return Boolean(this.$store.getters.config)
    }
  },
  created () {
    this.$store.dispatch('config')
  }
}
</script>

<style lang="scss">
</style>
