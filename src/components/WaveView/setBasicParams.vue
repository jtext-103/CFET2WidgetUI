<!--suppress ALL -->
<template>
  <div>

    <button class="button is-primary" @click="synchronizeRange(1)">SynchronizeX</button>
    <button class="button is-warning" @click="synchronizeRange(2)">SynchronizeY</button>
    <button class="button is-link" @click="synchronizeRange(3)">SynchronizeXY</button>

    <br>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import axios from 'axios'
import Plotly from 'plotly.js'
import PubSub from 'pubsub-js'
import { WidgetConfig } from '../Base/WidgetConfig'
import { UpdatePayload } from '../Base/UpdatePayload'
import PathProcessor from '../Base/PathProcessor'
import StrMapObjChange from '../Base/StrMapObjChange'
import { Widget } from '../Base/widget'

  @Component({
    components: {
    }
  })
export default class setBasicParams extends Vue {
    @Prop() wave!: any;
    @Prop() refIndex!:number;
    pathProcessor = new PathProcessor();
    isShowLoad: boolean = false;
    isShowCog: boolean = false;
    pathId!: string;
    userInputData = new Map<string, string>();
    tempUserInputData = new Map<string, string>();
    strMapObjChange = new StrMapObjChange();
    EditPathPoke : string = '';
    EditTimePathPoke : string = '';
    config: WidgetConfig = {
      WidgetComponentName: 'WaveView',
      data: {
        url: {
          path: '',
          timePath: ''
        },
        userInputData: '',
        position: {
          x1: '',
          x2: '',
          y1: '',
          y2: ''
        }
      }
    };

    EditData = {
      edit: {
        type: 'WavaView',
        parseUrl: '',
        path: this.config.data.url.path,
        timePath: this.config.data.url.timePath,
        index: this.refIndex,
        isShowStateVlaue: false
      },
      props: {

      },
      params: {
        PokedPath: this.EditPathPoke,
        PokedTimePath: this.EditTimePathPoke,
        action: 'get',
        Args: {},
        tempUserInputData: {},
        shouldUpdate: false,
        userInputData: this.userInputData
      }
    };


    tempUrl: string = '';
    temp: any = {};
    ExpectedDotNum:number = 1000;
    ExpansionMultiple:number = 1;
    annotations:any;
    myPlot:any;
    data_initial:any;
    xmin:any;
    xmax:any;
    nowDotNum:any;
    GetAllDot:boolean = false;

    created () {
      this.config.data.userInputData = this.userInputData
      this.getConfig = this.config
    }

    refresh () {
      /* var Args: UpdatePayload = {
        action: "get",
        variables: (this.$refs.WidgetParams as WidgetParams).getVariableValues(),
        target: ["self"]
      }; */
      this.viewLoad(Args)
    }

    pathPoke () {
      this.EditPathPoke = this.EditData.edit.path
      this.EditTimePathPoke = this.EditData.edit.timePath
      this.config.data.url.path = this.EditData.edit.path
      this.config.data.url.timePath = this.EditData.edit.timePath
      // console.log(this.EditData.edit);
      this.updateConfig()
      // console.log(this.config.data);
    }

    pathPokeTime () {
      this.EditPathPoke = this.EditData.edit.path
      this.EditTimePathPoke = this.EditData.edit.timePath
      this.config.data.url.path = this.EditData.edit.path
      this.config.data.url.timePath = this.EditData.edit.timePath
      // console.log(this.EditData.edit);
      // this.updateConfig()
      // console.log(this.config.data);
    }

    setConfig (setConfigData: [WidgetConfig, object], fragment:string): void {
      this.config = setConfigData[0]
      this.EditData = setConfigData[1]

      console.log('2')
      console.log(setConfigData)

      if (this.EditData.edit.path.search('startpath') != -1) { this.replaceStartPath(fragment) }
      if (this.EditData.edit.timePath.search('startpath') != -1) { this.replaceStartPath(fragment) }
      if (this.EditData.edit.parseUrl.search('startpath') != -1) { this.replaceStartPath(fragment) }

      var temp = this.EditData.params.tempUserInputData
      // temp = unescape(temp);
      // console.log(temp);
      temp = JSON.parse(JSON.stringify(temp))
      temp = this.strMapObjChange.objToStrMap(temp)
      // this.EditData.params.tempUserInputData = temp;

      var Args: UpdatePayload = {
        action: this.EditData.params.action,
        variables: temp,
        target: ['self']
      }

      this.EditData.params.Args = Args

      this.viewLoad(Args)
    }

