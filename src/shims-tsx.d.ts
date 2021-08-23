import Vue, { VNode } from 'vue';

declare global {
  //window对象上的属性会报错，类型申明
  interface Window{
    UpdateWidget:any;
    $axios:any;
  }


  namespace JSX {

    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}

declare const $: {
  getJSON(url: string, cb: (data: any) => void): void;
  get(url: string, cb: (data: any) => void): void;
};
export {};

