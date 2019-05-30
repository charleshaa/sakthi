<template>
  <q-page class="bg-grey-10 text-grey-5">
    <status-bar v-if="activeApp" :activeApp.sync="activeApp"></status-bar>
    <div class="">
      <div class="row q-col-gutter-md q-px-md q-py-md app-viewport">
        <div class="col-6 app-col scroll" v-if="activeApp">
          <chrome-widget
            v-if="activeApp.id === 'com.google.Chrome'"
          ></chrome-widget>
          <div v-if="customApps.indexOf(activeApp.id) < 0" class="app-triggers row q-col-gutter-md">
            <div
              v-for="btn in currentAppPresets"
              :key="btn.uuid"
              style="height: 100px;"
              class="col-4 "
            >
              <div
              class="bg-grey-9 relative-position column items-center justify-center rounded-borders"
              style="height: 100%; width: 100%"
              v-ripple
              @click="sendTrigger(btn.uuid)"
              ><div>{{ btn.buttonText }}</div></div>
            </div>
          </div>
        </div>
        <div class="col-6">
          <window-snapper
            :width="snapWidth"
            :height="snapWidth"
          ></window-snapper>
          <q-card v-if="music" class="bg-black text-grey-3" style="width: 100%">
            <q-linear-progress
              :value="music.time / music.duration"
              color="lime"
            />

            <q-card-section class="row items-center no-wrap">
              <q-avatar rounded size="40px" class="q-mr-md">
                <img :src="music.cover" alt="" />
              </q-avatar>
              <div>
                <div class="text-weight-bold">{{ music.song }}</div>
                <div class="text-grey">{{ music.artist }}</div>
              </div>

              <q-space />

              <q-btn
                @click="sendTrigger('2A7CA79A-6C1B-4C7F-B041-9C5088B356F7')"
                flat
                round
                icon="fast_rewind"
              />
              <q-btn
                @click="sendTrigger('FA60F84B-8177-4944-858F-41CDF1280E57')"
                flat
                round
                :icon="music.state === 'paused' ? 'play_arrow' : 'pause'"
              />
              <q-btn
                @click="sendTrigger('4057C0CD-CB1F-41A1-A036-69F5035FFED3')"
                flat
                round
                icon="fast_forward"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
// let gotit = false
import WindowSnapper from 'components/WindowSnapper'
import ChromeWidget from 'components/chrome'
import StatusBar from 'components/statusBar'
import { dom } from 'quasar'
const { width } = dom
export default {
  name: 'PageIndex',
  components: {
    'window-snapper': WindowSnapper,
    'chrome-widget': ChromeWidget,
    'status-bar': StatusBar
  },
  data () {
    const gp = this.$presets.getAppTouchbarTriggers()
    const btns = gp.map(this.$presets.normalize)
    return {
      ioReady: false,
      globalPresets: btns.map(p => ({
        ...p,
        children: p.children.map(this.$presets.normalize)
      })),
      currentAppPresets: [],
      displayBrightness: 100,
      volume: 20,
      customApps: ['com.google.Chrome'],
      playingInterval: undefined,
      activeTab: undefined,
      activeApp: undefined,
      music: undefined
    }
  },
  watch: {
    activeApp (now, before) {
      if (now !== before) {
        this.currentAppPresets = this.$presets
          .getAppPresets(now.id)
          .map(this.$presets.normalize).filter(p => !p.isParent)
      }
    }
  },
  mounted () {
    if (!this.ioReady) {
      this.$io.on('spotify', data => {
        let m = { ...data }
        m.duration = Math.ceil(m.duration / 1000)
        m.time = Math.ceil(m.time)
        m.cover = this.$presets.serverUrl.replace(
          '/api',
          '/spotify_cover.png?' + Math.random()
        )
        this.music = m
        if (this.music.state === 'playing' && !this.playingInterval) {
          this.playingInterval = setInterval(() => this.music.time++, 1000)
        } else {
          clearInterval(this.playingInterval)
        }
      })
      this.$io.on('activeApp', r => {
        this.activeApp = r
      })
      this.ioReady = true
    }

    this.$presets.getCurrentApp().then(r => {
      this.currentApp = r.name
      this.currentAppId = r.id
    })
  },
  computed: {
    snapWidth () {
      return width(document.body) / 2 - 24
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
<style lang="stylus">
.app-viewport
  height $viewport-height !important
  overflow-y auto

.app-col
  height 100% !important
  overflow-y auto
</style>
