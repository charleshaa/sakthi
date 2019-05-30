<template>
  <q-bar
    dense
    v-if="system.cpu.currentload && activeApp && network"
    class="bg-black text-white system-stats"
  >
    <div>
      {{ activeApp.name }}
    </div>
    <q-space></q-space>
    <div v-if="network && parseFloat(network.up) > 1000" class="text-deep-orange-13 net-up" style="font-size: 10px;">
      <span class="label"><q-icon name="mdi-arrow-up"></q-icon></span>
      <span class="value">{{ network.up }}/s</span>
    </div>
    <div v-if="network" class="text-white net-down">
      <q-icon name="mdi-lan-pending"></q-icon>
      <span class="label q-ml-sm"><q-icon name="mdi-arrow-down"></q-icon></span>
      <span class="value">{{ network.down }}/s</span>
    </div>
    <div v-if="system.battery.percent" class="text-white">
      <span class="label"
        ><q-icon :name="batteryIcon(system.battery)"></q-icon
      ></span>
      <span class="value q-mx-sm">{{ system.battery.percent }}%</span>
      <span
        class="text-grey-9 text-weight-light"
        v-if="!system.battery.acconnected"
        >({{ system.battery.timeremaining }}min left)</span
      >
    </div>
    <div>
      <la-cartesian
        :padding="[4, 0, 4, 0]"
        :width="40"
        :bound="[0, loadMax]"
        :height="24"
        :data="loadHistory"
      >
        <la-area
          :width="2"
          curve
          animated
          prop="value"
          :fillColor="system.cpu.currentload > 30 ? 'orange' : '#424242'"
          :color="system.cpu.currentload > 30 ? 'orange' : 'lightgreen'"
        >
        </la-area>
      </la-cartesian>
    </div>
    <div :class="'text-' + percentColor(system.cpu.currentload)">
      <span class="value">{{ system.cpu.currentload.toFixed(2) }}%</span>
    </div>
    <div class="text-white">
      <span class="label"><q-icon name="mdi-memory"></q-icon></span>
      <span class="value q-mx-sm"
        >{{ (system.memory.used / 1000000000).toFixed(1) }}G /
        {{ (system.memory.total / 1000000000).toFixed(0) }}G</span
      >
    </div>

  </q-bar>
</template>

<script>
export default {
  name: 'StatusBar',
  props: {
    activeApp: {
      required: true,
      type: Object
    }
  },
  data () {
    let baseLoad = []
    for (let i = 0; i < 20; i++) {
      baseLoad[i] = { value: 30 }
    }
    return {
      system: {
        cpu: {},
        memory: {},
        battery: {}
      },
      loadMax: 0,
      loadHistory: baseLoad
    }
  },
  methods: {
    batteryIcon (val) {
      if (val.acconnected) return 'mdi-power-plug'
      const str = val.percent.toFixed(0)
      const level = str.length === 2 ? str[0] + '0' : str
      return 'mdi-battery-' + level
    },
    percentColor (val, type = 'positive', vibrance = 6) {
      if (type === 'positive') {
        if (val >= 0 && val < 33) return 'white'
        if (val >= 33 && val < 66) return 'amber-' + vibrance
        return 'red-' + vibrance
      } else {
        if (val >= 0 && val < 20) return 'red-' + vibrance
        if (val >= 20 && val < 40) return 'amber-' + vibrance
        return 'green-' + vibrance
      }
    }
  },
  beforeCreate () {
    this.$io.on('network', data => {
      this.network = {
        down: (data[0].rx_sec / 3000).toFixed(1) + ' kb',
        up: (data[0].tx_sec / 3000).toFixed(1) + ' kb'
      }
    })
    this.$io.on('system', data => {
      this.system = { ...this.system, ...data }
      this.loadHistory.push({ value: data.cpu.currentload })
      if (data.cpu.currentload > this.loadMax) {
        this.loadMax = data.cpu.currentLoad
      }
      if (this.loadHistory.length >= 20) {
        this.loadHistory.shift()
      }
    })
    this.$io.on('battery', data => {
      this.system.battery = data
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
