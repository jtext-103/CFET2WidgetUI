<template>
  <div  class="container" id="RightClick" style="margin-top: 30px;">

    <div class="buttons">
      <button class="button has-text-info is-light is-medium is-fullwidth" style="padding: 4px;margin-bottom: 25px;" @click="isShowParams = !isShowParams">
        <span style="margin: auto;">Navigation</span>
      </button>
    </div>

    <div v-for="url in EditData.edit.UserInnputUrl" v-if="isShowParams">
      <a v-bind:href="url.url" target="_blank">{{url.url}}</a>
    </div>

    <div v-if="isShowParams">
      <a :href="EditData.params.parentPath" target="_blank">parentPath:{{ EditData.params.parentPath }}</a>
    </div>
    <div
      v-if="isShowParams"
      v-for="(path, index) in EditData.params.childrenPath"
      :key="index"
    >
      <a :href="path" target="_blank">childrenPath:{{path}}</a>
    </div>
    <rightClickMenu ref="rightClickMenu" @del="del" @openWindows="openWindows"></rightClickMenu>

  </div>
</template>

<script lang="ts">
import { Prop, Component, Watch, Vue } from 'vue-property-decorator'
import { Widget } from '../Base/widget'
import { EditData } from '../Base/EditData'
import { WidgetConfig } from '../Base/WidgetConfig'
import rightClickMenu from '../Common/rightClickMenu.vue'

  @Component({
    components: {
      rightClickMenu
    }
  })
export default class Navigation extends Widget {
    WidgetComponentName = 'Navigation';
    @Prop() index:number;
    @Prop() refIndex:number;

    userInputData = new Map<string, string>();

    isShowParams: boolean = false;
    parentPath!: string;
    childrenPath!: string[];

    config: WidgetConfig = {
      WidgetComponentName: 'Navigation',
      data: {
        url: '',
        displayname: '',
        userInputData: ''
      }
    };

    EditData:EditData = {
      edit: {
        UserInnputUrl: [],
        url: '',
        type: 'Navigation',
        index: this.refIndex
      },
      props: {
      },
      params: {
        action: 'get',
        Args: {},
        tempUserInputData: {},
        parentPath: '',
        childrenPath: []
      }
    };

    del () {
      this.$emit('del', this.index)
    }

    updateUI () {
      this.openWindows()
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
      this.config = setConfigData[0]
      this.EditData = setConfigData[1]
    }

    pathPoke () {
      var apiLoad = this.EditData.edit.url
      window.$axios.get(apiLoad).then(response => {
        this.EditData.params.parentPath = response.data.ParentPath as string
        this.EditData.params.childrenPath = response.data.ChildrenPath as string[]
      })
    }
    /* constructor () {
        super(this.index, this.refIndex)
      } */
}
</script>

<style scoped>

</style>
