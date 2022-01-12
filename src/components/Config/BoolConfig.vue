<template>
  <div class="container" style="margin-top: 30px; padding-top: 8px;">

    <div class="columns content " v-bind:class="EditData.props.titleSize" style="margin-bottom: 0px;padding-left: 7px;">
      <div class="column content-table-cell-heading-color is-narrow" style="margin: 0px;padding: 0px;">
        <h3>{{EditData.props.title}}</h3>
      </div>
    </div>

    <div class="columns" style="padding: 5px; display: flex; justify-content: center;">

      <toggle-button v-model="switchValue"
                     :sync="true"
                     @change="viewSetLoad(EditData.params.Args,false)"
                     width="70"
                     height="34"
                     :disabled="checkActiveSample"
                     switch-color="{checked: '#25EF02', unchecked: 'linear-gradient(red, yellow)'}"
                     :labels="{checked: 'open', unchecked: 'close'}"/>

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
import rightClickMenu from '@/components/Common/rightClickMenu.vue'
import { UpdatePayload } from '../Base/UpdatePayload'

@Component({
  components: {
    rightClickMenu
  }
})
export default class BoolConfig extends Widget {
  WidgetComponentName = 'BoolConfig';
  @Prop() index!:number;
  @Prop() refIndex!:number;
  userGetInputData = new Map<string, string>();
  userSetInputData = new Map<string, string>();
  getConfigValue: any = 'undefined';
  setConfigValue: any = '';
  sample : any;
  setLabel:string = '';
  switchValue:boolean = false;
  checkActiveSample:boolean = true;
  getPathwithVar: string = '';
  setPathwithVar: string = '';
  config: WidgetConfig = {
    WidgetComponentName: 'BoolConfig',
    data: {
      displayname: '',
      url: '',
      get: { url: '', userInputData: '' },
      set: { url: '', userInputData: '' }
    }
  };

  EditData:EditData = {
    edit: {
      url: this.config.data.url,
      parseUrl: '',
      setConfigUrl: '',
      setLabel: '',
      type: 'Boolconfig',
      index: this.refIndex,
      isSubscribe: false
    },
    props: {
      title: '',
      titleSize: ''
    },
    params: {
      PokedPath: this.EditPathPoke,
      action: 'get',
      Args: {},
      tempUserInputData: {},
      setLabel: '',
      shouldUpdate: false,
      userInputData: this.userInputData
    }
  };

  openMenu (e) {
    this.$refs.rightClickMenu.openMenu(e)
  }

  openWindows () {
    super.openWindows()
  }

  del () {
    this.$emit('del', this.index)
  }

  parentUpdate (payload: UpdatePayload): void {
    this.userGetInputData = this.strMapObjChange.strMapToObj(
      this.userGetInputData)
    var temp = this.userGetInputData
    temp = this.strMapObjChange.objToStrMap(temp)
    this.userGetInputData = temp
    this.userGetInputData.forEach((value, key) => {
      payload.variables.forEach((valueofpayload, keyofpayload) => {
        if (key === keyofpayload && ((this.userGetInputData.get(key) as string) !== (payload.variables.get(keyofpayload) as string))) {
          this.userGetInputData.set(key, payload.variables.get(keyofpayload) as string)
          this.EditData.params.shouldUpdate = true
          this.EditData.params.Args.variables = this.userGetInputData
          this.viewGetLoad(this.EditData.params.Args)
        }
      })
    }); this.EditData.params.userInputData = this.strMapObjChange.strMapToObj(this.userGetInputData)

    this.userSetInputData = this.strMapObjChange.strMapToObj(
      this.userSetInputData)
    temp = this.userSetInputData
    temp = this.strMapObjChange.objToStrMap(temp)
    this.userSetInputData = temp
    this.userSetInputData.forEach((value, key) => {
      payload.variables.forEach((valueofpayload, keyofpayload) => {
        if (key === keyofpayload && ((this.userSetInputData.get(key) as string) !== (payload.variables.get(keyofpayload) as string))) {
          this.userSetInputData.set(key, payload.variables.get(keyofpayload) as string)
          this.viewSetLoad(this.EditData.params.Args)
        }
      })
    })
  }

  pathPoke () {
    this.config.data.url = this.EditData.edit.url
    this.EditPathPoke = this.EditData.edit.url

    var pokepath = this.EditData.edit.url
    window.$axios.get(pokepath).then((response: { data: any; }) => {
      console.log(response)
      this.samplePoke(response.data)
      console.log(response.data)
      super.updateUI()
    }).catch(err => {
      console.log(err)
      this.EditData.params.PokedPath = this.config.data.url
      this.openWindows()
    })
  }

  updateSwitchValue () {
    if (Object.prototype.toString.call(this.getConfigValue) === '[object Boolean]' || this.getConfigValue === true || this.getConfigValue === false || this.getConfigValue === 0 || this.getConfigValue === 1) {
      this.checkActiveSample = false
      if (Object.prototype.toString.call(this.getConfigValue) === '[object String]') {
        if (this.getConfigValue === '1') {
          this.switchValue = true
        } else if (this.getConfigValue === '0') {
          this.switchValue = false
        }
      } else {
        this.switchValue = Boolean(this.getConfigValue)
      }
    }
  }

  getConfig () {
    return super.getConfig()
  }

  setConfig (setConfigData: [WidgetConfig, object], fragment:string) {
    if (this.EditData.edit.setConfigUrl.search('startpath') !== -1) { this.replaceStartPath(fragment) }
    this.setLabel = this.EditData.params.setLabel
    super.setConfig(setConfigData, fragment)
    // this.pathPoke()
  }

