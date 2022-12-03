<template>
  <div  class="container" id="RightClick" style="margin-top: 30px;">
    <div class="columns content" v-bind:class="EditData.props.titleSize" style="margin-bottom: 0; padding-left: 7px;">
      <div class="column content-table-cell-heading-color is-narrow" style="margin: 0; padding: 0;">
        <h3>{{EditData.props.title}}</h3>
      </div>
    </div>
    <div class="columns" style="margin-bottom: 0;">
      <div class="column is-four-sixths is-offset-one-sixth" ref="line" style="height: 250px; overflow:auto;"></div>
    </div>
    <div style=" display: flex; justify-content: center;">
      <div v-bind:style="{ color: activeColor, fontSize: EditData.props.fontSize + 'px' }" >{{ StatusValue }}</div>
      <div style="margin-left: 5px;" v-if="EditData.edit.isShowStateVlaue" v-bind:style="{ color: activeColor, fontSize: EditData.props.fontSize + 'px' }" >{{EditData.props.unit}}</div>
    </div>
    <rightClickMenu ref="rightClickMenu" @del="del" @openWindows="openWindows"></rightClickMenu>
  </div>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Widget } from '../Base/widget'
import { EditData } from '../Base/EditData'
import { WidgetConfig } from '../Base/WidgetConfig'
import rightClickMenu from '../Common/rightClickMenu.vue'
import { Line } from '@antv/g2plot'
import { UpdatePayload } from '../Base/UpdatePayload'

@Component({
  components: {
    rightClickMenu
  }
})

export default class DynamicLine extends Widget {
  static WidgetComponentName = 'DynamicLine'
  @Prop() index?: number
  @Prop() refIndex?: number
  dynamicLine?: Line
  dynamicLineDataStack: {x: number, y: number}[] = []
  value: number = 0
  activeColor:string = ''
  StatusValue: string = 'undefined'
  timer?: ReturnType<typeof setInterval>
  config: WidgetConfig = {
    WidgetComponentName: this.WidgetComponentName,
    data: {
      url: '',
      displayname: '',
      userInputData: ''
    }
  }

  EditData:EditData = {
    edit: {
      type: 'status',
      parseUrl: '',
      url: this.config.data.url,
      index: this.refIndex,
      isShowStateVlaue: false,
      isSubscribe: false
    },
    props: {
      fontSize: 22,
      title: '',
      titleSize: '',
      unit: '',
      StateIndicatorFile: {
        hh: 80,
        h: 75,
        l: 40,
        ll: 20,
        max: 100,
        min: 0
      }
    },
    params: {
      PokedPath: this.EditPathPoke,
      action: 'get',
      Args: {},
      tempUserInputData: {},
      shouldUpdate: false,
      userInputData: this.userInputData
    }
  }

  mounted () {
    this.dynamicLine = new Line(this.$refs.line as HTMLDivElement, {
      data: this.dynamicLineDataStack,
      padding: 'auto',
      xField: 'x',
      yField: 'y',
      xAxis: {
        type: 'time',
        mask: 'HH:MM:ss',
        tickCount: 10
      },
      smooth: true,
      point: {},
      meta: {
        x: { sync: true },
        y: { sync: true }
      }
    })
    this.dynamicLine.render()
    this.timer = setInterval(this.refresh, 1000)
  }

  del () {
    this.$emit('del', this.index)
    clearInterval(this.timer)
  }

  refresh () {
    if (this.EditData.edit.isSubscribe === false) {
      this.viewLoad(this.EditData.params.Args)
    }
  }

  updateUI () {
    this.isShowPath = false
    super.updateUI()
  }

  openMenu (e: MouseEvent) {
    this.$refs.rightClickMenu.openMenu(e)
  }

  openWindows () {
    super.openWindows()
  }

  getConfig () {
    return super.getConfig()
  }

  setConfig (setConfigData: [WidgetConfig, EditData], fragment: string) {
    super.setConfig(setConfigData, fragment)
  }

  pathPoke () {
    super.pathPoke()
  }

  samplePoke (sample: any) {
    super.samplePoke(sample)
  }

  replaceStartPath (startPath: string) {
    super.replaceStartPath(startPath)
  }

  async getData (url: string) {
    const currentTime = new Date()
    currentTime.setMilliseconds(0)
    await super.getData(url)
    if (!(this.sample instanceof Object)) {
      return
    }
    this.StatusValue = this.sample.CFET2CORE_SAMPLE_VAL
    this.updateDynamicLineData(currentTime.getTime(), this.StatusValue)
    if (this.dynamicLine === undefined) {
      this.mounted()
    } else {
      this.dynamicLine.changeData(this.dynamicLineDataStack)
    }
  }

  updateDynamicLineData (x: number, y: string, len: number = 10) {
    if (this.dynamicLineDataStack.length === len) {
      this.dynamicLineDataStack.shift()
    }
    this.dynamicLineDataStack.push({ x: x, y: parseInt(this.StatusValue) })
  }

  async viewLoad (Args: UpdatePayload) {
    super.viewLoad(Args)
    await this.getData(this.pathwithVar)
  }

  parentUpdate (payload: UpdatePayload): void {
    super.parentUpdate(payload)
    this.viewLoad(this.EditData.params.Args)
  }
}
</script>

<style scoped>

</style>
