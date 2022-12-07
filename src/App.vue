<template>
  <div id="app">

    <nav class="navbar is-info"  role="navigation" aria-label="main navigation">

      <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarhome">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>

      <div id="navbarhome" class="navbar-menu">
        <div class="navbar-start ">

          <div class="navbar-item has-dropdown is-hoverable navpadding">
            <a class="navbar-link ">
              Add Widget
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item"
                 v-for="(availableWidget,index) in availableWidgets"
                 :key="index"
                 v-on:click="addWidget(availableWidget)"
              >
                {{availableWidget}}
              </a>
            </div>
          </div>

          <a class="navbar-item navpadding" @click="saveWidgetList"
          >
            Save
          </a>

          <a class="navbar-item navpadding" @click="refactor"
          >
            Widget layout
          </a>

        </div>

        <div class="navbar-end uploadlocal">
          <div class="navbar-item">

            <div class="file has-name is-right is-fullwidth " id="file"
                 @change="loadTextFromFile">
              <label class="file-label" style="position: relative;left: 112px;">
                <input class="file-input" type="file" name="resume">

                <span class="file-cta" style="margin-bottom: 3.2px;margin-right: 3.2px; ">
      <span class="file-icon">
        <i class="fa fa-cloud-upload"></i>
      </span>
      <span class="file-label">
        Browse
      </span>
    </span>

                <span class="file-name filew">
     Choose a widgetTemplate file to load
    </span>
              </label>
              <div class="buttonbg"></div>
            </div>
          </div>
        </div>
      </div>

    </nav>

    <div id="appLeftClick" style="min-height: 100vh;">

      <grid-layout
        :layout.sync="widgetList"
        :col-num="30"
        :row-height="22"
        :is-draggable= isShowDrag
        :is-resizable= isShowRes
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"

        :autoSize="true"

      >

        <grid-item
          class="refactor"
          v-for="(widget,index) in widgetList"
          :x="widget.x"
          :y="widget.y"
          :w="widget.w"
          :h="widget.h"
          :i="widget.i"
          :key="widget.i"
          drag-allow-from=".vue-draggable-handle"
          drag-ignore-from=".no-drag"

        >

          <div  style="border-color: rgb(206, 212, 218);" >

            <div class=" columns" style="margin-bottom: 0px;margin-left: 5px;" ></div>

          </div>
          <div  @contextmenu.prevent="openMenu($event, widget.ref)">
            <component  id="widget" class="vue-draggable-handle" :is="widget.widgetComponentName" :ref="widget.ref" :refIndex="widget.ref"  :index="index"  :widgetList="widgetList" @del="deleteWidget" @schemas="getSchemas" ></component>
          </div>

        </grid-item>

      </grid-layout>

    </div>

  </div>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'
import { GridLayout, GridItem } from 'vue-grid-layout'

import { WidgetRef } from './components/Base/WidgetRef'
import { WidgetConfig, AllWidgetConfig } from './components/Base/WidgetConfig'
import { Action, UpdatePayload } from './components/Base/UpdatePayload'
import { Widget } from './components/Base/widget'
// import {UpdateWidget} from "./app.vue";

// when add more available widgets add ref to the widgets
import LabelStatus from './components/Status/LabelStatus'
import rightClickMenu from '@/components/Common/rightClickMenu.vue'
import Config from './components/Config/Config'
import BoolConfig from './components/Config/BoolConfig'
import Status from './components/Status/Status'
import Grid from './components/Layout/Grid'
import State from './components/State/State'
import BoolState from './components/State/BoolState'
import Method from './components/Method/Method'
import VarBroadcast from './components/Broadcast/VarBroadcast'
import Navigation from './components/Navigation/Navigation'
import WaveView from './components/WaveView/WaveView.vue'
import { DynamicLine } from '@/components'
// import Gauge from "./components/Gauge/Gauge.vue";

