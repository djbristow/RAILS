webpackJsonp([1],{"/KV2":function(t,a){},0:function(t,a){},"7Otq":function(t,a,e){t.exports=e.p+"static/img/logo.5b8857b.png"},JQIv:function(t,a){},NHnr:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var o=e("7+uW"),n={render:function(){var t=this.$createElement,a=this._self._c||t;return a("div",{attrs:{id:"app"}},[a("img",{attrs:{src:e("7Otq"),width:"150px"}}),this._v(" "),a("router-view")],1)},staticRenderFns:[]};var i=e("VU/8")({name:"App"},n,!1,function(t){e("JQIv")},null,null).exports,d=e("/ocq"),r=e("mtWM"),s=e.n(r),l=()=>s.a.create({baseURL:"http://localhost:3000"}),c={updateRs:t=>l().put("rs/"+t.id,t),getRsRfid:t=>l().get("rs_rfid/"+t),getRs:t=>l().get("rs/"+t.id),getRsRoad:t=>l().get("rs_road/"+t)},m=e("DmT9"),u=e.n(m).a.connect("http://localhost:3005"),h={name:"Manager",data:()=>({rollingstocks:[],connStatus:"Disconnected",isNarrowed:!0,isStriped:!0,newRoadName:"",newRoadNumber:"",newLocation:""}),mounted(){this.opensocketListener()},methods:{async getRs(t){let a={rfid:"",roadName:"unkn",roadNumber:"",location:"rfidRdr01"};a.rfid=t,this.newLocation=a.location;const e=await c.getRsRfid(t);""===e.data?this.rollingstocks.unshift(a):(a.roadName=e.data.roadName,a.roadNumber=e.data.roadNumber,this.rollingstocks.unshift(a))},opensocketListener(){u.on("connect",()=>{this.connStatus="Connected"}),u.on("disconnect",()=>{this.connStatus="Disconnected"}),u.on("rfidmsg",t=>{this.getRs(t.rfid)})},async updateRs(t){let a={rfid:t,roadName:this.newRoadName,roadNumber:this.newRoadNumber,location:this.newLocation};console.log(a.roadName);for(var e=0,o=0;o<this.rollingstocks.length;o++)this.rollingstocks[o].rfid===t&&(e=o);let n=this.newRoadName+"-"+this.newRoadNumber;console.log(n);const i=await c.getRsRoad(n);let d=i.data._id;i.data.aarCode;if(void 0===d)a.roadName="RS not in ",a.roadNumber="inventory";else{const e=await c.getRs({id:d});console.log(e.data),await c.updateRs({id:d,roadName:a.roadName,roadNumber:a.roadNumber,color:e.data.color,aarCode:e.data.aarCode,numberBlt:e.data.numberBlt,inSvcDate:e.data.inSvcDate,insideLength:e.data.insideLength,insideHeight:e.data.insideHeight,insideWidth:e.data.insideWidth,capacity:e.data.capacity,bldr:e.data.bldr,bltDate:e.data.bltDate,notes:e.data.notes,ltWeight:e.data.ltWeight,loadLimit:e.data.loadLimit,lastMaintDate:e.data.lastMaintDate,locationNow:e.data.locationNow,homeLocation:e.data.homeLocation,rsStatus:e.data.rsStatus,imageID:e.data.imageID,modelWeight:e.data.modelWeight,modelLength:e.data.modelLength,rfid:t})}this.rollingstocks[e]=a,this.newRoadName="",this.newRoadNumber=""}}},b={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("section",[e("div",{staticClass:"mgr"},[t._m(0),t._v(" "),e("div",{staticClass:"form"},[e("b-table",{attrs:{data:t.rollingstocks,striped:t.isStriped,narrowed:t.isNarrowed},scopedSlots:t._u([{key:"default",fn:function(a){return[e("b-table-column",{attrs:{field:"location",label:"Sensor",width:"100"}},[t._v(t._s(a.row.location))]),t._v(" "),e("b-table-column",{attrs:{field:"rfid",label:"RFID",width:"100"}},[t._v(t._s(a.row.rfid))]),t._v(" "),"unkn"===a.row.roadName?e("div",[e("b-table-column",{attrs:{field:"roadName",label:"Road Name and Number",width:"400"}},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.newRoadName,expression:"newRoadName"}],attrs:{placeholder:"Road Name"},domProps:{value:t.newRoadName},on:{input:function(a){a.target.composing||(t.newRoadName=a.target.value)}}}),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.newRoadNumber,expression:"newRoadNumber"}],attrs:{placeholder:"Road Number"},domProps:{value:t.newRoadNumber},on:{input:function(a){a.target.composing||(t.newRoadNumber=a.target.value)}}})]),t._v(" "),e("b-table-column",{attrs:{field:"_id",label:"Action",width:"100"}},[e("a",{attrs:{href:"#"},on:{click:function(e){t.updateRs(a.row.rfid)}}},[e("b-icon",{attrs:{icon:"check-circle-outline"}})],1)])],1):e("div",["inventory"===a.row.roadNumber?e("div",[e("b-table-column",{attrs:{field:"roadName",label:"Road Name and Number",width:"400"}},[e("span",{staticStyle:{color:"red"}},[t._v("RS not in inventory")])]),t._v(" "),e("b-table-column",{attrs:{field:"_id",label:"Action",width:"100"}},[e("p")])],1):e("div",[e("b-table-column",{attrs:{field:"roadName",label:"Road Name and Number",width:"400"}},[t._v(t._s(a.row.roadName)+" "+t._s(a.row.roadNumber))]),t._v(" "),e("b-table-column",{attrs:{field:"_id",label:"Action",width:"100"}},[e("p")])],1)])]}}])})],1)])])},staticRenderFns:[function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"center"},[a("p",{staticClass:"title is-5"},[this._v("Rollingstock RFID Manager")])])}]};var p=e("VU/8")(h,b,!1,function(t){e("g4dV")},"data-v-35c87fd6",null).exports;o.default.use(d.a);var f=new d.a({routes:[{path:"/",name:"Manager",component:p}]}),g=e("O3Oo"),N=e.n(g);e("/KV2");o.default.config.productionTip=!1,o.default.use(N.a),new o.default({el:"#app",data:{rollingstock:[]},router:f,components:{App:i},template:"<App/>"})},g4dV:function(t,a){}},["NHnr"]);
//# sourceMappingURL=app.e829a4979ba432ac0523.js.map