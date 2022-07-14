<template>
  <div>
    <input type="file" @change="getBase64"></input>
    <button @click="postBase64"></button>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop, Watch, Vue } from 'vue-property-decorator'
import { Widget } from '../Base/widget'
import { EditData } from '../Base/EditData'
import { WidgetConfig } from '../Base/WidgetConfig'
import rightClickMenu from '../Common/rightClickMenu.vue'
import { request } from '@/network/request'
import { UpdatePayload } from '../Base/UpdatePayload'

  @Component({
    components: {
      rightClickMenu
    }
  })
export default class UploadFile extends Widget {
    WidgetComponentName = 'GetBase64';
    @Prop() index: number;
    @Prop() refIndex: number;
    EditPathPoke: string = '';
    sample: any;
    timer?: number;
    StatusValue: string = '';
    userInputData = new Map<string, string>();
    // isShowPath: boolean = false;
    activeColor: string = '#bbb';
    stateKey: string = '';
    curArg: any = {};
    base64String = '';

    config: WidgetConfig = {
      WidgetComponentName: 'GetBase64',
      data: {
        url: '',
        displayname: '',
        userInputData: ''
      }
    };

    EditData: EditData = {
      edit: {
        type: 'get-base64',
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
        action: 'get-base64',
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
      // this.isShowPath = false
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

    setConfig (setConfigData: [WidgetConfig, object], fragment: string) {
      super.setConfig(setConfigData, fragment)
      this.curArg = this.EditData.params.Args
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

    async invokeData (url: string) {
      request({
        url: 'http://localhost:8080/App.html',
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          base64String: this.base64String
        }
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }

    // super.invokeData(url)
    // this.StatusValue = this.sample.CFET2CORE_SAMPLE_VAL
    // if (this.StatusValue === undefined) {
    //   this.StatusValue = 'undefined'
    // }

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

    getBase64 (ev: any) {
      let file = ev.target.files[0];
      console.log(file.name)
      console.log(file.type)

      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        this.base64String = e.target.result;
        console.log(this.base64String)
      }
    }
  }

</script>

<style scoped>

</style>
