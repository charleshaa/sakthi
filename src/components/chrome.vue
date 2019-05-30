<template>
  <div>
    <div class="row q-gutter-md">
      <q-btn color="white" flat label="Dev Tools" @click="sendTrigger(triggers.devTools)"></q-btn>
      <q-btn color="white" flat label="Close Tab" @click="sendTrigger(triggers.closeTab)"></q-btn>
    </div>
    <q-separator spaced color="grey-9"></q-separator>
    <q-list>
      <q-item
        @click="$io.emit('chrome.switchTab', i + 1)"
        v-for="(tab, i) in tabs"
        :key="i"
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
