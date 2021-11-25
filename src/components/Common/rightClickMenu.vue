<template>
    <div id="rightClickMenu">
        <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
            <li class="xcolor" @click="openWindows">EDIT</li>
            <li class="ycolor" @click="del">DELETE</li>
            <!--<li class="xcolor" >SynchronizeX</li>
            <li class="ycolor" >SynchronizeY</li>
            <li class="xycolor" >SynchronizeXY</li>-->
        </ul>
    </div>

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { WidgetConfig } from '@/models/WidgetConfig'
import { UpdatePayload } from '@/models/UpdatePayload'

    @Component({
      components: {

      }
    })
export default class rightClickMenu extends Vue {
        visible = false;
        top = 0;
        left = 0;

        @Watch('visible')
        onvisibleChanged (val: boolean, oldVal: boolean) {
          if (val) {
            document.body.addEventListener('click', this.closeMenu)
          } else {
            document.body.removeEventListener('click', this.closeMenu)
          }
        }

        mounted () {

        }

        openWindows () {
          this.$emit('openWindows')
        }

        del () {
          console.log('d')
          this.$emit('del')
        }

        openMenu (e) {
          // var x = e.pageX;
          // var y = e.pageY;
          var x = e.offsetX
          var y = e.offsetY

          this.top = y
          this.left = x

          this.visible = true
          console.log(document.getElementsByClassName('rightClickMenu'))
        }

        closeMenu () {
          this.visible = false
        }
}
</script>
<style scoped>
    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    }

    .contextmenu li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        font-weight: bolder;
    }

    .contextmenu li:hover {
        background: #eee;
    }
    .xcolor{
        background-color: #00d7b2;
        color:white;
    }
    .ycolor{
        background-color: #ffe12c
    }
    .xycolor{
        background-color: #2d68e4;
        color:white;
    }
</style>
