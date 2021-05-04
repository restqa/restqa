<template>
    <ul class="list">
        <li class="list__item" v-for="(item, index) in list" :key="index">
            <feather-icon :icon="rtlSpecificIcon" class="w-5 h-5 mr-1"></feather-icon><span v-html="item"></span>
        </li>
    </ul>
</template>

<script>
export default {
  name: 'vx-list',
  props: {
    list: {
      type: Array,
      required: true
    },
    icon: {
      type: String,
      default: 'ChevronsRightIcon'
    }
  },
  computed: {
    rtlSpecificIcon () {
      let i = this.icon
      if (this.$vs.rtl) {

        if (i.includes('Left')) {
          i = i.replace('Left', 'Right')
        } else if (i.includes('Right')) {
          i = i.replace('Right', 'Left')
        }


        if (i.includes('Left')) {
          i = i.replace('Left', 'Right')
        } else if (i.includes('Right')) {
          i = i.replace('Right', 'Left')
        }
      }
      return i
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/components/vxList.scss";
</style>
