<template>
    <div class="container">
        <hr>
        <div>2020.9 windows.open 'for widget windows'</div>
        <hr>

        <table class="table">
            <thead>
            <tr>
                <th><abbr >Edit Widget</abbr></th>
            </tr>
            </thead>
            <tbody>

            <tr class="is-selected is-fullwidth">
                <th>{{EditData.edit.type}}</th>
                <td>Enter the Thing in the input box below,  </td>
                <td>click 'POKE' to get the parameters</td>

            </tr>

            <tr v-if="EditData.edit.type === 'Navigation'">
                <td><button class="button has-text-primary" style="margin-left: 15px;" @click="addInput">Add Input</button></td>
                <td><table class="table">
                    <tbody v-for="(data,index) in EditData.edit.UserInnputUrl" :key="index">
                        <tr>
                            <input class="input has-text-primary" v-model="data.url"></tr>
                        <tr>
                            <button @click="deleteRow(index)">删除</button>
                        </tr>
                    </tbody>
                </table></td>
            </tr>

            <tr v-if="EditData.edit.type !== 'WavaView'">
                <th>url:</th>
                <td> <input class="input has-text-primary" v-model="InputUrl" type="text"></td>
                <td><button class="button has-text-primary" style="margin-left: 15px;" @click="pathPoke">POKE</button>
                    <button class="button has-text-primary" style="margin-left: 15px;" @click="ParseUrl">ParseUrl</button></td>

            </tr>

            <tr v-if="EditData.edit.type === 'WavaView'">
                <th>Path:</th>
                <td> <input class="input has-text-primary" v-model="InputPath" type="text"></td>

            </tr>

            <tr v-if="EditData.edit.type === 'WavaView'">
                <th>TimePath:</th>
                <td> <input class="input has-text-primary" v-model="InputTimePath" type="text"></td>
                <td><button class="button has-text-primary" style="margin-left: 15px;" @click="pathPokeTimePath">POKE</button>
                    <button class="button has-text-primary" style="margin-left: 15px;" @click="ParseUrl">ParseUrl</button></td>

            </tr>

            <tr v-for="(prop,key) in EditData.props" :key="key">
                <th v-if="key !== 'StateIndicatorFile'">{{key}}</th>
                <td v-if="key !== 'StateIndicatorFile'"><input v-if="key !== 'titleSize'"  class="input has-text-primary" v-model="EditData.props[key]" type="text">
                    <div class="select" v-if="key === 'titleSize'">
                        <select v-model="EditData.props.titleSize">
                            <option>is-small</option>
                            <option>is-medium</option>
                            <option>is-large</option>
                        </select>
                    </div>
                </td>
                <td v-if="key !== 'StateIndicatorFile'">
                    <div v-if="key === 'unit'">
                        <toggle-button v-model="EditData.edit.isShowStateVlaue"
                                       width="80"
                                       height="30"
                                       switch-color="{checked: '#25EF02', unchecked: 'linear-gradient(red, yellow)'}"
                                       :labels="{checked: 'show', unchecked: 'hide'}"/>
                    </div>
                    <div v-if="key ==='EventType'">
                      <toggle-button v-model="EditData.edit.isSubscribe"
                                     width="80"
                                     height="30"
                                     switch-color="{checked: '#25EF02', unchecked: 'linear-gradient(red, yellow)'}"
                                     :labels="{checked: 'show', unchecked: 'hide'}"/>
                    </div>
                </td>
            </tr>

            <tr v-for="(prop,key) in EditData.props.StateIndicatorFile" :key="key">
                <th>{{key}}</th>
                <td>
                    <input class="input has-text-primary" v-model="EditData.props.StateIndicatorFile[key]" type="text">
                </td>
            </tr>

            <tr v-if="EditData.edit.type === 'state'">
                <th>ShowStateValue</th>
                <td>
                    <toggle-button v-model="EditData.edit.isShowStateVlaue"
                                   width="80"
                                   height="30"
                                   switch-color="{checked: '#25EF02', unchecked: 'linear-gradient(red, yellow)'}"
                                   :labels="{checked: 'show', unchecked: 'hide'}"/>
                </td>
            </tr>

            <tr v-show="isShowParams">
                <th>Params</th>
                <td>
                    <div v-for="(label, index) in userInputData.keys()" :key="index" class="column">

                        <div class="field is-horizontal" style="margin:5px">
                            <div class="field-label is-normal">
                                <label class="label">{{label}}</label>
                            </div>
                          <div class="field-body">
                              <div class="field">
                                  <div class="control">
                                      <input class="input" type="text" v-model="EditData.params.tempUserInputData[label]">
                                  </div>
                              </div>
                          </div>
                      </div>

                    </div>
                </td>

            </tr>

            <tr v-show="isShowParseUrl">
                <th>Params</th>
                <td>
                    <div v-for="(label, index) in userInputData.keys()" :key="index" class="column">

                        <div class="field is-horizontal" style="margin:5px">
                            <div class="field-label is-normal">
                                <label class="label">{{label}}</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                    <div class="control">
                                        <input class="input" type="text" v-model="EditData.params.tempUserInputData[label]">
                                    </div>
                                </div>
                            </div>

                    <toggle-button v-model="isShowConfig"
                                   @change="SetLoad(label)"
                                   width="80"
                                   height="30"
                                   style="margin-left: 15px;"
                                   switch-color="{checked: '#25EF02', unchecked: 'linear-gradient(red, yellow)'}"
                                   :labels="{checked: 'config', unchecked: 'hide'}"/>

                        </div>

                    </div>
                </td>

            </tr>
            <tr >
                <th>Finish</th>
                <td> <button class="button is-light " @click="apply"> Apply</button></td>

            </tr>

            </tbody>
        </table>

    </div>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PathProcessor from './models/PathProcessor'
