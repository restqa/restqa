<template>
  <div
    class  = "h-nav-group relative"
    :class = "[
      {'h-nav-group-open'            : openItems        },
      {'h-nav-group-active'          : open             },
      {'disabled-item pointer-events-none': group.isDisabled }
    ]"
    @mouseover = "mouseover"
    @mouseleave  = "mouseout">

      <!-- Group Label -->
      <div class="group-header w-full flex items-center">
        <span class="flex items-center w-full">

          <!-- Group Icon -->
          <feather-icon
            v-if        = "group.icon  || (this.groupIndex > Math.floor(this.groupIndex))"
            :icon       = "group.icon  || 'CircleIcon'"
            :svgClasses = "iconClasses" />

          <!-- Group Name -->
          <span class="truncate mr-3 select-none">{{ $t(group.i18n) || group.name }}</span>
        </span>

        <!-- Group Collapse Icon -->
        <feather-icon
          :class     = "[{'rotate90' : openItems}, 'feather-grp-header-arrow']"
          :icon       = "bottom ? 'ChevronDownIcon' : $vs.rtl ? 'ChevronLeftIcon' : 'ChevronRightIcon'"
          svg-classes= "w-4 h-4" />
      </div>
      <!-- /Group Label -->

      <!-- Group Items -->
      <transition name="fade-bottom-2x">
      <ul :style="styleItems" class="h-nav-group-items h-nav-menu-dd absolute shadow-drop py-2" v-show="openItems" ref="childDropdown">
        <li v-for="(groupItem, index) in group.submenu" :key="index">

          <h-nav-menu-group
            v-if        = "groupItem.submenu"
            :group      = "groupItem"
            :groupIndex = "Number(`${groupIndex}.${index+1}`)"
            :open       = "isGroupActive(groupItem)"
            :openHover  = "openHover" />


          <h-nav-menu-item
            v-else
            icon-small
            :index  = "groupIndex + '.' + index"
            :to     = "groupItem.slug !== 'external' ? groupItem.url : null"
            :href   = "groupItem.slug === 'external' ? groupItem.url : null"
            :icon   = "itemIcon"
            :slug   = "groupItem.slug"
            :target = "groupItem.target">
              <span class="truncate">{{ $t(groupItem.i18n) || groupItem.name }}</span>
              <vs-chip class="ml-auto" :color="groupItem.tagColor" v-if="groupItem.tag">{{ groupItem.tag }}</vs-chip>
          </h-nav-menu-item>

        </li>
      </ul>
      </transition>
      <!-- /Group Items -->
  </div>
</template>


<script>
// import VNavMenuItem from './VerticalNavMenuItem.vue'
import HNavMenuItem from './HorizontalNavMenuItem.vue'

export default {
  name  : 'h-nav-menu-group',
  props : {
    openHover  : { type: Boolean, default: true },
    open       : { type: Boolean, default: false },
    group      : { type: Object },
    groupIndex : { type: Number },
    bottom     : { type: Boolean, default: false }
  },
  components: {
    HNavMenuItem
  },
  data: () => ({
    openItems : false,
    hovered: false,
    dropLeft: false
  }),
  computed: {
    iconClasses () {
      let classes = 'mr-3 '
      classes += this.groupIndex % 1 !== 0 ? 'w-3 h-3' : 'w-5 h-5'
      return classes
    },
    styleItems () {
      const style = {}
      if (this.bottom) {
        style.top = '100%'
        style.left = '0'
      } else {
        style.top = '12px'
        style.left = '100%'
      }

      if (this.dropLeft) {
        style.left = null
        style.right = '100%'
      }

      if (this.$vs.rtl) {
        const temp = style.left
        style.left = style.right
        style.right = temp
      }

      return style
    },
    itemIcon () {
      // return (index) => {
      //   // if (!((index.match(/\./g) || []).length > 1)) return "CircleIcon"
      // }
      return 'CircleIcon'
    },
    isGroupActive () {
      return (item) => {
        const path        = this.$route.fullPath
        let open          = false
        const routeParent = this.$route.meta ? this.$route.meta.parent : undefined

        const func = (item) => {
          if (item.submenu) {
            item.submenu.forEach((item) => {
              if ((path === item.url || routeParent === item.slug) && item.url) { open = true } else if (item.submenu) { func(item) }
            })
          }
        }

        func(item)
        return open
      }
    }
  },
  watch: {
    hovered (val) {
      this.$nextTick(() => {
        if (val) {
          const dd = this.$refs.childDropdown

          if (window.innerHeight - dd.getBoundingClientRect().top - dd.getBoundingClientRect().height - 28 < 1) {
            const maxHeight = window.innerHeight - dd.getBoundingClientRect().top - 70
            dd.style.maxHeight = `${maxHeight}px`
            dd.style.overflowY = 'auto'
            dd.style.overflowX = 'hidden'
          }

          if (dd.getBoundingClientRect().left + dd.offsetWidth - (window.innerWidth - 16) >= 0 || this.$parent.dropLeft) {
            this.dropLeft = true
          }

          if (this.$vs.rtl) {
            if (dd.getBoundingClientRect().right - dd.offsetWidth - 16 < 0) {
              this.dropLeft = true
            }
          }
        } else {
          this.dropLeft = false
        }
      })
    }
  },
  methods: {
    mouseover () {
      this.hovered = true
      if (this.openHover) {
        this.showChildren()
      }
    },
    mouseout () {
      this.hovered = false
      if (this.openHover) {
        this.showChildren(false)
      }
    },
    showChildren (val = true) {
      this.openItems = val
    }
  }
}

</script>

<style lang="scss">
@import "@/assets/scss/vuexy/components/horizontalNavMenuGroup.scss"
</style>
