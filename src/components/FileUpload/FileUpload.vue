<template>
  <div class="container" style="padding-bottom: 30px;padding-right: 30px;margin-top: 30px;" >
<!--    <input type="file" @change="getBase64"></input>-->
<!--    <link type="text/css" href=”lib/jquery-ui-1.8.2.custom/css/custom-theme/jquery-ui-1.8.2.custom.css" rel=" stylesheet" />-->
    <div class="columns content " v-bind:class="EditData.props.titleSize" style="margin-bottom: 0px;padding-left: 7px;">
      <div class="column content-table-cell-heading-color is-narrow" style="margin: 0px;padding: 0px;">
        <h3>{{EditData.props.title}}</h3>
      </div>
    </div>

      <section>
        <b-field>
          <b-upload v-model="dropFiles"
                    multiple
                    drag-drop>
            <section class="section">
              <div class="content has-text-centered">
                <p>
                  <b-icon
                    icon="upload"
                    size="is-large">
                  </b-icon>
                </p>
                <p>Drop your files here or click to upload</p>
              </div>
            </section>
          </b-upload>
        </b-field>

        <div class="tags">
            <span v-for="(file, index) in dropFiles"
                  :key="index"
                  class="tag is-primary" >
                {{file.name}}
                <button class="delete is-small"
                        type="button"
                        @click="deleteDropFile(index)">
                </button>
            </span>
        </div>
      </section>
    <div class="notification is-primary">
      <div class="buttons">
        <b-button type="is-primary" @click="getBase64()" inverted>GetBase64String</b-button>
        <b-button type="is-primary" @click="UploadData(pathwithVar)" inverted>Upload</b-button>
      </div>
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
import { UpdatePayload } from '../Base/UpdatePayload'
import axios from 'axios'

  @Component({
    components: {
      rightClickMenu
    }
  })
export default class FileUpload extends Widget {
    WidgetComponentName = 'FileUpload';
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
    dropFiles = [];
    uploadPath: string = '';

    config: WidgetConfig = {
      WidgetComponentName: 'FileUpload',
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
        //fontSize: 25,
        title: '',
        titleSize: ''
      },
      params: {
        PokedPath: this.EditPathPoke,
        action: 'get',
        Args: {},
        tempUserInputData: {},
        shouldUpdate: false,
        userInputData: {}
      }
    };
    deleteDropFile(index: any) {
      this.dropFiles.splice(index, 1)
    }


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

    async UploadData (url: string) {
      console.log(this.base64String)
      let apiLoad = url
      //let apiLoad = 'http://localhost:8001/testThing/u/1'
      console.log(apiLoad)
      const data = { file : this.base64String };
      const options = {
          headers:
            {
              "content-type": "application/json"
            }
      };
      await window.$axios.put(apiLoad, data,options)
        .then(res => {
           console.log(res)
         }).catch(err => {
           console.log(err)
         })
    }

    viewLoad (Args: UpdatePayload) {
      this.viewFileUpLoad(Args)
    }

    async viewFileUpLoad (Args: UpdatePayload) {
      // this.config.data.userInputData = Args.variables;
      this.userInputData = Args.variables
      if (this.EditData.edit.parseUrl !== '') {
        if (this.EditData.edit.url === '') {
          this.config.data.url = this.EditData.edit.parseUrl
        } else {
          this.config.data.url = this.EditData.edit.url
        }
      }
      console.log(this.config.data.url)
      console.log(this.userInputData)
      console.log('test fileupload')
      this.pathwithVar = this.pathProcessor.FillPathWithVar(
        // this.config.data.userInputData,
        this.userInputData,
        this.config.data.url
      )
      console.log('pathwithVar')
      console.log(this.pathwithVar)
      // let split = this.pathwithVar.split('?s=',2)
      // this.uploadPath = split[0] + '/' + split[1]
      // await this.UploadData(this.pathwithVar)
    }

    /* constructor () {
        super(this.index, this.refIndex)
      } */

    parentUpdate (payload: UpdatePayload): void {
      // super.parentUpdate(payload)
      // this.viewLoad(this.EditData.params.Args)
    }

    getBase64 () {
      let file = this.dropFiles[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        if (e.target) {
          this.base64String = e.target.result;
          let split = this.base64String.split('base64,',2)
          this.base64String = split[1]
          // console.log(this.base64String)
        }
      }
    }

}

</script>

<style scoped>

</style>
