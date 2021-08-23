<!--suppress ALL -->
<template>
  <div  class="container" id="RightClick" style="margin-top: 30px;">
    <div class="columns content " v-bind:class="EditData.props.titleSize" style="margin-bottom: 0px;padding-left: 7px;">
      <div class="column content-table-cell-heading-color is-narrow" style="margin: 0px;padding: 0px;">
        <h3>{{EditData.props.title}}</h3>
      </div>

    </div>

    <div style=" display: flex; justify-content: center; align-items:center;" class="columns">

      <div class="column is-four-sixths is-offset-one-sixth" style="overflow:auto;">
        <div style="border: solid 1px;" v-bind:style="{ color: activeColor, fontSize: EditData.props.fontSize + 'px' }" >{{ StatusValue }}</div>
      </div>
      <div style="margin-left: 5px;"  v-if="EditData.edit.isShowStateVlaue" v-bind:style="{ color: activeColor, fontSize: EditData.props.fontSize + 'px' }" >{{EditData.props.unit}}</div>

      <WidgetParams
        class="column"
        ref="WidgetParams"
        v-show="isShowParams"
        action="get"
        @updataVariables="viewLoad"
      ></WidgetParams>
    </div>
    <rightClickMenu ref="rightClickMenu" @openWindows="openWindows"></rightClickMenu>


  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Widget } from './Base/widget'
import { EditData } from './Base/EditData'
import { WidgetConfig } from './Base/WidgetConfig'
import rightClickMenu from '@/components/Common/rightClickMenu.vue'
import {Component,Prop,Watch, Vue}from 'vue-property-decorator';

  @Component({
    components: {
      rightClickMenu
    }
  })
export default class LabelStatus extends Widget {
    WidgetComponentName = 'LabelStatus';
    @Prop() index:number; // 这里回头检查下!:
    @Prop() refIndex:number;
    EditPathPoke : string = '';
    StatusValue: string = "undefined";
    sample : any;
    timer?: number;

    config:WidgetConfig = {
      WidgetComponentName: 'LabelStatus',
      data: {
        url: '',
        displayname: '',
        userInputData: ''
      }
    };

    EditData:EditData = {
      edit: {
        type: 'LabelStatus',
        parseUrl: '',
        url: this.config.data.url,
        index: this.refIndex,
        isShowStateVlaue: false
      },
      props: {
        fontSize: 22,
        title: '',
        titleSize: '',
        unit: '',
        EventType:'DataPublish'
      },
      params: {
        PokedPath: this.EditPathPoke,
        action: 'get',
        Args: {},
        tempUserInputData:{},
        shouldUpdate:false,
        userInputData:this.userInputData,
      }
    };


    mounted(){
      //this.timer = setInterval(this.refresh, 1000);
      this.$refs.RightClick.addEventListener('click', () => {
        this.$refs.rightClickMenu.closeMenu()
      });


    }

    refresh(){
      console.log(this.sample)
      this.StatusValue = this.sample.CFET2CORE_SAMPLE_VAL;
      console.log("11"+this.sample.CFET2CORE_SAMPLE_VAL)
      if(this.StatusValue == undefined)
      {
        this.StatusValue = "undefined";
      }
    }

    updateUI () {
      this.isShowPath = false
      super.updateUI()
    }

    openMenu(e){
      this.$refs.rightClickMenu.openMenu(e);
    }

    openWindows(){
      console.log("opern")
      super.openWindows()
    }


    getConfig () {
      super.getConfig()
    }

    setConfig (setConfigData: [WidgetConfig,object],fragment:string) {
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
      this.StatusValue = this.sample.CFET2CORE_SAMPLE_VAL;
      console.log("11"+this.sample.CFET2CORE_SAMPLE_VAL)
      if(this.StatusValue == undefined)
      {
        this.StatusValue = "undefined";
      }
    }
    @Watch('sample.CFET2CORE_SAMPLE_VAL', { deep: true, immediate: true})
    handleWatch(){
      console.log('监听上面数组的内容')
    }


    viewLoad (Args: UpdatePayload) {
      super.viewLoad(Args)
    }
  /* constructor () {
      super(this.index, this.refIndex)
    } */
}
</script>

<style>
</style>