// this is the view selecotr class
  @Component({
    components: {
      // when add more available widgets add ref to the widgets
      LabelStatus,
      Config,
      Status,
      GridLayout,
      GridItem,
      rightClickMenu,
      Grid,
      State,
      BoolState,
      Method,
      Navigation,
      BoolConfig,
      VarBroadcast,
      WaveView,
      DynamicLine
    }
  })

export default class App extends Vue {
    widgetList: WidgetRef[] = [];
    fileName = 'widgetTemplate.json';
    private lastWidgetIndex = 0;
    isShowAddWidget = false;
    isShowConfig = false;
    text = '';
    OpenWindow = false;
    schemas?:any[];
    isShowDrag = false;
    isShowRes = false;
    fragment = '';

    // when add more available widgets add its name here
    availableWidgets = [
      'LabelStatus',
      'Config',
      'Status',
      'Grid',
      'State',
      'BoolState',
      'Method',
      'Navigation',
      'BoolConfig',
      'VarBroadcast',
      'WaveView',
      DynamicLine.WidgetComponentName
    ];

    deleteWidget (index:number):void{
      this.widgetList.splice(index, 1)
      console.log(index)
    }

    OpenWindows (isOpen:boolean):void{
      this.OpenWindow = isOpen
    }

    refactor () {
      this.isShowDrag = true
      this.isShowRes = true
      const refactorList = document.getElementsByClassName('refactor')
      console.log(refactorList)
      for (var i = 0; i < refactorList.length; i++) {
        // refactorList[i].classList.add("vue-draggable-handle");
        // refactorList[i].classList.add("vue-resizable-handle");

        refactorList[i].style.backgroundColor = 'rgba(238,238,238,0.89)'
      }
    }

    getSchemas (schemas:any[]) {
      this.schemas = schemas
    }

    toggleShowAddWidget (): void {
      this.isShowAddWidget = !this.isShowAddWidget
    }

    pokeAndUpdateUI (ref: string, sample: any) {
      Vue.nextTick(() => {
        ((this.$refs[ref] as Array<Widget>)[0] as Widget).samplePoke(sample);
        ((this.$refs[ref] as Array<Widget>)[0] as Widget).updateUI()
      })
    }

    openMenu (e, ref) {
      this.$refs[ref][0].openMenu(e)
      // this.$refs.rightClickMenu.openMenu(e);
    }

    dataAccess (URL: string) {
      axios
        .get(URL, {
          headers: {
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache'
          }
        })
        .then(dataresponse => {
          var samplePath = dataresponse.data.CFET2CORE_SAMPLE_PATH as string
          console.log(samplePath)
          samplePath = samplePath.slice(samplePath.lastIndexOf('/') + 1)
          console.log(samplePath)
          if (samplePath.startsWith('data') || samplePath.startsWith('Data')) {
            console.log('success')
            this.addWidget('WaveView')
          } else {
            var resourcetype = dataresponse.data.ResourceType
            this.addWidget(resourcetype)
          }
          var tempRef = (this.lastWidgetIndex - 1).toString()
          this.pokeAndUpdateUI(tempRef, dataresponse.data)
        })
    }

