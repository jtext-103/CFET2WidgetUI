import { Vue } from 'vue-property-decorator';
export class Widget extends Vue {
    /* constructor (index, refIndex) {
      super();
      this.index = index;
      this.refIndex = refIndex;
    } */
    del(index) {
        this.$emit('del', index);
    }
}
//# sourceMappingURL=widget.js.map