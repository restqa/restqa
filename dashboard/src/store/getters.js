const getters = {
  windowBreakPoint: state => {

    // This should be same as tailwind. So, it stays in sync with tailwind utility classes
    if (state.windowWidth >= 1200) return 'xl'
    else if (state.windowWidth >= 992) return 'lg'
    else if (state.windowWidth >= 768) return 'md'
    else if (state.windowWidth >= 576) return 'sm'
    else return 'xs'
  },

  scrollbarTag: state => {
    return state.is_touch_device ? 'div' : 'VuePerfectScrollbar'
  }
}

export default getters