    mounted () {
      // console.log(this.App);
      const AppLeftClick = document.getElementById('appLeftClick')
      const refactorList = document.getElementsByClassName('refactor')
      AppLeftClick.onclick = e => {
        for (var i = 0; i < refactorList.length; i++) {
          refactorList[i].onclick = e => {
            e.cancelBubble = true
          }
          this.isShowDrag = false
          this.isShowRes = false
          // refactorList[i].classList.remove("vue-resizable-handle");
          refactorList[i].style.backgroundColor = 'white'
        }
      }

      var fragment = window.location.hash
      console.log('costum' + fragment)
      if (fragment !== '#blank' && fragment !== '#Blank' && fragment !== '#') {
        fragment = fragment.substring(1, fragment.length)
        var customViewURL = '/customView/template' + fragment
        console.log(customViewURL)
        var isCustomview = false
        // axios之前出现过cache过多刷不出来的问题，所以本项目的axios都加上了禁止cache的头文件
        axios
          .get(customViewURL, {
            headers: {
              Pragma: 'no-cache',
              'Cache-Control': 'no-cache'
            }
          })
          .then(response => {
            if (
              response.data.CFET2CORE_SAMPLE_ISVALID === true &&
              response.data.CFET2CORE_SAMPLE_VAL !== null
            ) {
              isCustomview = true

              // 返回有值的customview template，进行load处理
              var customviewTemplate: string
              customviewTemplate = response.data.CFET2CORE_SAMPLE_VAL
              var widgets = Object.assign(
                new AllWidgetConfig(),
                JSON.parse(customviewTemplate)
              )
              this.widgetList = widgets.widgetList
              this.lastWidgetIndex = Number(widgets.currentRef)
              this.$forceUpdate()

              // todo:替换startpath;判断是否存在$startpath$

              /* for (var wid of this.widgetList) {
                  if((wid.widgetConfig[1].edit.url).search("startpath") != -1 ){
                      console.log("in"+(wid.widgetConfig[1].edit.url));
                      ((this.$refs[wid.ref] as Array<Widget>)[0] as Widget).replaceStartPath( fragment as string);
                  }
              } */

              // Defer the callback to be executed after the next DOM update cycle.
              Vue.nextTick(() => {
                /* fragment = fragment.substring(1,fragment.length);
                for (var wid of this.widgetList) {
                     ((this.$refs[wid.ref] as Array<Widget>)[0] as Widget).replaceStartPath( fragment as string);
                 } */
                // 刷新值
                // this.importActiveWidgetList();
                // for (var wid of this.widgetList) {
                //   ((this.$refs[wid.ref] as Array<Widget>)[0] as Widget).refresh();
                // }

                fragment = fragment.substring(1, fragment.length)
                this.fragment = fragment
                console.log(fragment)
                this.importActiveWidgetList(fragment)
              })
            } else {
              var dataURL = fragment
              // thing
              // this.dataAccess(dataURL)
            }
          }).catch(err => {
            var dataURL = fragment
            // this.dataAccess(dataURL)
            console.log(dataURL)
          })
      }

      PubSub.subscribe('VarBroadcast', (messageName:string, Args:any) => {
        console.log('PubSub.subscribe("VarBroadcast')
        // 接收到消息调用全部widget的parentUpdate函数
        for (var widget of this.widgetList) {
          console.log(this.$refs[widget.ref]);
          ((this.$refs[widget.ref] as Array<Widget>)[0] as Widget).parentUpdate(Args)
        }
      })
    }

    UpdateWidget (EditData:any) {
      if (EditData.edit.type !== 'WavaView') {
        this.$refs[EditData.edit.index][0].EditData = EditData
        this.$refs[EditData.edit.index][0].pathPoke()
        this.$refs[EditData.edit.index][0].viewLoad(EditData.params.Args)
        // wava
      } else {
        console.log('1111')
        console.log(this.$refs[EditData.edit.index])
        this.$refs[EditData.edit.index][0].EditData = EditData
        this.$refs[EditData.edit.index][0].pathPoke()
        this.$refs[EditData.edit.index][0].pathPokeTime()
        this.$refs[EditData.edit.index][0].viewLoad(EditData.params.Args)
      }
    }

    /* UpdateApply(EditData:any) {
        this.$refs[EditData.edit.index][0].EditData = EditData;
        console.log(EditData);
        this.$refs[EditData.edit.index][0].viewLoad(EditData.params.Args);
        this.$refs[EditData.edit.index][0].viewSetLoad(EditData.params.Args);
    } */

    exportActiveWidgetList (): AllWidgetConfig {
      for (var widget of this.widgetList) {
        console.log('innn')
        widget.widgetConfig = ((this.$refs[widget.ref] as Array<Widget>)[0] as Widget).getConfig()
        console.log(widget.widgetConfig)
      }
      var widgetConfigList = new AllWidgetConfig()
      widgetConfigList.widgetList = this.widgetList
      widgetConfigList.currentRef = this.lastWidgetIndex.toString()
      return widgetConfigList
    }

