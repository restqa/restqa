<template>
  <div id="dashboard-analytics">
    <el-row v-if="!hasConfig">
      <el-col :span="10" :offset="7">
         <restqa-project-init></restqa-project-init>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="hasConfig">
      <el-col :span="8">
        <el-space wrap direction="vertical">
          <restqa-project-config></restqa-project-config>
          <restqa-team-note></restqa-team-note>
          <restqa-sponsors></restqa-sponsors>
        </el-space>
      </el-col>
      <el-col :span="10"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6">
        <el-space class="w100" direction="vertical">
          <restqa-team-blog></restqa-team-blog>
          <restqa-team-video></restqa-team-video>
        </el-space>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RestqaTeamNote from '@/components/restqa/team-note/RestQATeamNote.vue'
import RestqaTeamBlog from '@/components/restqa/team-blog/RestQATeamBlog.vue'
import RestqaTeamVideo from '@/components/restqa/team-video/RestQATeamVideo.vue'
import RestqaSponsors from '@/components/restqa/sponsors/RestQASponsors.vue'
import RestqaProjectConfig from '@/components/restqa/project-config/RestQAProjectConfig.vue'
import RestqaProjectInit from '@/components/restqa/project-init/RestQAProjectInit.vue'

export default {
  name: 'Homepage',
  components: {
    RestqaTeamNote,
    RestqaTeamVideo,
    RestqaTeamBlog,
    RestqaSponsors,
    RestqaProjectConfig,
    RestqaProjectInit
  },
  computed: {
    hasConfig () {
      return Boolean(this.$store.getters.config)
    }
  },
  created () {
    this.$store.dispatch('config')
    this.$store.dispatch('info')
  }
}
</script>

<style>
.el-space__item {
  width: 100%;
}
</style>
