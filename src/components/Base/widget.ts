import { Vue ,Component,Prop,Watch, Vue} from 'vue-property-decorator';
import { EditData } from './EditData';
import { WidgetConfig } from './WidgetConfig';
import * as webpack from "webpack";
import StrMapObjChange from "./StrMapObjChange";
import PathProcessor from "./PathProcessor";
import { UpdatePayload } from "./UpdatePayload";
import axios from "../../axios/index.js";


export class Widget extends Vue {

  /* constructor (index, refIndex) {
    super();
    this.index = index;
    this.refIndex = refIndex;
  } */

  WidgetComponentName = '';
  pathProcessor = new PathProcessor();
  strMapObjChange = new StrMapObjChange();
  EditPathPoke : string = '';
  sample : any;
  userInputData = new Map<string, string>();
  pathwithVar: string = '';
  StatusValue: string = 'undefined';


  public config : WidgetConfig = {
    WidgetComponentName: '',
    data: {
      url: ''
    }
  };

  public EditData : EditData = {
    edit: {
      type: '',
      parseUrl: '',
      url: this.config.data.url,
      isSubscribe: false
    },
    props: {
    },
    params: {
      PokedPath: '',
      Args: {},
      userInputData:this.userInputData
    }
  };

  isShowPath: boolean = false;

  /* public del(index:number){
    this.$emit('del', index);
  } */


  public openWindows (){
    var fragment = window.location.origin;
    var JsonData = JSON.stringify(this.EditData);
    var httpData = encodeURIComponent(JsonData);
    var url =fragment+"/WindowsAppIndex.html/?";
    console.log(this.EditData);
    window.open(url+httpData, "WidgetWindow",'height=400, width=800, top=200, left=400, toolbar=no');
  }

  public updateUI () {
    this.EditData.params.PokedPath = this.config.data.url;
    this.EditData.edit.url = this.config.data.url;
    this.openWindows()
  }

  public getConfig(): [WidgetConfig, object] {

    return [this.config,this.EditData];

  }

  public setConfig(setConfigData: [WidgetConfig,object],fragment:string): void {

    this.config = setConfigData[0];
    this.EditData = setConfigData[1];
    console.log(this.EditData)

    if(this.WidgetComponentName !== 'Grid') {
      if (this.EditData.edit.url.search("startpath") != -1) {
        this.replaceStartPath(fragment)
      }
      if (this.EditData.edit.parseUrl.search("startpath") != -1) {
        this.replaceStartPath(fragment)
      }

      var temp = this.EditData.params.tempUserInputData;
      //temp = unescape(temp);
      //console.log(temp);
      temp = JSON.parse(JSON.stringify(temp));
      temp = this.strMapObjChange.objToStrMap(temp);
      //this.EditData.params.tempUserInputData = temp;
      console.log(this.EditData)
      console.log(temp)

      var Args: UpdatePayload = {
        action: this.EditData.params.action,
        variables: temp,
        target: ["self"]
      };

      this.EditData.params.Args = Args;
      if(this.WidgetComponentName !== 'Method'){
        this.viewLoad(Args);
      }
    }

  }

  public pathPoke() {
    this.config.data.url = this.EditData.edit.url;
    this.EditPathPoke = this.EditData.edit.url;

    var pokepath = this.EditData.edit.url;
    console.log("pathpoke" + this.EditData.edit.url);
    window.$axios.get(pokepath).then((response: { data: any; }) => {
      this.samplePoke(response.data);
      console.log(response.data);
      this.updateUI();
    }).catch(err => {
      this.EditData.params.PokedPath = this.config.data.url;
      this.openWindows();
    });

  }

  //app
  public samplePoke(sample: any) {
    var samplePath = sample.CFET2CORE_SAMPLE_PATH;
    var pokedPath: string;
    pokedPath = samplePath;
    console.log("sam"+ pokedPath);
    var count: number = 0;

    var temp = sample.Actions.get.Parameters;
    temp = JSON.parse(JSON.stringify(temp));
    temp = this.strMapObjChange.objToStrMap(temp);
    var Parameters: Map<string, string>;
    Parameters = temp;

    Parameters.forEach((value, key) => {
      count++;
      if (count == 1) {
        pokedPath = pokedPath + "?";
      }
      pokedPath = pokedPath + key + "=$" + key + "$&";
    });

    if (count != 0) {
      pokedPath = pokedPath.substring(0, pokedPath.length - 1);
    }
    this.config.data.url = pokedPath;
  }