  samplePoke (sample: any) {
    var samplePath = sample.CFET2CORE_SAMPLE_PATH
    var setpokedPath: string
    var getpokedPath: string
    // set
    setpokedPath = samplePath
    getpokedPath = samplePath

    var settemp = sample.Actions.set.Parameters
    settemp = JSON.parse(JSON.stringify(settemp))
    settemp = this.strMapObjChange.objToStrMap(settemp)
    var SetParameters: Map<string, string>
    SetParameters = settemp

    var temp = sample.Actions.get.Parameters
    temp = JSON.parse(JSON.stringify(temp))
    temp = this.strMapObjChange.objToStrMap(temp)
    var Parameters: Map<string, string>
    Parameters = temp

    var count: number = 0
    Parameters.forEach((value, key) => {
      count++
      if (count === 1) {
        getpokedPath = getpokedPath + '?'
      }
      getpokedPath = getpokedPath + key + '=$' + key + '$&'
    })

    if (count !== 0) {
      getpokedPath = getpokedPath.substring(0, getpokedPath.length - 1)
    }
    this.config.data.get.url = getpokedPath

    count = 0
    SetParameters.forEach((value, key) => {
      count++
      /// dummyTest/ReturnDictConfig?
      if (count === 1) {
        setpokedPath = setpokedPath + '?'
        // this.pokedPath = setpokedPath
      }
      /// dummyTest/ReturnDictConfig?key=$key$&
      /// dummyTest/ReturnDictConfig?key=$key$&value=$value$&
      if (count < SetParameters.size) {
        setpokedPath = setpokedPath + key + '=$' + key + '$&'
      }
      if (count === SetParameters.size) {
        this.setLabel = key
        this.EditData.params.setLabel = key
        this.config.data.set.url = setpokedPath + key + '=$' + key + '$'
      }
    })

    /// dummyTest/ReturnDictConfig?key=$key$&value=$value$
    if (count !== 0) {
      setpokedPath = setpokedPath.substring(0, setpokedPath.length - 1)
    }

    count = 0
    Parameters.forEach((value, key) => {
      SetParameters.forEach((setValue, setKey) => {
        count++

        if (setKey !== key) {
          setpokedPath = setpokedPath + key + '=$' + key + '$&'
        }
      })
    })

    /// dummyTest/ReturnDictConfig?key=$key$&value=$value$
    if (count !== 0) {
      setpokedPath = setpokedPath.substring(0, setpokedPath.length - 1)
    }
    console.log(this.config.data.url)
    this.config.data.url = setpokedPath
  }

  async getData (url: string) {
    await super.getData(url)
    this.getConfigValue = this.sample.CFET2CORE_SAMPLE_VAL
    if (this.getConfigValue === undefined) {
      this.getConfigValue = 'undefined'
    }
    this.updateSwitchValue()
  }

  async setData (url: string) {
    var apiLoad = url
    await window.$axios.post(apiLoad)
      .then((response: { data: any; }) => {
        this.setConfigValue = response.data.CFET2CORE_SAMPLE_VAL
      })
  }

  viewLoad (Args: UpdatePayload) {
    var checkParent = true
    this.viewSetLoad(Args, checkParent)
  }

  // called when widgetParams action clicked
  async viewGetLoad (Args: UpdatePayload) {
    // this.config.data.userInputData = Args.variables;
    this.userGetInputData = Args.variables
    if (this.EditData.edit.parseUrl !== '') {
      if (this.EditData.edit.url === '') {
        console.log('1' + this.EditData.edit.parseUrl)
        this.config.data.get.url = this.EditData.edit.parseUrl
      } else {
        this.config.data.get.url = this.EditData.edit.url
      }
    }
    this.getPathwithVar = this.pathProcessor.FillPathWithVar(
      // this.config.data.userInputData,
      this.userGetInputData,
      this.config.data.get.url
    )
    await this.getData(this.getPathwithVar)
  }

  async viewSetLoad (Args: UpdatePayload, checkParent:boolean) {
    console.log('set')
    if (checkParent === false) {
      console.log('iii')
      if (this.EditData.edit.parseUrl !== '') {
        this.config.data.set.url = this.EditData.edit.setConfigUrl
        console.log(this.config.data.set.url)
        this.setLabel = this.EditData.edit.setLabel
        // console.log(this.setLabel);
        // this.setUserData = Args.variables.setLabel;
      }
      // this.config.data.userInputData = Args.variables;

      if (Object.prototype.toString.call(Args.variables) === '[object Undefined]') {
        if (Object.prototype.toString.call(this.getConfigValue) === '[object Number]' || this.getConfigValue === 0 || this.getConfigValue === 1) {
          const switchTempValue = Number(this.switchValue)
          this.userSetInputData.set(this.setLabel, switchTempValue)
        } else {
          this.userSetInputData.set(this.setLabel, this.switchValue)
        }
      } else {
        if (Object.prototype.toString.call(this.getConfigValue) === '[object Number]' || this.getConfigValue === 0 || this.getConfigValue === 1) {
          const switchTempValue = Number(this.switchValue)
          this.userSetInputData = Args.variables
          this.userSetInputData.set(this.setLabel, switchTempValue)
        } else {
          this.userSetInputData = Args.variables
          this.userSetInputData.set(this.setLabel, this.switchValue)
        }
      }
      console.log(this.setPathwithVar)

      this.setPathwithVar = this.pathProcessor.FillPathWithVar(this.userSetInputData, this.config.data.set.url)
      console.log(this.setPathwithVar)
      await this.setData(this.setPathwithVar)
      this.getrefresh()
    } else if (checkParent === true) {
      this.getrefresh()
    }
  }

  getrefresh () {
    this.viewGetLoad(this.EditData.params.Args)
  }
}
</script>

<style scoped>

</style>
