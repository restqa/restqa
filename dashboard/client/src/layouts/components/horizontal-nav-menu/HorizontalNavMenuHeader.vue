<template>
  <div
    class="nav-header py-4"
    @mouseover  = "hovered"
    @mouseleave = "hovered(false)"
    @click = "showChildren = !showChildren">

    <!-- header -->
    <div
      class="header-label flex items-center cursor-pointer relative px-5 py-2"
      :class="[
        {'text-white bg-primary-gradient header-active': isHeaderActive},
        {'header-open': isHovered || showChildren}
        ]">
      <feather-icon :icon="header.icon" svgClasses="h-5 w-5" class="mr-3" />
      <span class="whitespace-no-wrap">{{ $t(header.i18n) || header.header }}</span>
      <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" class="ml-1" />
    </div>

    <!-- Children -->
    <transition name="fade-top-2x">
      <ul class="header-children h-nav-menu-dd shadow-drop text-intial absolute shadow-lg py-2" :class="{'dd-right': dropRight}" v-show="showChildren" ref="headerDropdown">
        <li v-for="(item, index) in header.items" :key="item.name">
          <template v-if="!item.submenu">
            <h-nav-menu-item
              :to="item.slug != 'external' ? item.url : ''"
              :href="item.slug == 'external' ? item.url : ''"
              :icon="item.icon" :target="item.target"
              :isDisabled="item.isDisabled"
              :slug="item.slug">
                <span class="truncate">{{ $t(item.i18n) || item.name }}</span>
                <vs-chip :color="item.tagColor" v-if="item.tag">{{ item.tag }}</vs-chip>
            </h-nav-menu-item>
          </template>
          <template v-else>
            <h-nav-menu-group
              openHover
              :key="`group-${index}`"
              :group="item"
              :groupIndex="index"
              :open="checkGrpChildrenActive(item)" />
          </template>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
import HNavMenuGroup from './HorizontalNavMenuGroup.vue'
import HNavMenuItem from './HorizontalNavMenuItem.vue'

export default {
  props: {
    header: {
      type: Object,
      requried: true
    },
    openOnHover: {
      type: Boolean,
      default: true
    }
  },
  components: {
    HNavMenuGroup,
    HNavMenuItem
  },
  data () {
    return {
      showChildren: false,
      isHovered: false,
      dropRight: false
    }
  },
  computed: {
    isHeaderActive () {
      const path        = this.$route.fullPath
      let active        = false
      const routeParent = this.$route.meta ? this.$route.meta.parent : undefined

      this.header.items.forEach((item) => {

        // If item is group
        if (item.submenu) {
          if (this.checkGrpChildrenActive(item)) { active = true }
        } else if (item.url) {
          if (path === item.url || routeParent === item.slug) { active = true }
        }
      })

      return active
    }
  },
  watch: {
    showChildren () {
      this.$nextTick(() => {
        if (this.showChildren) {
          const dd = this.$refs.headerDropdown
          if (dd.getBoundingClientRect().left + dd.offsetWidth - (window.innerWidth - 16) >= 0) {
            this.dropRight = true
          }
        }
      })
    }
  },
  methods: {
    checkGrpChildrenActive (group) {

      const path        = this.$route.fullPath
      let active        = false
      const routeParent = this.$route.meta ? this.$route.meta.parent : undefined

      if (group.submenu) {
        group.submenu.forEach((item) => {
          if ((path === item.url || routeParent === item.slug) && item.slug) active = true
          else if (item.submenu) { if (this.checkGrpChildrenActive(item)) active = true }
        })
      }

      return active
    },
    hovered (val = true) {
      this.isHovered = val
      if (this.openOnHover) {
        val ? this.showChildren = true : this.showChildren = false
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/components/horizontalNavMenuHeader.scss";
</style>
