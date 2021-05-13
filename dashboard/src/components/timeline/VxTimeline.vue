<template>
  <ul class="vx-timeline">
      <li v-for="item in data" :key="item.title">
          <div class="timeline-icon" :class="`bg-${item.color}`">
              <feather-icon :icon="item.icon" svgClasses="text-white stroke-current w-5 h-5" />
          </div>
          <div class="timeline-info">
              <p class="font-semibold">{{ item.title }}</p>
              <span class="activity-desc">{{ item.desc }}</span>
          </div>
          <small class="text-grey activity-e-time">{{ item.time }}</small>
      </li>
  </ul>
</template>

<script>
export default {
  name: 'vx-timeline',
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/components/vxTimeline.scss";
</style>
