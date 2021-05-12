<template>
  <vx-card title="Sponsors" emoji="⭐️" class="mt-base" slot="no-body" >
    <Loader :show="!sponsors.length" />
    <div class="sponsors" v-if="sponsors.length" >
      <a v-for="(sponsor, index)  in sponsors"
        :key="index"
        :href="sponsor.url"
        :title="sponsor.name"
        class="sponsor"
        target="_blank"
        >
        <img  :src="sponsor.logo" :alt="sponsor.name" />
      </a>
    </div>
    <div class="join">
     <a href="https://github.com/sponsors/restqa" target="_blank">
       Your logo here
     </a>
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
      sponsors: []
    }
  },
  async beforeMount () {
    try {
      this.sponsors = await this.Service.getTeamSponsors()
    } catch (e) {
      this.sponsors = [
        {
          url: 'https://atalent-consulting.com',
          name: 'Atalent Consulting',
          logo: 'https://atalent-consulting.com/logo.png'
        }
      ]
    }
  }
}
</script>

<style src="./RestQASponsors.scss" lang="scss" scoped />