  public replaceStartPath(startPath: string): void {
    this.config.data.url = this.config.data.url.replace("$startpath$", startPath);
    this.EditData.edit.url = this.EditData.edit.url.replace("$startpath$", startPath);
    this.EditData.edit.parseUrl = this.EditData.edit.parseUrl.replace("$startpath$", startPath);
  }

  public async getData(url: string) {
    var apiLoad = url;
    await window.$axios.get(apiLoad)
      .then((response: { data: any; }) => {
        this.sample = response.data;
        console.log(response.data);
      })
  }

  public async invokeData(url: string) {
    var apiLoad = url;
    await window.$axios.put(apiLoad)
      .then((response: { data: any; }) => {
        this.sample = response.data;
      }).catch((err: any) =>{
          alert(err);
      });
  }


  //called when widgetParams action clicked
  public async viewLoad(Args: UpdatePayload) {

    // this.config.data.userInputData = Args.variables;
    //this.userInputData = Args.variables;
    this.userInputData =Args.variables;
    if(this.EditData.edit.url == ''){
      console.log("1"+this.EditData.edit.parseUrl);
      this.config.data.url = this.EditData.edit.parseUrl;
    }else {
      this.config.data.url = this.EditData.edit.url;
    }
    this.pathwithVar = this.pathProcessor.FillPathWithVar(
      // this.config.data.userInputData,
      this.userInputData,
      this.config.data.url
    );
    console.log(this.pathwithVar);
    if(this.EditData.edit.isSubscribe === true){
      this.connectScoketAndSubscribe(this.pathwithVar);
    }



    //await this.getData(this.pathwithVar);

  }

  public connectScoketAndSubscribe(pathwithVar: string){
    var _this = this;
    if(pathwithVar.search("http:\/\/") != -1){

      pathwithVar = pathwithVar.substr(7);
      var index = pathwithVar.indexOf("\/");
      var userInputIP = pathwithVar.substr(0,index);

      var portIndex = userInputIP.indexOf(":");
      var ipstr = userInputIP.substr(0,portIndex+1);
      var portstr = userInputIP.substr(portIndex+1);
      var portNum = Number(portstr) + 1;

      var userIp = ipstr + portNum.toString();
      pathwithVar = pathwithVar.substr(index);
      var wsPath = ("ws:" +"\/\/"+userIp).toString();
      var ws = new WebSocket(wsPath);

    }else{

      var ws = new WebSocket("ws://localhost"+":"+window.location.port+1);
      console.log("ws://localhost"+":"+window.location.port+1);
    }

    ws.onopen = function(evt) {
      console.log("Connection open");
      ws.send("{'SourcesAndTypes':[{'Source':'"+pathwithVar+"','EventType':'"+_this.EditData.props.EventType+"'}],'action':0}");
    };


    ws.onmessage = function(evt) {

      var responseData = JSON.parse(evt.data);
      _this.sample = responseData.Sample.Context;
      console.log(_this.sample)
      //ws.close();
      _this.StatusValue = _this.sample.CFET2CORE_SAMPLE_VAL;

    };

    ws.onclose = function(evt) {
      console.log("Connection closed");}
  }

  parentUpdate(payload: UpdatePayload): void {
    if(Object.prototype.toString.call(this.EditData.params.userInputData) == '[object Map]'){
      this.userInputData = this.strMapObjChange.strMapToObj(
        this.EditData.params.userInputData);
    }else{
      this.userInputData = this.EditData.params.userInputData;
    }
    var temp = this.userInputData;
    temp = this.strMapObjChange.objToStrMap(temp);
    this.userInputData = temp;

    this.userInputData.forEach((value , key) =>{
      payload.variables.forEach((valueofpayload,keyofpayload)=>{
        if(key == keyofpayload && ((this.userInputData.get(key) as string) != (payload.variables.get(keyofpayload) as string)))
        {
          this.userInputData.set(key,payload.variables.get(keyofpayload) as string);
          console.log(this.userInputData);
          this.EditData.params.shouldUpdate = true;
          this.EditData.params.Args.variables = this.userInputData;
          this.pathwithVar = this.pathProcessor.FillPathWithVar(
            // this.config.data.userInputData,
            this.userInputData,
            this.config.data.url
          );
          //this.getData(this.pathwithVar);
        }
      });
    });
    this.EditData.params.userInputData = this.strMapObjChange.strMapToObj(this.userInputData);

  }



}
