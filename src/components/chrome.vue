<template>
  <div>
    <div class="row q-gutter-md fixed bg-grey-10 q-pb-md shadow-4" ref="triggersCnt" style="width:100%;z-index:10; ">
      <q-btn color="cyan-6" outline icon="mdi-code-tags" label="Dev Tools" @click="sendTrigger(triggers.devTools)"></q-btn>
      <q-btn color="cyan-6" outline label="Close Tab" @click="sendTrigger(triggers.closeTab)"></q-btn>
    </div>
    <q-list :style="triggersTrayPadding()">
      <div
      v-for="(tab, i) in tabs"
      :key="i"
      >
      <q-item
        @click="$io.emit('chrome.switchTab', i + 1)"
        :active="tab.active"
        active-class="text-cyan-6"
        class="q-my-sm"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-avatar
            :color="tab.active ? 'cyan-6' : 'grey-8'"
            text-color="white"
          >
            {{ tab.active ? "A" : "T" }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="ellipsis">{{ tab.title }}</q-item-label>
          <q-item-label class="text-grey-8" caption lines="1">{{
            tab.url
          }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="close" color="grey-7" />
        </q-item-section>
      </q-item>
      <q-separator spaced inset="item" color="grey-9" />
      </div>

    </q-list>
  </div>
</template>

<script>
export default {
  name: 'ChromeWidget',
  data () {
    return {
      tabs: [],
      triggers: {
        devTools: 'E135CC25-B6C4-4429-925D-6809B29AF860',
        closeTab: 'D2F67E0B-C9D1-4FB0-9080-41BD6E13EB4A'
      }
    }
  },
  methods: {
    triggersTrayPadding () {
      if (this.$refs.triggersCnt) {
        return { paddingTop: this.$refs.triggersCnt.clientHeight + 'px' }
      }
      return { paddingTop: '68px' }
    }
  },
  beforeCreate () {
    this.$io.on('chromeTabs', data => {
      console.log('tabs')
      this.tabs = data
    })
  },
  beforeDestroy () {
    this.$io.off('chromeTabs')
  }
}
</script>

<style lang="scss" scoped>
</style>
