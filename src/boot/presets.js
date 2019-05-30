// import something here
import axios from 'axios'
const triggerTypes = {
  629: 'button',
  644: 'swipeLeftTwo',
  645: 'swipeRightTwo',
  647: 'swipeRightThree'
}
import { Laue } from 'laue'

// "async" is optional
export default async ({ Vue }) => {
  const data = require('src/assets/presets.json')
  const presets = data.BTTPresetContent

  let btt = {
    presets: presets,
    POLL_RATE: 10000,
    currentApp: undefined,
    serverUrl: `${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}/api`,
    endpoints: {
      triggerActions: '/trigger'
    },
    getCurrentApp () {
      return axios.get(this.serverUrl + '/wutup').then(res => {
        const app = res.data.split(':')
        this.currentApp = {
          name: app[1],
          id: app[0] }
        return this.currentApp
      })
    },
    getAppPresets (app = 'BT.G') {
      const p = this.presets.find(a => a.BTTAppBundleIdentifier === app)
      return p ? p.BTTTriggers : []
    },
    getAppTouchbarTriggers (app = 'BT.G') {
      const presets = this.getAppPresets(app)
      return presets.filter(
        preset => preset.BTTTriggerClass === 'BTTTriggerTypeTouchBar'
      )
    },
    getTouchbarButtons (app = 'Global', uuid) {
      const triggers = this.getAppTouchbarTriggers(app)
      const trg = triggers.find(t => t.BTTUUID === uuid)
      const _isParent = !!(
        trg.BTTAdditionalActions && trg.BTTAdditionalActions.length
      )
      const btn = {
        displayName: trg.BTTPredefinedActionName,
        uuid: trg.BTTTUUID,
        buttonText: trg.BTTTouchBarButtonName,
        order: trg.BTTOrder,
        iconData: trg.BTTIconData,
        isParent: _isParent,
        children: _isParent ? trg.BTTAdditionalActions : false
      }
      return btn
    },
    /**
     * Returns a more descriptive and light preset
     * @param {Object} p Raw BTT preset
     */
    normalize (p) {
      const obj = {
        actionName: p.BTTPredefinedActionName,
        name: p.BTTTouchBarButtonName,
        uuid: p.BTTUUID,
        buttonText: p.BTTTouchBarButtonName,
        order: p.BTTOrder,
        iconData: p.BTTIconData,
        isParent: !!(p.BTTAdditionalActions && p.BTTAdditionalActions.length),
        children: p.BTTAdditionalActions || [],
        type: triggerTypes[p.BTTTriggerType],
        typeDesc: p.BTTTriggerTypeDescription
      }
      return obj
    }
  }

  Vue.use(Laue)
  Vue.mixin({
    data () {
      return {
        isHooked: false
      }
    },
    methods: {
      sendTrigger (t) {
        this.$axios
          .post(
            this.$presets.serverUrl + this.$presets.endpoints.triggerActions,
            {
              uuid: t
            }
          )
          .then(res => {
            console.log(res)
          })
      }
    }

  })
  Vue.prototype.$presets = btt

  // something to do
}
