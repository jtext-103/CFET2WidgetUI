<!--suppress ALL -->
<template>
  <div class="container" style="margin-top: 30px;">

    <div class="columns content " v-bind:class="EditData.props.titleSize" style="margin-bottom: 0px;padding-left: 7px;">
      <div class="column content-table-cell-heading-color is-narrow" style="margin: 0px;padding: 0px;">
        <h3>{{EditData.props.title}}</h3>
      </div>
    </div>

    <div class="columns" style="padding: 5px;">
      <span style="background-color: #bbb;border-radius: 50%;display: inline-block;"
            v-bind:style="{ backgroundColor: activeColor, height: EditData.props.fontSize + 'px' ,width: EditData.props.fontSize + 'px'}"></span>

      <div class="column is-2" v-bind:style="{ fontColor: activeColor}" v-if="EditData.edit.isShowStateVlaue">{{stateKey}}</div>

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
  import {Component,Prop,Watch, Vue}from 'vue-property-decorator';

  @Component({
    components: {
      rightClickMenu
    }
  })
  export default class State extends Widget {
    WidgetComponentName = 'State';
    @Prop() index:number;
    @Prop() refIndex:number;
    EditPathPoke : string = '';
    sample : any;
    timer?: number;
    StatusValue: string = "";
    userInputData = new Map<string, string>();

    isShowPath: boolean = false;

    activeColor:string = '#bbb';
    stateKey:string = '';

    config: WidgetConfig = {
      WidgetComponentName: "State",
      data: {
        url: "",
        displayname:"",
        userInputData: ""
      }
    };

    EditData:EditData = {
      edit:{
        type:'state',
        parseUrl:'',
        url:this.config.data.url,
        index:this.refIndex,
        isShowStateVlaue:false,
        isSubscribe: false
      },
      props:{
        fontSize:50,
        title:'',
        titleSize:'',
        StateFile:'{"Idle":"yellow","prepare":"orange","run":"green","error":"red" }' ,
        StateIndicator:'{"0":"Idle","1":"prepare","2":"run","255":"error"}',
      },
      params:{
        PokedPath:this.EditPathPoke,
        action:'get',
        Args : {},
        tempUserInputData:{},
        shouldUpdate:false,
        userInputData:this.userInputData,
        //userInputData:this.userInputData,
      },
    };



    mounted(){
      //恢复一秒一次，记得判断ws
      this.timer = setInterval(this.refresh, 1000);

    }
    del () {
      this.$emit('del', this.index)
    }

    refresh(){
      if(this.EditData.edit.isSubscribe == false){
        this.viewLoad(this.EditData.params.Args);
      }

    }

    colourViewLoad(){
      var stateFile = JSON.parse(this.EditData.props.StateFile);
      var stateIndicator = JSON.parse(this.EditData.props.StateIndicator);

      this.stateKey = stateIndicator[this.StatusValue];

      this.activeColor = stateFile[this.stateKey];

      if(this.activeColor == undefined){
        this.activeColor = '#bbb';
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
      super.openWindows()
    }


    getConfig () {
      return super.getConfig()
    }

    setConfig (setConfigData: [WidgetConfig,object],fragment:string) {
      super.setConfig(setConfigData, fragment)
      console.log(this.EditData)
    }

    pathPoke () {
      super.pathPoke()
      this.colourViewLoad()
    }

    samplePoke (sample: any) {
      super.samplePoke(sample)
    }

    replaceStartPath (startPath: string) {
      super.replaceStartPath(startPath)
    }

    async getData (url: string) {
      console.log('print url')
      console.log(url)
      await super.getData(url)
      console.log(this.sample.CFET2CORE_SAMPLE_VAL)
      this.StatusValue = this.sample.CFET2CORE_SAMPLE_VAL;
      if(this.StatusValue === undefined)
      {
        this.StatusValue = "undefined";
      }
      console.log(11111111)
      console.log(this.StatusValue)
    }



    async viewLoad (Args: UpdatePayload) {
      super.viewLoad(Args)
      await this.getData(this.pathwithVar)
      this.colourViewLoad()
    }
    /* constructor () {
        super(this.index, this.refIndex)
      } */

    parentUpdate(payload: UpdatePayload): void {
      super.parentUpdate(payload)
      this.viewLoad(this.EditData.params.Args)
    }

  }
</script>

<style>
</style>