    replaceStartPath (startPath: string): void {
      this.EditData.edit.parseUrl = this.EditData.edit.parseUrl.replace('$startpath$', startPath)
      this.config.data.timePath = this.config.data.timePath.replace('$startpath$', startPath)
      this.config.data.path = this.config.data.path.replace('$startpath$', startPath)
      this.EditData.edit.path = this.EditData.edit.path.replace('$startpath$', startPath)
    }

    updateUserInputData () {
      this.updateConfig()
    }

    updateConfig () {
      this.getConfig = this.config
      this.$emit('updateConfig', [this.getConfig, this.EditData])
    }

    getSampleParams (url:any) {
      this.config.data.url.path = url
      this.EditData.params.PokedPath = this.config.data.url.path
      this.EditData.params.PokedTimePath = this.config.data.url.timePath
      this.EditData.edit.path = this.config.data.url.path
      this.EditData.edit.timePath = this.config.data.url.timePath
      this.openWindows()
    }

    openWindows(){
      //windows.open -> another single page application
      var fragment = window.location.origin;
      var JsonData = JSON.stringify(this.EditData);
      var httpData = encodeURIComponent(JsonData);
      var url =fragment+"/WindowsAppIndex.html/?";
      window.open(url+httpData, "WidgetWindow",'height=400, width=800, top=200, left=400, toolbar=no');
    }

    getPathIdParams () {
      if (this.tempUrl != this.config.data.url.path) {
        if (this.config.data.userInputData !== undefined) {
          this.config.data.userInputData.clear()
        }
        this.tempUrl = this.config.data.url.path
      }
      this.updateConfig()
    }


    sampleLoad (sampleVal: any) {
      var myPlot = this.wave
      var data_initial = [
        {
          x: this.temp.dataTimeAxis,
          y: sampleVal
        }
      ]
      this.createChannelChart(myPlot, data_initial)
    }

    synchronizeRange (kind:number) {
      // console.log(kind);
      var myplot = this.wave
      var xRange = myplot.layout.xaxis.range
      var yRange = myplot.layout.yaxis.range
      if (kind == 1) {
        PubSub.publish('SynchronizeX', { xrange: xRange, yrange: yRange })
      } else if (kind == 2) {
        PubSub.publish('SynchronizeY', { xrange: xRange, yrange: yRange })
      } else if (kind == 3) {
        PubSub.publish('SynchronizeXY', { xrange: xRange, yrange: yRange })
      }
    }

    findNearest (array:number[], start:number, end:number, num:number):number {
      var midIndex:number = (start + end) / 2
      midIndex = Number(midIndex.toFixed(0)) - 1
      if (start >= end) { return start }
      var mid = array[midIndex]
      var left = array[(midIndex - 1) < start ? start : (midIndex - 1)]
      var right = array[(midIndex + 1) > end ? end : (midIndex + 1)]
      var sm = Math.abs(num - mid)
      var sl = Math.abs(num - left)
      var sr = Math.abs(num - right)
      if (sm < sl && sm < sr) {
        return midIndex
      } else {
        var li = this.findNearest(array, start, midIndex - 1, num)
        var ri = this.findNearest(array, midIndex + 1, end, num)
        if (Math.abs(num - array[li]) < Math.abs(num - array[ri])) {
          return li
        }
        return ri
      }
    }

