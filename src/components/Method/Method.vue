<template>
  <div class="container" style="padding-bottom: 30px;padding-right: 30px;margin-top: 30px;" >

    <div class="columns content " v-bind:class="EditData.props.titleSize" style="margin-bottom: 0px;padding-left: 10px;">
      <div class="column content-table-cell-heading-color is-narrow" style="margin: 0px;padding: 0px;">
        <h3>{{EditData.props.title}}</h3>
      </div>
    </div>

    <div class="buttons">
      <button class="button has-text-info is-light is-medium is-fullwidth" style="padding: 4px;margin-bottom: 25px;" @click="viewInvokeLoad(curArg)">
        <span style="margin: auto;">invoke</span>
      </button>
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
import axios from 'axios'
import { UpdatePayload } from '../Base/UpdatePayload'

  @Component({
    components: {
      rightClickMenu
    }
  })
export default class Method extends Widget {
    WidgetComponentName = 'Method';
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
    curArg: any = {};
    StateIndicator = {
      true: 'green',
      false: 'red'
    };

    config: WidgetConfig = {
      WidgetComponentName: 'Method',
      data: {
        url: '',
        displayname: '',
        userInputData: ''
      }
    };

    EditData:EditData = {
      edit: {
        type: 'method',
        parseUrl: '',
        url: this.config.data.url,
        index: this.refIndex
      },
      props: {
        fontSize: 25,
        title: '',
        titleSize: ''
      },
      params: {
        PokedPath: this.EditPathPoke,
        action: 'invoke',
        Args: {},
        tempUserInputData: {},
        shouldUpdate: false,
        userInputData: this.userInputData
      }
    };

    del () {
      this.$emit('del', this.index)
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
      this.curArg = this.EditData.params.Args
    }

    pathPoke () {
      super.pathPoke()
      this.curArg = this.EditData.params.Args
    }

    samplePoke (sample: any) {
      super.samplePoke(sample, 'invoke')
    }

    replaceStartPath (startPath: string) {
      super.replaceStartPath(startPath)
    }

    async invokeData (url: string) {
      super.invokeData(url)
      this.StatusValue = this.sample.CFET2CORE_SAMPLE_VAL
      if (this.StatusValue === undefined) {
        this.StatusValue = 'undefined'
      }
    }

    async viewInvokeLoad (Args: UpdatePayload) {
      // this.config.data.userInputData = Args.variables;
      this.userInputData = Args.variables
      if (this.EditData.edit.url === '') {
        this.config.data.url = this.EditData.edit.parseUrl
      } else {
        this.config.data.url = this.EditData.edit.url
      }

      this.pathwithVar = this.pathProcessor.FillPathWithVar(
        // this.config.data.userInputData,
        this.userInputData,
        this.config.data.url
      )

      await this.invokeData(this.pathwithVar)
    }

    /* constructor () {
        super(this.index, this.refIndex)
      } */

    parentUpdate (payload: UpdatePayload): void {
      super.parentUpdate(payload)
      this.viewLoad(this.EditData.params.Args)
    }
}
</script>

<style scoped>

</style>
