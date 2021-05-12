<template functional>
  <div class="vx-input-group flex" :class="data.staticClass">

    <!-- SLOT: PREPEND -->
    <div class="vx-input-group-prepend flex" :class="props.prependClasses" v-if="slots().prepend">
      <slot name="prepend"></slot>
    </div>

    <!-- SLOT: DEFAULT -->
    <div class="vx-input-group-default flex-grow">
      <slot></slot>
    </div>

    <!-- SLOT: APPEND -->
    <div class="vx-input-group-append flex" :class="props.appendClasses" v-if="slots().append">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vx-input-group',
  props: {
    prependClasses : { type: String },
    appendClasses  : { type: String }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/components/vxInputGroup.scss";
</style>