    async viewLoad (Args: UpdatePayload) {
      this.getConfig.data.position.x1 = ''
      this.getConfig.data.position.x2 = ''
      this.getConfig.data.position.y1 = ''
      this.getConfig.data.position.y2 = ''
      console.log('this.config.data.userInputData')
      console.log(Args.variables)
      this.config.data.userInputData = Args.variables
      this.tempUserInputData = this.config.data.userInputData
      var expectedDotNum = this.ExpectedDotNum
      var expansionMultiple = this.ExpansionMultiple

      var initialStartTime:any = this.tempUserInputData.get('startTime')
      var initialEndTime:any = this.tempUserInputData.get('endTime')
      var initialRange:any = initialEndTime - initialStartTime

      // 获取边界值
      var getLimitsInputData = this.tempUserInputData
      getLimitsInputData.set('startTime', '0') // starttime fix
      getLimitsInputData.set('endTime', '0')
      getLimitsInputData.set('count', '2')
      var timeUrl = this.pathProcessor.FillPathWithVar(
        getLimitsInputData,
        this.config.data.url.timePath
      )
      console.log(timeUrl)
      await this.getDataTimeAxis(timeUrl)
      this.xmin = this.temp.dataTimeAxis[0]
      this.xmax = this.temp.dataTimeAxis[1]
      console.log('边界')
      console.log(this.xmin)
      console.log(this.xmax)

      var expansionStartTime:any
      var expansionEndTime:any
      var expansionDotNum:any

      // 向左右扩展范围获取数据
      if (initialStartTime == 0 && initialEndTime == 0) {
        initialStartTime = this.xmin
        initialEndTime = this.xmax
        expansionStartTime = this.xmin
        expansionEndTime = this.xmax
        expansionDotNum = expectedDotNum
      } else {
        expansionStartTime = Number(initialStartTime) - expansionMultiple * initialRange >= this.xmin ? Number(initialStartTime) - expansionMultiple * initialRange : this.xmin
        expansionEndTime = Number(initialEndTime) + expansionMultiple * initialRange <= this.xmax ? Number(initialEndTime) + expansionMultiple * initialRange : this.xmax
        expansionDotNum = Math.floor(((Number(expansionEndTime) - Number(expansionStartTime)) / (Number(initialEndTime) - Number(initialStartTime))) * expectedDotNum) + 1
      }

      var getInputData = this.tempUserInputData
      getInputData.set('startTime', expansionStartTime)// starttime
      getInputData.set('endTime', expansionEndTime)
      getInputData.set('count', expansionDotNum)
      var url = this.pathProcessor.FillPathWithVar(
        getInputData,
        this.config.data.url.path
      )

      await this.getData(url)// 扩充之后去获取y的val

      // 当点不够时取全部点并重新获取y轴
      if (this.temp.data == null) {
        getInputData.set('count', '0')// 0是获取全部数据
        url = this.pathProcessor.FillPathWithVar(
          getInputData,
          this.config.data.url.path
        )
        console.log('zheli')
        console.log(url)
        await this.getData(url)
      }

      var timeUrl = this.pathProcessor.FillPathWithVar(
        getInputData,
        this.config.data.url.timePath
      )

      await this.getDataTimeAxis(timeUrl)

      var first = url.indexOf('/')
      var second = url.indexOf('/', first + 1)
      var third = url.indexOf('/', second + 1)
      var fouth = url.indexOf('/', third + 1)
      this.pathId = url.slice(third + 1, fouth)
      var thingPath = url.slice(0, url.indexOf('/', 2))
      var path = this.pathId
      var dealPath = {
        thingPath: thingPath,
        path: path
      }
      this.$emit('getPathId', dealPath)

      this.myPlot = this.wave
      this.data_initial = [
        {
          x: this.temp.dataTimeAxis,
          y: this.temp.data
        }
      ]
      var layout_initial = {
        xaxis: {
          range: [initialStartTime, initialEndTime]
        },
        yaxis: {
          range: [this.config.data.position.y1, this.config.data.position.y2]
        },
        hovermode: 'closest',
        clickmode: 'event',
        autosize: true
      }
      console.log(layout_initial)
      this.createChannelChart(this.myPlot, this.data_initial, layout_initial)
      this.updateConfig()

      PubSub.subscribe('PlotlyClick', (messageName:string, Args:any) => {
        console.log('subscribe')
        console.log(Args)
        var nearestIndex:number = this.findNearest(this.data_initial[0].x, 0, this.data_initial[0].x.length - 1, Args.x)
        console.log(nearestIndex)
        console.log(this.data_initial[0].x[nearestIndex])

        var annotate_text = 'x = ' + this.data_initial[0].x[nearestIndex] +
          'y = ' + this.data_initial[0].y[nearestIndex]
        var annotation = {
          text: annotate_text,
          x: this.data_initial[0].x[nearestIndex],
          y: this.data_initial[0].y[nearestIndex]
        }
        this.annotations = []
        this.annotations.push(annotation)

        var layout_update = {
          annotations: this.annotations
        }

        Plotly.relayout(this.myPlot, layout_update)
      })

      PubSub.subscribe('SynchronizeXY', (messageName:string, Args:any) => {
        console.log('subscribe')
        console.log(Args)

        var layout_update = {
          xaxis: {
            range: Args.xrange
          },
          yaxis: {
            range: Args.yrange
          }
        }

        Plotly.relayout(this.myPlot, layout_update)
      })

      PubSub.subscribe('SynchronizeX', (messageName:string, Args:any) => {
        console.log('subscribe')
        console.log(Args)

        var layout_update = {
          xaxis: {
            range: Args.xrange
          }
        }

        Plotly.relayout(this.myPlot, layout_update)
      })

      PubSub.subscribe('SynchronizeY', (messageName:string, Args:any) => {
        console.log('subscribe')
        console.log(Args)

        var layout_update = {
          yaxis: {
            range: Args.yrange
          }
        }

        Plotly.relayout(this.myPlot, layout_update)
      })

      this.myPlot.on('plotly_click', (data:any) => {
        // 当前区域的范围
        console.log(data.points[0].xaxis.range)
        console.log(data.points[0].yaxis.range)
        console.log(data)
        var pts = ''
        for (var i = 0; i < data.points.length; i++) {
          var annotate_text = 'x = ' + data.points[i].x +
            'y = ' + data.points[i].y.toPrecision(4)

          var annotation = {
            text: annotate_text,
            x: data.points[i].x,
            y: parseFloat(data.points[i].y.toPrecision(4))
          }

          var annotations = []
          annotations.push(annotation)

          Plotly.relayout(this.myPlot, { annotations: annotations })
          PubSub.publish('PlotlyClick', { x: data.points[i].x, y: data.points[i].y.toPrecision(4) })
        }
      })

      // 获取当前波形数据

      this.zoom()
    }

