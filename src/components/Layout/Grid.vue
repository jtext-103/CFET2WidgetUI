<template>
  <div  class="container" style="margin-top: 30px;margin-left: 0px;margin-right: 0px;">
    <hr style="height:3px;border:none;border-top:3px double #aca6a1;" />
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

export default class Grid extends Widget {
    WidgetComponentName: string = 'Grid';
    @Prop() index:number;
    @Prop() refIndex:number;

    config: WidgetConfig = {
      WidgetComponentName: 'Grid',
      data: {
      }
    };

    EditData:EditData = {
      edit: {
        type: 'Grid',
        index: this.refIndex
      },
      props: {
        color: '',
        title: ''
      },
      params: {
      }
    };

    del () {
      this.$emit('del', this.index)
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

    setConfig (setConfigData: [WidgetConfig, object], fragment:string): void {
      super.setConfig(setConfigData, fragment)
    }
}
</script>

<style scoped>
  .waveView {
    width: 100%;
    height: auto;
  }

  .hflex{
    display: flex;
    flex-direction: row-reverse;
    align-items: center;

  }

</style>
