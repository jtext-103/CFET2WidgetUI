<!--suppress ALL -->
<template>
  <div class="hflex" >
    <div class="container" style="margin-top: 30px;padding-top: 5px;">

      <button class="button column" @click="publish(EditData.params.Args)" style="background-color: #216dec;padding-top: 6px; ">broadcast</button>
      <rightClickMenu ref="rightClickMenu" @del="del" @openWindows="openWindows"></rightClickMenu>

    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import PubSub from 'pubsub-js'
import { Prop, Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { Widget } from '../Base/widget'
import { EditData } from '../Base/EditData'
import { WidgetConfig } from '../Base/WidgetConfig'
import rightClickMenu from '../Common/rightClickMenu.vue'

  @Component({
    components: {
      rightClickMenu
    }
  })
export default class VarBroadcast extends Widget {
    WidgetComponentName = 'VarBroadcast';
    @Prop() index:number;
    @Prop() refIndex:number;
    StatusValue: string = 'undefined';
    sample : any;
    timer?: number;
    EditPathPoke : string = '';

    config:WidgetConfig = {
      WidgetComponentName: 'VarBroadcast',
      data: {
        url: '',
        displayname: '',
        userInputData: ''
      }
    };

    EditData:EditData = {
      edit: {
        type: 'VarBroadcast',
        url: this.config.data.url,
        index: this.refIndex,
        isShowStateVlaue: false
      },
      props: {
        fontSize: 22,
        title: '',
        titleSize: ''
      },
      params: {
        PokedPath: this.EditPathPoke,
        action: 'get',
        Args: {},
        tempUserInputData: {}
      }
    };

    mounted () {
    }

    del () {
      this.$emit('del', this.index)
    }

    /* refresh(){
      if(this.EditData.edit.isSubscribe == false){
        this.viewLoad(this.EditData.params.Args);
      }

    } */

    updateUI () {
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
      this.$parent.$root.$children[0].$children[0].$children[0].config.data.url = pokedPath;
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
    }

    publish (Args: UpdatePayload) {
      PubSub.publish('VarBroadcast',Args);
    }

}
</script>

<style>
</style>