    zoom () {
      console.log('c')
      var createChannelChart = this.createChannelChart
      var addAnnotations = this.addAnnotations
      var getData = this.getData
      var getDataTimeAxis = this.getDataTimeAxis
      var getConfig = this.getConfig
      var updateConfig = this.updateConfig
      var pathProcessor = this.pathProcessor
      var zoom_xmax = this.temp.dataTimeAxis[this.nowDotNum - 1]
      var zoom_xmin = this.temp.dataTimeAxis[0]
      var zoom_ymax = this.temp.data[this.nowDotNum - 1]
      var zoom_ymin = this.temp.data[0]
      var nowRange = zoom_xmax - zoom_xmin
      var temp = this.temp

      this.myPlot.on('plotly_relayout', (data: any) => {
        var zoom_xmax = this.temp.dataTimeAxis[this.nowDotNum - 1]
        var zoom_xmin = this.temp.dataTimeAxis[0]
        var zoom_ymax = this.temp.data[this.nowDotNum - 1]
        var zoom_ymin = this.temp.data[0]
        var nowRange = zoom_xmax - zoom_xmin
        var temp = this.temp
        var config = this.config
        var tempUserInputData = this.tempUserInputData
        var expansionMultiple = this.ExpansionMultiple
        var expectedDotNum = this.ExpectedDotNum
        var expansionStartTime:any
        var expansionEndTime:any
        var expansionDotNum:any

        console.log('d')
        console.log(data)

        if (!data['xaxis.autorange'] && (data['xaxis.range[0]'] || data.xaxis)) {
          var nowZoom_xmin
          var nowZoom_xmax

          if (data.xaxis) {
            console.log('x')
            nowZoom_xmin = data.xaxis.range[0]
            nowZoom_xmax = data.xaxis.range[1]
            if (data.yaxis) {
              console.log('y')
              zoom_ymin = data.yaxis.range[0]
              zoom_ymax = data.yaxis.range[1]
            }
          } else if (data['xaxis.range[0]']) {
            nowZoom_xmin = data['xaxis.range[0]']
            nowZoom_xmax = data['xaxis.range[1]']
            zoom_ymin = data['yaxis.range[0]']
            zoom_ymax = data['yaxis.range[1]']
          }
          console.log(nowZoom_xmin)
          console.log(nowZoom_xmax)
          console.log(zoom_xmax)
          console.log(zoom_xmin)

          var x_range = nowZoom_xmax - nowZoom_xmin
          if (
            nowZoom_xmin < zoom_xmin ||
            nowZoom_xmax > zoom_xmax ||
            (((x_range / nowRange) * this.nowDotNum < expectedDotNum) && (this.GetAllDot == false))
          ) {
            this.GetAllDot = false
            expansionStartTime = Number(nowZoom_xmin) - expansionMultiple * x_range >= this.xmin ? Number(nowZoom_xmin) - expansionMultiple * x_range : this.xmin
            expansionEndTime = Number(nowZoom_xmax) + expansionMultiple * x_range <= this.xmax ? Number(nowZoom_xmax) + expansionMultiple * x_range : this.xmax
            console.log(expansionStartTime)
            console.log(expansionEndTime)
            console.log(this.nowDotNum)
            console.log((x_range / nowRange) * this.nowDotNum)

            console.log('重加载')
            console.log(expansionStartTime < zoom_xmin)
            console.log(expansionEndTime > zoom_xmax)
            console.log(expansionEndTime)
            console.log(zoom_xmax)
            console.log(((x_range / nowRange) * this.nowDotNum < expectedDotNum))
            // 重新给一遍值
            zoom_xmax = expansionEndTime
            zoom_xmin = expansionStartTime
            nowRange = zoom_xmax - zoom_xmin

            expansionDotNum = Math.floor(((Number(expansionEndTime) - Number(expansionStartTime)) / (Number(nowZoom_xmax) - Number(nowZoom_xmin))) * expectedDotNum) + 1

            var getInputData = this.tempUserInputData
            getInputData.set('startTime', expansionStartTime)// starttime
            getInputData.set('endTime', expansionEndTime)
            getInputData.set('count', expansionDotNum)

            var myplot = this.wave
            var yRange = myplot.layout.yaxis.range
            console.log(yRange)
            if (!data.yaxis && !data['yaxis.range[0]']) {
              var layout_update = {
                xaxis: {
                  range: [nowZoom_xmin, nowZoom_xmax]
                },
                yaxis: {
                  range: [yRange[0], yRange[1]]
                },
                annotations: this.annotations
              }
            } else {
              var layout_update = {
                xaxis: {
                  range: [nowZoom_xmin, nowZoom_xmax]
                },
                yaxis: {
                  range: [zoom_ymin, zoom_ymax]
                },
                annotations: this.annotations
              }
            }

            getConfig.data.position.x1 = zoom_xmin
            getConfig.data.position.x2 = zoom_xmax
            getConfig.data.position.y1 = zoom_ymin
            getConfig.data.position.y2 = zoom_ymax
            updateConfig()
            this.showPlot(getInputData, layout_update, this.myPlot)
          }
        }
      })

      this.myPlot.on('plotly_click', (data:any) => {
        // 当前区域的范围
        console.log('plotly_click')
        console.log(data.points[0].xaxis.range)
        console.log(data.points[0].yaxis.range)
        console.log(data)
        var pts = ''
        for (var i = 0; i < data.points.length; i++) {
          var annotate_text = 'x = ' + data.points[i].x +
            'y = ' + data.points[i].y.toPrecision(4)

          var annotation = {
            text: annotate_text,
            x: data.points[i].x,
            y: parseFloat(data.points[i].y.toPrecision(4))
          }

          var annotations = []
          annotations.push(annotation)
          addAnnotations(annotations)
          Plotly.relayout(this.myPlot, { annotations: annotations })
          PubSub.publish('PlotlyClick', { x: data.points[i].x, y: data.points[i].y.toPrecision(4) })
        }
      })
    }

