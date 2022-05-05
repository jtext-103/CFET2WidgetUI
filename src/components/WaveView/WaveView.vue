<template>
  <div  class="container" ref="RightClick" style="margin-top: 30px;">
    <div class="waveView">
      <div ref="wave">
      <setBasicParams ref="setBasicParams" @pathPoke="pathPoke" @pathPokeTime="pathPokeTime" @getPathId="getPathId" @updateConfig="updateConfig" :wave="wave" :refIndex="refIndex" :setConfig='config'></setBasicParams>
      </div>
    </div>
    <rightClickMenu ref="rightClickMenu" @del="del" @openWindows="openWindows"></rightClickMenu>
  </div>

</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop, Component, Watch, Vue, Prop } from 'vue-property-decorator'
import { WidgetConfig } from '../Base/WidgetConfig'
import rightClickMenu from '../Common/rightClickMenu.vue'
import setBasicParams from './setBasicParams.vue'
import { Widget } from '../Base/widget'
import { UpdatePayload } from '../Base/UpdatePayload'
import axios from 'axios'

  @Component({
    components: {
      rightClickMenu,
      setBasicParams
    }
  })
export default class waveView extends Widget {
    WidgetComponentName: 'WavaView';
    @Prop() index:number;
    @Prop() refIndex:number;
    wave: any = '';
    pathId: string = '';
    userInputData = new Map<string, string>();
    sampleVal!:any;
    EditPathPoke : string = '';
    config: WidgetConfig = {
      WidgetComponentName: 'WaveView',
      data: {
        url: {
          path: '',
          timePath: ''
        },
        userInputData: '',
        position: {
          x1: '',
          x2: '',
          y1: '',
          y2: ''
        }
      }
    };

    mounted () {
      this.wave = this.$refs.wave
    }

    del () {
      this.$emit('del', this.index)
    }

    openMenu (e) {
      this.$refs.rightClickMenu.openMenu(e)
    }

    openWindows () {
      (this.$refs.setBasicParams as setBasicParams).openWindows()
    }

    /*
    showPathIdConfig () {
      (this.$refs.setBasicParams as setBasicParams).showPathIdConfig()
    }

    refresh () {
      (this.$refs.setBasicParams as setBasicParams).refresh()
    } */

    updateUI () {
      (this.$refs.setBasicParams as setBasicParams).getSampleParams(this.config.data.url.path)
      if (Array.isArray(this.sampleVal)) {
        (this.$refs.setBasicParams as setBasicParams).sampleLoad(this.sampleVal)
      }
      // (this.$refs.setBasicParams as setBasicParams).viewLoad();
    }

    getPathId (pathId: string) {
      this.pathId = pathId
    }

    updateConfig (data:[WidgetConfig, object]) {
      this.config = data[0]
      this.EditData = data[1]
    }

    viewLoad (Args: UpdatePayload) {
      (this.$refs.setBasicParams as setBasicParams).viewLoad(Args)
    }

    /* samplePoke (sample:any) {
      var samplePath = sample.CFET2CORE_SAMPLE_PATH
      console.log('pathurl')
      console.log(samplePath)
      // 如果返回的path的url里面有已经poke出来的参数，则不再拼接
      var sampleReturnPath = samplePath.toString()
      if (sampleReturnPath.search('/?') === -1) {
        this.sampleVal = sample.CFET2CORE_SAMPLE_VAL
        var pokedPath:string
        pokedPath = samplePath
        var count:number = 0

        var temp = sample.Actions.get.Parameters
        temp = JSON.parse(JSON.stringify(temp))
        temp = this.strMapObjChange.objToStrMap(temp)
        var Parameters:Map<string, string>
        Parameters = temp

        Parameters.forEach((value, key) => {
          count++
          if (count === 1) {
            pokedPath = pokedPath + '?'
          }
          pokedPath = pokedPath + key + '=$' + key + '$&'
        })
        if (count !== 0) {
          pokedPath = pokedPath.substring(0, pokedPath.length - 1)
        }
        this.config.data.url.path = pokedPath
      }
    } */

    samplePokeWith (sample:any) {
      var samplePath = sample.CFET2CORE_SAMPLE_PATH
      console.log('jin')
      console.log(samplePath)
      var pokedPath
      if (samplePath !== undefined) {
        var sampleReturnPath = samplePath.toString()
        console.log(sampleReturnPath.indexOf('?'))
        if (sampleReturnPath.indexOf('?') === -1) {
          console.log('jin??')
          console.log(samplePath)
          pokedPath = this.parseUrl(sample, samplePath)
          this.config.data.url.path = pokedPath
        }
      } else {
        console.log('kong')
        pokedPath = this.parseUrl(sample, samplePath)
        this.config.data.url.path = pokedPath
        console.log('timePath')
        console.log(pokedPath)
      }
    }

    parseUrl (sample:any, samplePath:any) {
      var pokedPath:string
      pokedPath = samplePath
      var count:number = 0

      var temp = sample.Actions.get.Parameters
      temp = JSON.parse(JSON.stringify(temp))
      console.log(temp)
      temp = this.strMapObjChange.objToStrMap(temp)
      console.log(temp)
      var Parameters:Map<string, string>
      Parameters = temp

      Parameters.forEach((value, key) => {
        count++
        if (count === 1) {
          pokedPath = pokedPath + '?'
        }
        pokedPath = pokedPath + key + '=$' + key + '$&'
      })
      if (count !== 0) {
        pokedPath = pokedPath.substring(0, pokedPath.length - 1)
      }
      return pokedPath
    }

    samplePokeWithTime (sample:any) {
      var samplePath = sample.CFET2CORE_SAMPLE_PATH
      var pokedPath
      if (samplePath !== undefined) {
        var sampleReturnPath = samplePath.toString()
        if (sampleReturnPath.indexOf('?') === -1) {
          pokedPath = this.parseUrl(sample, samplePath)
          this.config.data.url.timePath = pokedPath
          console.log('timePath')
          console.log(pokedPath)
        }
      } else {
        pokedPath = this.parseUrl(sample, samplePath)
        this.config.data.url.timePath = pokedPath
        console.log('timePath')
        console.log(pokedPath)
      }
    }

    async pathPoke () {
      (this.$refs.setBasicParams as setBasicParams).EditData = this.EditData
      await (this.$refs.setBasicParams as setBasicParams).pathPoke()
      var f = this.config.data.url.path
      var pokepath = 'a'
      pokepath = f
      await axios.get(this.config.data.url.path).then(response => {
        console.log('pathpoke')
        console.log(response.data)
        this.samplePokeWith(response.data)
        this.updateUI()
      })
      if (this.config.data.url.path !== '' && this.config.data.url.timePath !== '') {
        // (this.$refs.setBasicParams as setBasicParams).getPathIdParams()
        (this.$refs.setBasicParams as setBasicParams).g
      }
    }

    async pathPokeTime () {
      (this.$refs.setBasicParams as setBasicParams).EditData = this.EditData
      await (this.$refs.setBasicParams as setBasicParams).pathPokeTime()
      // (this.$refs.setBasicParams as setBasicParams).updateConfig()
      var f = this.config.data.url.timePath
      var pokepath = 'a'
      pokepath = f
      await axios.get(this.config.data.url.timePath).then(response => {
        this.samplePokeWithTime(response.data)
        this.updateUI()
      })
      if (this.config.data.url.path !== '' && this.config.data.url.timePath !== '') {
        // (this.$refs.setBasicParams as setBasicParams).getPathIdParams()
      }
    }
}
</script>

<style scoped>
  .waveView{
    width:100%;
    height: auto;
  }

</style>
