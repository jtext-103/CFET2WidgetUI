<template>
  <div class="container" style="margin-top: 30px;padding-top: 5.5px;">

    <div class="columns content " v-bind:class="EditData.props.titleSize" style="margin-bottom: 0px;padding-left: 7px;">
      <div class="column content-table-cell-heading-color is-narrow" style="margin: 0px;padding: 0px;">
        <h3>{{EditData.props.title}}</h3>
      </div>
    </div>

    <div class="columns" style="padding: 5px;">

      <div class="field-body">
        <div class="field">
          <div class="control">
            <input class="input is-info" type="text" v-model="setUserData">
          </div>
        </div>
      </div>
      <button class="button has-text-info is-light" style="margin-left: 15px;" @click="viewSetLoad(EditData.params.Args)">set</button>
      <button class="button has-text-info is-light" style="margin-left: 15px;" @click="viewLoad(EditData.params.Args)">get</button>

    </div>
    <rightClickMenu ref="rightClickMenu" @del="del" @openWindows="openWindows"></rightClickMenu>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop, Watch, Vue } from 'vue-property-decorator'
import { Widget } from '../Base/widget'
import { WidgetConfig } from '../Base/WidgetConfig'
import { EditData } from '../Base/EditData'
import rightClickMenu from '@/components/Common/rightClickMenu.vue'
import { UpdatePayload } from '../Base/UpdatePayload'

  @Component({
    components: {
      rightClickMenu
    }
  })