import axios from 'axios'
import { GridItemData, GridLayout, GridItem } from 'vue-grid-layout'

import { WidgetRef } from './models/WidgetRef'
import { WidgetConfig, AllWidgetConfig } from './models/WidgetConfig'
import { Action, UpdatePayload } from './models/UpdatePayload'
import StrMapObjChange from './models/StrMapObjChange'
import { Widget } from './models/widget'

// this is the view selecotr class
@Component({
  components: {

  }
})
export default class WindowsApp extends Vue {
    pathProcessor = new PathProcessor();
    strMapObjChange = new StrMapObjChange();
    // EditPathPoke : string = '';
    isShowParams: boolean = false;
    isShowParseUrl : boolean = false;
    userInputData = new Map<string, string>();
    tempUserInputData:{[key: string]: string} = {};
    pathwithVar: string = '';
    InputUrl:string = '';
    InputPath:string = '';
    InputTimePath:string = '';
    isShowConfig:boolean = false;
    // fontSize:number =  null;
    // StateFile:any = {};
    // StateIndicatorFile:any = {};

    config: WidgetConfig = {
      WidgetComponentName: '',
      data: {
        url: '',
        get: { url: '', userInputData: '' },
        set: { url: '', userInputData: '' },
        displayname: '',
        userInputData: ''
      }
    };

    EditData:any={};

    created () {
      var localURL = window.location.hash
      if (localURL.indexOf('?') !== -1) {
        // var url = localURL.substr(1); //for test
        var url = localURL.substr(3) // for build
        console.log(url)
        var httpData = unescape(url) // for build
        console.log(httpData)
        // var jsondata = decodeURIComponent(httpData);
        // console.log(jsondata);
        // var jsondata = decodeURI(httpData); //for build
        var data = JSON.parse(httpData)
        console.log(data)
        this.EditData = data
      }

      /* var localURL = location.search
      if (localURL.indexOf('?') !== -1) {
        var url = localURL.substr(1)
        var httpData = unescape(url)
        console.log(httpData)
        // var jsondata = decodeURI(url);
        var data = JSON.parse(httpData)
        console.log(data)
        this.EditData = data
      } */
    }

    mounted () {
      this.updateView()
    }

    updateView () {
      // this.isShowParams = true;
      if (this.EditData.edit.parseUrl !== '') {
        this.InputUrl = this.EditData.edit.parseUrl
        this.isShowParseUrl = true
        console.log('1')
        this.setVariableList(
          this.pathProcessor.extractVarFromPath(this.EditData.edit.parseUrl)
        )
      } else if (this.EditData.edit.url !== '' && typeof (this.EditData.edit.url) !== 'undefined') {
        console.log('2')
        this.InputUrl = this.EditData.edit.url
        this.isShowParams = true
        this.setVariableList(
          this.pathProcessor.extractVarFromPath(this.EditData.params.PokedPath)
        )
      } else if (this.EditData.edit.path !== '' && typeof (this.EditData.edit.path) !== 'undefined') {
        console.log('3')
        this.InputPath = this.EditData.edit.path
        this.InputTimePath = this.EditData.edit.timePath
        this.isShowParams = true
        this.setVariableList(
          this.pathProcessor.extractVarFromPath(this.EditData.params.PokedTimePath)
        )
        this.setVariableList(
          this.pathProcessor.extractVarFromPath(this.EditData.params.PokedPath)
        )
      }
      console.log(this.EditData.params.shouldUpdate)
      if (this.EditData.params.shouldUpdate === true) {
        this.setVariableInput(this.strMapObjChange.objToStrMap(this.EditData.params.userInputData))
        this.EditData.params.shouldUpdate = false
        // this.apply();
      }
    }

