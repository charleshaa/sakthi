<template>
  <div class="row q-gutter-md q-pa-md">
    <q-knob
      show-value
      class="text-white q-ma-md"
      v-model="brightness"
      size="90px"
      :thickness="0.2"
      color="grey-4"
      center-color="black"
      track-color="grey-9"
      @input="changeBrightness"
    >
      <q-icon name="mdi-white-balance-sunny" />
    </q-knob>
    <q-knob
      show-value
      class="text-white q-ma-md"
      v-model="volume"
      size="90px"
      :thickness="0.2"
      color="grey-4"
      center-color="black"
      track-color="grey-9"
      @change="changeVolume"
    >
      <q-icon name="mdi-volume-high" />
    </q-knob>
    <q-knob
      show-value
      class="text-white q-ma-md"
      v-model="backlight"
      size="90px"
      :thickness="0.2"
      color="grey-4"
      center-color="black"
      track-color="grey-9"
    >
      <q-icon name="mdi-keyboard-outline" />
    </q-knob>
  </div>
</template>

<script>
export default {
  name: 'BasicControls',
  data () {
    return {
      brightness: 100,
      volume: 100,
      backlight: 100
    }
  },
  methods: {
    changeBrightness (val) {
      this.$io.emit('brightness', val)
    },
    changeVolume (val) {
      this.$io.emit('volume', val)
    },
    toggleVolume () {
      if (this.volume > 0) {
        this.volume = 0
        this.changeVolume(0)
      } else {
        this.volume = 10
        this.changeVolume(10)
      }
    }
  }
}
</script>

<style>
</style>
