<template>
  <div id="dashboard-analytics">
    <div class="vx-col w-full lg:w-1/3 mb-base" >
      <RestQATeamNote />
    </div>
  </div>
</template>

<script>
import RestQATeamNote from '@/components/restqa/team-note/RestQATeamNote.vue'

export default {
  data () {
    return {}
  },
  components: {
    RestQATeamNote
  },
  created () {
  }
}
</script>

<style lang="scss">
</style>
