
export default class PathProcessor {
    public FillPathWithVar(variables: Map<string, string>, path: string): string {
        //$ $  variables是userinoutdata是参数+参数值
        const urlRegExp = /(?<=\$)\w*(?=\$)/g;
        let str = '';
        //取出path中的$ $，数组
        const result = path.match(urlRegExp);
        console.log(result);
        if (result != null) {
            //遍历map和数组
            variables.forEach((value: string, key: string) => {
                result.forEach((label) => {
                    // tslint:disable-next-line:triple-equals
                    if (label == key) {
                        str = '\$' + label + '\$';
                        //将$xxx$替换成参数值  path为/card0/length/0
                        path = path.replace(str, value);
                    }
                });
            });
        }
        return path;
    }
    public extractVarFromPath(path: string): string[] {
        let inputLabel: string[];
        inputLabel = [];
        const urlRegExp = /(?<=\$)\w*(?=\$)/g;
        const result = path.match(urlRegExp);
        if (result != null) {
            result.forEach((element: string) => {
            if(element != "")
            {
                inputLabel.push(element);
            }
            });
        }
        console.log('extract'+inputLabel);
        return inputLabel;
    }
}






