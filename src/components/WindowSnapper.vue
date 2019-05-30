<template>
  <div>
    <div
      :style="zoneStyle"
      v-touch-swipe="snap"
      @touchend="snapEnd"
      class="snap-zone bg-grey-9 column items-center justify-center"
      ref="snapZone"
    >
      <div class="self-center">
        <q-icon size="48px" name="mdi-arrow-expand-all"></q-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WindowSnapper',
  props: ['width', 'height'],
  data () {
    return {
      lastSwipe: undefined,
      lastEvent: undefined
    }
  },
  methods: {
    snap (e) {
      console.log('Got swiped ' + e.direction)
      this.lastSwipe = e
    },
    snapEnd (e) {
      const touches = {
        prev: this.lastSwipe.evt.touches[0],
        now: e.changedTouches[0]
      }
      let dirX
      const ratioX = (touches.now.clientX - touches.prev.clientX) / this.width
      const ratioY = (touches.prev.clientY - touches.now.clientY) / this.height
      if (
        this.lastSwipe.direction === 'up' ||
        this.lastSwipe.direction === 'down'
      ) {
        if (ratioX > 0.5) {
          // diagonal right
          dirX = 'right'
        } else if (ratioX < -0.5) {
          // Diagonal left
          dirX = 'left'
        } else {
          dirX = false
        }
      }
      if (
        this.lastSwipe.direction === 'left' ||
        this.lastSwipe.direction === 'right'
      ) {
        if (ratioY > 0.5) {
          // diagonal right
          dirX = 'up'
        } else if (ratioY < -0.5) {
          // Diagonal left
          dirX = 'down'
        } else {
          dirX = false
        }
      }

      let ret = this.lastSwipe.direction
      if (dirX) ret += '-' + dirX
      this.lastEvent = {
        ...this.lastSwipe,
        evt: undefined,
        myEvent: ret,
        ratios: { x: ratioX, y: ratioY }
      }
      let dirID
      switch (ret) {
        case 'up-left':
        case 'left-up':
          dirID = 'BD8C4100-7839-4949-9B1A-0334F1F54450'
          break
        case 'down-left':
        case 'left-down':
          dirID = 'A907EBDB-3B1E-44DC-A230-93E549CD1BE8'
          break
        case 'up-right':
        case 'right-up':
          dirID = '575E7F5C-C559-4EBC-AD20-9EAF63E6379A'
          break
        case 'down-right':
        case 'right-down':
          dirID = '5A431F96-B3E8-4167-8AD6-E8BE0B942393'
          break
        case 'up':
          dirID = '4FC71B27-ECE4-4481-A2B0-647663A37C5D'
          break
        case 'down':
          dirID = '2AEDA535-A066-4F74-A4CA-A872B43444BB'
          break
        case 'left':
          dirID = '0865F431-972B-4365-B2D7-1B753419C81D'
          break
        case 'right':
          dirID = '646E315A-ACBC-42BF-B2B9-E7308C13662D'
          break
        default:
          dirID = ''
      }

      this.sendTrigger(dirID)
    }
  },
  computed: {
    zoneStyle () {
      return {
        width: this.width + 'px',
        height: this.height + 'px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.snap-zone {
  height: 100%;
  width: 100%;
}
</style>