    addInput () {
      this.EditData.edit.UserInnputUrl.push({})
    }

    deleteRow (index) {
      this.EditData.edit.UserInnputUrl.splice(index, 1)
    }

    /* loadTextFromStateFile(ev: any){
            const file = ev.target.files[0];
            //console.log(file);
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = e => {
            this.StateFile = JSON.parse((e.target as any).result);
            this.EditData.params.StateFile = this.StateFile;
            };

        }

        loadTextFromStateIndicatorFile(ev: any){
            const file = ev.target.files[0];
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = e => {
                this.StateIndicatorFile = JSON.parse((e.target as any).result);
                this.EditData.params.StateIndicatorFile = this.StateIndicatorFile;
            };

        } */

    apply () {
      var Args: UpdatePayload = {
        action: this.EditData.params.action,
        variables: this.getVariableValues(),
        target: ['self']
      }
      this.EditData.params.Args = Args
      console.log(this.EditData)
      // this.getVariableValues();
      // console.log(this.userInputData);
      this.EditData.params.userInputData = this.userInputData
      console.log(this.EditData)
      // this.EditData.params.tempUserInputData = this.tempUserInputData;
      window.opener.UpdateWidget(this.EditData)
    }

    pathPoke () {
      this.EditData.edit.parseUrl = ''
      this.EditData.edit.url = this.InputUrl
      this.isShowParams = true
      window.opener.UpdateWidget(this.EditData)
    }

    // wava

    pathPokeTimePath () {
      this.EditData.edit.path = this.InputPath
      this.EditData.edit.timePath = this.InputTimePath
      this.isShowParams = true
      window.opener.UpdateWidget(this.EditData)
    }

    ParseUrl () {
      this.EditData.edit.url = ''
      this.isShowParams = false
      this.EditData.edit.parseUrl = this.InputUrl
      this.isShowParseUrl = true
      this.setVariableList(
        this.pathProcessor.extractVarFromPath(this.InputUrl)
      )
      if (this.EditData.params.shouldUpdate === true) {
        this.setVariableInput(this.strMapObjChange.objToStrMap(this.EditData.params.userInputData))
        this.EditData.params.shouldUpdate = false
        // this.apply();
      }
    }

    SetLoad (label:string) {
      if (this.isShowConfig === true) {
        this.EditData.edit.setConfigUrl = this.EditData.edit.parseUrl
        if (this.EditData.edit.parseUrl.search(label) !== -1) {
          var exp = '/$' + label + '$'
          this.EditData.edit.parseUrl = this.EditData.edit.parseUrl.replace(exp, '')
          this.EditData.edit.setLabel = label
        }
      }
    }

    setVariableInput (parentUserInputData:Map<string, string>) {
      console.log(parentUserInputData)
      for (var key of parentUserInputData.keys()) {
        this.tempUserInputData[key] = parentUserInputData.get(key) as string
      }
      console.log(this.tempUserInputData)
      this.EditData.params.tempUserInputData = this.tempUserInputData
    }

    setVariableList (path: string[]) {
      this.userInputData.clear()
      path.forEach(element => {
        this.userInputData.set(element, '')
      })
      console.log(this.userInputData)
      // this.EditData.params.userInputData = this.userInputData;
      this.$forceUpdate()
    }

    getVariableValues (): Map<string, string> {
      for (var key of this.userInputData.keys()) {
        this.userInputData.set(key, this.EditData.params.tempUserInputData[key])
      }
      return this.userInputData
    }
}
</script>

<style lang="scss">

    // Import Bulma's core

    @import "~bulma/sass/utilities/_all";

    $selected: #843fdc;
    $colors: (
            "info": ($info, $info-invert),
    );

    // Import Bulma and Buefy styles
    //@import "~bulma";
    //@import "~buefy/src/scss/buefy";

</style>
