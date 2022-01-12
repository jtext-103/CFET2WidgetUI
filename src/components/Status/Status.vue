<template>

  <div  class="container" id="RightClick" style="margin-top: 30px;">

    <div class="columns content " v-bind:class="EditData.props.titleSize" style="margin-bottom: 0px;padding-left: 7px;">
      <div class="column content-table-cell-heading-color is-narrow" style="margin: 0px;padding: 0px;">
        <h3>{{EditData.props.title}}</h3>
      </div>

    </div>

    <div class="columns" style="margin-bottom: 0px;">
      <div class="column is-four-sixths is-offset-one-sixth gauge" ref="gauge" style="height: 250px;overflow:auto;"></div>
    </div>

    <div style=" display: flex; justify-content: center;">

      <!--<div class="column is-four-sixths is-offset-one-sixth" style="overflow:auto;">-->
      <div v-bind:style="{ color: activeColor, fontSize: EditData.props.fontSize + 'px' }" >{{ StatusValue }}</div>
      <div style="margin-left: 5px;" v-if="EditData.edit.isShowStateVlaue" v-bind:style="{ color: activeColor, fontSize: EditData.props.fontSize + 'px' }" >{{EditData.props.unit}}</div>

    </div>
    <rightClickMenu ref="rightClickMenu" @del="del" @openWindows="openWindows"></rightClickMenu>

  </div>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import { Prop, Watch, Vue } from 'vue-property-decorator'
import { Widget } from '../Base/widget'
import { EditData } from '../Base/EditData'
import { WidgetConfig } from '../Base/WidgetConfig'
import rightClickMenu from '../Common/rightClickMenu.vue'
import { Gauge } from '@antv/g2plot'
import { UpdatePayload } from '../Base/UpdatePayload'

  @Component({
    components: {
      rightClickMenu
    }
  })
export default class Status extends Widget {
    WidgetComponentName = 'Status';
    @Prop() index: number; // 这里回头检查下!:
    @Prop() refIndex: number;
    gaugeTicks:number[]=[0, 0.2, 0.4, 0.75, 1];
    gauge: object;
    value:number = 0;
    tempValue:number = 0;
    activeColor:string = '';
    gaugeColor:string[] = ['red', 'yellow', 'green'];
    StatusValue: string = 'undefined';
    config: WidgetConfig = {
      WidgetComponentName: 'Status',
      data: {
        url: '',
        displayname: '',
        userInputData: ''
      }
    };

    EditData = {
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
    };

    mounted () {
      this.gauge = new Gauge(this.$refs.gauge, {
        percent: 0,
        range: {
          ticks: [0, 0.2, 0.4, 0.75, 0.8, 1],
          color: ['red', 'yellow', 'green', 'yellow', 'red']
        },
        statistic: {
          content: {
            formatter: ({ percent }) => ''
          }
        }
      })

      this.gauge.render()
      // this.timer = setInterval(this.refresh, 1000);
    }

    del () {
      console.log('del')
      this.$emit('del', this.index)
    }

    ParsingStateNum () {
      var StatusNum = parseFloat(this.StatusValue)
      console.log(StatusNum)
      this.value = parseFloat((StatusNum - this.EditData.props.StateIndicatorFile.min) / (this.EditData.props.StateIndicatorFile.max - this.EditData.props.StateIndicatorFile.min))
      this.gaugeTicks[0] = 0
      this.gaugeTicks[1] = parseFloat((this.EditData.props.StateIndicatorFile.ll - this.EditData.props.StateIndicatorFile.min) / (this.EditData.props.StateIndicatorFile.max - this.EditData.props.StateIndicatorFile.min))
      this.gaugeTicks[2] = parseFloat((this.EditData.props.StateIndicatorFile.l - this.EditData.props.StateIndicatorFile.min) / (this.EditData.props.StateIndicatorFile.max - this.EditData.props.StateIndicatorFile.min))
      this.gaugeTicks[3] = parseFloat((this.EditData.props.StateIndicatorFile.h - this.EditData.props.StateIndicatorFile.min) / (this.EditData.props.StateIndicatorFile.max - this.EditData.props.StateIndicatorFile.min))
      this.gaugeTicks[4] = parseFloat((this.EditData.props.StateIndicatorFile.hh - this.EditData.props.StateIndicatorFile.min) / (this.EditData.props.StateIndicatorFile.max - this.EditData.props.StateIndicatorFile.min))
      this.gaugeTicks[5] = 1
      this.gauge.options.percent = this.value
      console.log(this.value)
      this.gauge.options.range = {
        ticks: this.gaugeTicks,
        color: ['red', 'yellow', 'green', 'yellow', 'red']
      }

      this.gauge.render()

      if (this.StatusValue >= parseFloat(this.EditData.props.StateIndicatorFile.hh)) {
        this.activeColor = 'red'
      } else if (this.StatusValue >= parseFloat(this.EditData.props.StateIndicatorFile.h) && this.StatusValue < parseFloat(this.EditData.props.StateIndicatorFile.hh)) {
        this.activeColor = 'yellow'
      } else if (this.StatusValue >= parseFloat(this.EditData.props.StateIndicatorFile.l) && this.StatusValue < parseFloat(this.EditData.props.StateIndicatorFile.h)) {
        this.activeColor = 'green'
      } else if (this.StatusValue >= parseFloat(this.EditData.props.StateIndicatorFile.ll) && this.StatusValue < parseFloat(this.EditData.props.StateIndicatorFile.l)) {
        this.activeColor = 'yellow'
      } else if (this.StatusValue <= parseFloat(this.EditData.props.StateIndicatorFile.ll)) {
        this.activeColor = 'red'
      } else {
        this.activeColor = 'black'
      }
    }

    updateUI () {
      this.isShowPath = false
      super.updateUI()
    }

    openMenu (e) {
      this.$refs.rightClickMenu.openMenu(e)
    }

    openWindows () {
      super.openWindows()
    }

    getConfig () {
      return super.getConfig()
    }

    setConfig (setConfigData: [WidgetConfig, object], fragment:string) {
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
      await super.getData(url)
      this.StatusValue = this.sample.CFET2CORE_SAMPLE_VAL
      if (this.StatusValue === undefined || typeof this.StatusValue !== 'number') {
        this.StatusValue = 'undefined'
      }
    }

    async viewLoad (Args: UpdatePayload) {
      super.viewLoad(Args)
      await this.getData(this.pathwithVar)
      this.ParsingStateNum()
      // if (typeof this.StatusValue === 'number') {
      //  this.ParsingStateNum()
      // }
    }

    parentUpdate (payload: UpdatePayload): void {
      super.parentUpdate(payload)
      this.viewLoad(this.EditData.params.Args)
    }
}
</script>

<style scoped>

</style>
