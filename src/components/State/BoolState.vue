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

      <div v-bind:style="{ fontColor: activeColor}" v-if="EditData.edit.isShowStateVlaue">{{stateKey}}</div>

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


  @Component({
    components: {
      rightClickMenu
    }
  })
export default class BoolState extends Widget {
    WidgetComponentName = 'BoolState';
    @Prop() index:number;
    @Prop() refIndex:number;
    EditPathPoke : string = '';
    sample : any;
    timer?: number;
    StatusValue: string = '';
    userInputData = new Map<string, string>();
    timer?: number;
    isShowPath: boolean = false;
    activeColor:string = '#bbb';
    stateKey:string = '';
    StateIndicator = {
      true: 'green',
      false: 'red'
    };

    config: WidgetConfig = {
      WidgetComponentName: 'BoolState',
      data: {
        url: '',
        displayname: '',
        userInputData: ''
      }
    };

    EditData:EditData = {
      edit: {
        type: 'Boolstate',
        parseUrl: '',
        url: this.config.data.url,
        index: this.refIndex,
        isShowStateVlaue: false,
        isSubscribe: false
      },
      props: {
        fontSize: 50,
        title: '',
        titleSize: ''
      },
      params: {
        PokedPath: this.EditPathPoke,
        action: 'get',
        Args: {},
        tempUserInputData: {},
        shouldUpdate: false,
        userInputData: this.userInputData
        // userInputData:this.userInputData,
      }
    };

    mounted () {
      // 恢复一秒一次，记得判断ws
      // this.timer = setInterval(this.refresh, 1000);

    }

    del () {
      this.$emit('del', this.index)
    }

    /* refresh(){
      if(this.EditData.edit.isSubscribe == false){
        this.viewLoad(this.EditData.params.Args);
      }

    } */

    colourViewLoad () {
      this.activeColor = this.StateIndicator[this.StatusValue]
      if (this.activeColor === undefined) {
        this.activeColor = '#bbb'
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
      this.colourViewLoad()
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
      if (this.StatusValue === undefined) {
        this.StatusValue = 'undefined'
      }
    }

    viewLoad (Args: UpdatePayload) {
      super.viewLoad(Args)
      this.colourViewLoad()
    }
    /* constructor () {
        super(this.index, this.refIndex)
      } */

    parentUpdate(payload: UpdatePayload): void {
      super.parentUpdate(payload)
    }
}
</script>

<style scoped>

</style>
