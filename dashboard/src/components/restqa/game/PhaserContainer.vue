<template>
  <div style="height: 600px" :id="containerId" />
</template>

<script>
import { nextTick } from 'vue'

export default {
  async setup() {
    return {
      gameInstance: null,
      containerId: 'game-container', 
      game: await import(/* webpackChunkName: "game" */ '@/services/game/main')
    }
  },
  mounted () {
    nextTick(() => {
      this.gameInstance = this.game.launch(this.containerId)
    })
  },
  unmounted () {
    this.gameInstance.destroy(false)
  }

}
</script>

