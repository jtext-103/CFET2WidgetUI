export class WidgetRef {
    constructor() {
        // this is not quite right, the config for a resource should only be visual-wise,
        // the parameters of a resource should be probed by the widget itself
        this.widgetComponentName = '';
        this.ref = '';
        //below is for grid layout
        this.x = 0;
        this.y = 0;
        this.w = 8;
        this.h = 6;
        this.i = 0;
    }
}
//# sourceMappingURL=WidgetRef.js.map