    importActiveWidgetList (fragment:string) {
      for (var wid of this.widgetList) {
        console.log(fragment);
        ((this.$refs[wid.ref] as Array<Widget>)[0] as Widget).setConfig(
          wid.widgetConfig as WidgetConfig, fragment
        )
      }
    }

    loadTextFromFile (ev: any) {
      const file = ev.target.files[0]
      const reader = new FileReader()
      reader.readAsText(file)
      var widgets
      reader.onload = e => {
        widgets = Object.assign(
          new AllWidgetConfig(),
          JSON.parse((e.target as any).result)
        )
        this.widgetList = widgets.widgetList
        this.lastWidgetIndex = Number(widgets.currentRef)
        this.$forceUpdate()
        Vue.nextTick(() => {
          // changed here
          this.importActiveWidgetList(this.fragment)
        })
      }
    }

    saveWidgetList (): void {
      var data = JSON.stringify(this.exportActiveWidgetList())

      const blob = new Blob([data])
      if (window.navigator.msSaveOrOpenBlob) {
        // 兼容IE10
        navigator.msSaveBlob(blob, this.fileName)
      } else {
        //  chrome/firefox
        const aTag = document.createElement('a')
        aTag.download = this.fileName
        aTag.href = URL.createObjectURL(blob)
        aTag.click()
        URL.revokeObjectURL(aTag.href)
      }
    }

    addWidget (widgetName: string): void {
      var newWidget = new WidgetRef()
      newWidget.widgetComponentName = widgetName
      newWidget.ref = this.lastWidgetIndex.toString()
      newWidget.y = this.lastWidgetIndex * 6
      newWidget.i = Number(newWidget.ref)
      this.lastWidgetIndex++
      this.widgetList = [...this.widgetList, newWidget]
    }

    update (payload: UpdatePayload) {
      var wid
      for (wid of this.widgetList) {
        (this.$refs[wid.ref] as Widget).parentUpdate(payload)
      }
      if (payload.action === '') {
        for (wid of this.widgetList) {
          (this.$refs[wid.ref] as Widget).refresh()
        }
      }
    }
}

// 定义html函数，挂载在window上以供opener调用
// 迁移到main.ts里面，和文件分离，这样单独引用file不受影响
/* window.UpdateWidget = function UpdateWidget(config) {

      //this.App.UpdateWidget(config);
      //prototype原形方法
     // App.prototype = new App;
      //console.log(Appmain.prototype);
      Appmain.prototype.UpdateWidget(config);
      //App.prototype.UpdateWidget(config);
  } */

</script>

<style lang="scss" >

  // Import Bulma's core

  // Import Bulma and Buefy styles
  @import "~bulma";
  @import "~buefy/src/scss/buefy";
  @import "~bulma/sass/utilities/_all";
  //$info: red;
  /* $colors: (
           "info": ($info, $info-invert),
   );*/

  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
  }
  .Widget {
    width: 100%;
    border-color: rgb(206, 212, 218);
  }

  .filew{
    background: white;
    color: gray;
  }

  .navpadding{
    margin-left: 2%;
    margin-right: 4%;
  }

  .uploadlocal{
    margin-right: 8%;
  }

  /*.vue-grid-item>.vue-resizable-handle {
      position: absolute;
      width: 20px;
      height: 20px;
      background: url("./assets/bg.png");
      background-position: bottom right;
      padding: 0 4px 4px 0;
      background-repeat: no-repeat;
      background-origin: content-box;
      box-sizing: border-box;
      cursor: pointer;
      font-size: 30px;
      background-color: rgb(30,53,164);
  }*/

  .buttonbg{
    background-color: #343434;
    border-bottom-right-radius: 6px;
    border-top-right-radius: 4px;
    border-bottom-left-radius: 4px;
    width: 140.5px;
    height: 38px;
    margin-top: 3px;
  }

</style>