    async showPlot (getInputData:any, layout_update:any, myPlot:any) {
      var url = this.pathProcessor.FillPathWithVar(
        getInputData,
        this.config.data.url.path
      )
      await this.getData(url)
      console.log('重加载getData')
      console.log(this.temp.data)

      // 当点不够时取全部点并重新获取y轴
      if (this.temp.data == null) {
        getInputData.set('count', '0')
        this.GetAllDot = true
        url = this.pathProcessor.FillPathWithVar(
          getInputData,
          this.config.data.url.path
        )
        await this.getData(url)
      }
      var timeUrl = this.pathProcessor.FillPathWithVar(
        getInputData,
        this.config.data.url.timePath
      )
      console.log('url+timeurl')
      console.log(url)
      console.log(timeUrl)

      await this.getDataTimeAxis(timeUrl)
      console.log('重加载getDataTimeAxis')
      console.log(this.temp.dataTimeAxis)

      var data_update = [
        {
          x: this.temp.dataTimeAxis,
          y: this.temp.data
        }
      ]
      console.log('data_update')
      console.log(data_update)
      this.createChannelChart(myPlot, data_update, layout_update)
      this.zoom()
    }

    addAnnotations (annotations:any) {
      this.annotations = annotations
    }

    createChannelChart (myPlot: any, data_update: any, data_layout: any = {}) {
      data_layout.margin = { t: 20 }

      var config = {
        modeBarButtonsToRemove: ['resetScale2d'],
        displaylogo: false
      }

      Plotly.newPlot(myPlot, data_update, data_layout, config)
    }

    async getData (url: any) {
      var apiLoad = url
      console.log('getData')
      console.log(url)
      await axios.get(apiLoad).then(response => {
        this.temp.data = response.data.CFET2CORE_SAMPLE_VAL
        console.log(response)
      })
    }

    async getDataTimeAxis (url: any) {
      var apiLoad = url
      await axios.get(apiLoad).then(response => {
        this.temp.dataTimeAxis = response.data.CFET2CORE_SAMPLE_VAL
        console.log('getDataTimeAxis')
        console.log(apiLoad)
        console.log(response)
        this.nowDotNum = response.data.CFET2CORE_SAMPLE_VAL.length
        console.log(this.nowDotNum)
      })
    }
}
</script>
<style scoped>
</style>