export default class Config extends Widget {
    WidgetComponentName = 'LabelStatus';
    @Prop() index:number;
    @Prop() refIndex:number;
    userGetInputData = new Map<string, string>();
    userSetInputData = new Map<string, string>();
    sample : any;
    setLabel:string = '';
    setUserData:string = 'undefined';
    getPathwithVar: string = '';
    setPathwithVar: string = '';
    config: WidgetConfig = {
      WidgetComponentName: 'Config',
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
        type: 'config',
        index: this.refIndex,
        isSubscribe: false
      },
      props: {
        title: '',
        titleSize: '',
        fontSize: 25 // del this.fonsize
      },
      params: {
        PokedPath: this.EditPathPoke,
        action: 'get',
        Args: {},
        tempUserInputData: {},
        setLabel: '',
        shouldUpdate: false,
        userInputData: {}
      }
    };

    created () {
      this.config.data.get.userInputData = this.strMapObjChange.strMapToObj(
        this.userGetInputData
      )
      this.config.data.set.userInputData = this.strMapObjChange.strMapToObj(
        this.userSetInputData
      )
    }

    mounted () {
      this.$refs.RightClick.addEventListener('click', () => {
        this.$refs.rightClickMenu.closeMenu()
      })
    }

    openMenu (e) {
      this.$refs.rightClickMenu.openMenu(e)
    }

    openWindows () {
      super.openWindows()
    }

    // poke调用
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

    // 广播功能
    parentUpdate (payload: UpdatePayload): void {
      if (this.userSetInputData.size === 0) {
        this.setInputData(this.EditData.params.Args)
      }
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
            if (this.setLabel === keyofpayload) {
              this.setUserData = payload.variables.get(keyofpayload) as string
            }
            this.viewSetLoad(this.EditData.params.Args)
          }
        })
      })
    }

    // 拼接路径（get和set）
    // 如果是poke，则自动取出最后一个参数为放到widget中的参数，其余在edit窗口
    samplePoke (sample: any) {
      var samplePath = sample.CFET2CORE_SAMPLE_PATH
      console.log(samplePath)
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
      console.log(getpokedPath)
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
          console.log('setf')
          console.log(this.setLabel)
        }
      })

      /// dummyTest/ReturnDictConfig?key=$key$&value=$value$
      // 去掉最后一个符号&
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
      console.log(url)
      await super.getData(url)
      this.setUserData = this.sample.CFET2CORE_SAMPLE_VAL
      if (this.setUserData === undefined) {
        this.setUserData = 'undefined'
      }
    }

    async setData (url: string) {
      var apiLoad = url
      await window.$axios.post(apiLoad)
        .then((response: { data: any; }) => {
          this.setUserData = response.data.CFET2CORE_SAMPLE_VAL
          console.log(this.setUserData)
          if (response.data.CFET2CORE_SAMPLE_ISVALID === true) {

          }
        })
    }

    viewLoad (Args: UpdatePayload) {
      this.viewGetLoad(Args)
    }

    // 更新视图，view相关的命名函数都是累死的功能
    async viewGetLoad (Args: UpdatePayload) {
      // this.config.data.userInputData = Args.variables;
      this.userGetInputData = Args.variables
      if (this.EditData.edit.parseUrl !== '') {
        if (this.EditData.edit.url === '') {
          this.config.data.get.url = this.EditData.edit.parseUrl
        } else {
          this.config.data.get.url = this.EditData.edit.url
        }
      }
      console.log(this.config.data.get.url)
      console.log(this.userGetInputData)
      console.log('test config')
      this.getPathwithVar = this.pathProcessor.FillPathWithVar(
        // this.config.data.userInputData,
        this.userGetInputData,
        this.config.data.get.url
      )
      console.log(this.getPathwithVar)
      await this.getData(this.getPathwithVar)
    }

    setInputData (Args: UpdatePayload) {
      if (this.EditData.edit.parseUrl !== '') {
        this.config.data.set.url = this.EditData.edit.setConfigUrl
        this.setLabel = this.EditData.edit.setLabel
      }
      if (Object.prototype.toString.call(Args.variables) === '[object Undefined]') {
        this.userSetInputData.set(this.setLabel, this.setUserData)
      } else {
        this.userSetInputData = Args.variables
        this.userSetInputData.set(this.setLabel, this.setUserData)
        console.log(this.userSetInputData)
      }
    }

    async viewSetLoad (Args: UpdatePayload) {
      this.setInputData(Args)

      this.setPathwithVar = this.pathProcessor.FillPathWithVar(this.userSetInputData, this.config.data.set.url)

      await this.setData(this.setPathwithVar)
    }

    getConfig () {
      return super.getConfig()
    }

    setConfig (setConfigData: [WidgetConfig, object], fragment:string) {
      this.config = setConfigData[0]
      this.EditData = setConfigData[1]

      if (this.EditData.edit.url.search('startpath') !== -1) { this.replaceStartPath(fragment) }
      if (this.EditData.edit.parseUrl.search('startpath') !== -1) { this.replaceStartPath(fragment) }
      if (this.EditData.edit.setConfigUrl.search('startpath') !== -1) { this.replaceStartPath(fragment) }

      var temp = this.EditData.params.tempUserInputData
      temp = JSON.parse(JSON.stringify(temp))
      temp = this.strMapObjChange.objToStrMap(temp)
      // this.EditData.params.tempUserInputData = temp;

      // console.log(this.EditData.params.tempUserInputData);
      this.setLabel = this.EditData.params.setLabel

      var Args: UpdatePayload = {
        action: this.EditData.params.action,
        variables: temp,
        target: ['self']
      }
      this.EditData.params.Args = Args
      // try confid串线
      this.pathPoke()
      this.viewLoad(Args)
      // this.pathPoke()
    }

    replaceStartPath (startPath: string): void {
      this.config.data.get.url = this.config.data.get.url.replace('$startpath$', startPath)
      this.config.data.set.url = this.config.data.set.url.replace('$startpath$', startPath)
      this.config.data.url = this.config.data.url.replace('$startpath$', startPath)
      this.EditData.edit.url = this.EditData.edit.url.replace('$startpath$', startPath)
      this.EditData.edit.parseUrl = this.EditData.edit.parseUrl.replace('$startpath$', startPath)
      this.EditData.edit.setConfigUrl = this.EditData.edit.setConfigUrl.replace('$startpath$', startPath)
    }

    del () {
      this.$emit('del', this.index)
    }
}
</script>

<style scoped>

</style>
