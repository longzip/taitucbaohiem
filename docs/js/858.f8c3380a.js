"use strict";(self["webpackChunktodo_buudienxatulap"]=self["webpackChunktodo_buudienxatulap"]||[]).push([[858],{4026:(t,e,a)=>{a.d(e,{Z:()=>d});var n=a(9835),o=a(6970);const i={class:"text-bold text-subtitle1"};function s(t,e,a,s,l,h){const u=(0,n.up)("q-banner");return(0,n.wg)(),(0,n.j4)(u,{dense:"","inline-actions":"",class:(0,o.C_)([a.bgcolor,"list-header text-white text-center"])},{default:(0,n.w5)((()=>[(0,n._)("span",i,[(0,n.WI)(t.$slots,"default")])])),_:3},8,["class"])}const l={props:["bgcolor"]};var h=a(1639),u=a(7128),c=a(9984),r=a.n(c);const p=(0,h.Z)(l,[["render",s]]),d=p;r()(l,"components",{QBanner:u.Z})},8500:(t,e,a)=>{a.d(e,{Z:()=>T});var n=a(9835),o=a(6970);const i=(0,n.Uk)(" Mã hộ:"),s=["href"],l=["href"];function h(t,e,a,h,u,c){const r=(0,n.up)("q-icon"),p=(0,n.up)("q-item-label"),d=(0,n.up)("q-item-section"),m=(0,n.up)("q-item");return(0,n.wg)(),(0,n.j4)(m,{class:(0,o.C_)({"bg-warning":a.bhyt.coTheUuTienCaoHon,"bg-positive":c.getDateDiff(a.bhyt.denNgayDt)>30,"bg-blue-grey":c.getDateDiff(a.bhyt.denNgayDt)<1})},{default:(0,n.w5)((()=>[(0,n.Wm)(d,null,{default:(0,n.w5)((()=>[(0,n.Wm)(p,null,{default:(0,n.w5)((()=>[(0,n.Wm)(r,{class:(0,o.C_)(1==a.bhyt.gioiTinh?"text-pink":"text-primary"),name:1==a.bhyt.gioiTinh?"female":"male"},null,8,["class","name"]),(0,n.Uk)((0,o.zw)(a.bhyt.hoTen)+" "+(0,o.zw)(a.bhyt.ngaySinhDt)+" ",1),(0,n.Wm)(r,{onClick:e[0]||(e[0]=t=>c.xacNhanLoaiBo(a.bhyt)),name:1==a.bhyt.disabled?"do_not_disturb_on":"delete_forever",color:1==a.bhyt.disabled?"red":"gray"},null,8,["name","color"])])),_:1}),(0,n.Wm)(p,{caption:"",lines:"2"},{default:(0,n.w5)((()=>[i,(0,n._)("a",{target:"_blank",href:`https://longzip.github.io/todo-buudienxatulap/#/ho-gia-dinh/${a.bhyt.maHoGd}`},(0,o.zw)(a.bhyt.maHoGd),9,s)])),_:1}),(0,n.Wm)(p,{caption:"",lines:"2"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(a.bhyt.soTheBhyt),1)])),_:1}),(0,n.Wm)(p,{caption:"",lines:"2"},{default:(0,n.w5)((()=>[(0,n.Uk)("5 năm:"+(0,o.zw)(a.bhyt.ngay5Nam),1)])),_:1}),(0,n.Wm)(p,{caption:"",lines:"2"},{default:(0,n.w5)((()=>[(0,n._)("a",{href:`tel:${a.bhyt.soDienThoai}`},(0,o.zw)(a.bhyt.soDienThoai),9,l)])),_:1})])),_:1}),(0,n.Wm)(d,{side:"",top:""},{default:(0,n.w5)((()=>[(0,n.Wm)(p,{caption:""},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(c.getDateDiff(a.bhyt.denNgayDt)),1)])),_:1}),(0,n.Wm)(p,{caption:""},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(a.bhyt.denNgayDt),1)])),_:1}),(0,n.Wm)(r,{onClick:e[1]||(e[1]=t=>c.xacNhanTheoDoi(a.bhyt)),name:"star",color:1==a.bhyt.completed?"yellow":"gray"},null,8,["color"])])),_:1})])),_:1},8,["class"])}var u=a(3100),c=a(4376);const r={props:["bhyt"],methods:{...(0,u.nv)("bhyts",["loaiBo","theoDoi"]),xacNhanLoaiBo(t){this.$q.dialog({title:"Confirm",message:"Bạn có muốn loại bỏ?",ok:{push:!0},cancel:{color:"negative"},persistent:!0}).onOk((()=>{this.loaiBo(t)}))},xacNhanTheoDoi(t){this.$q.dialog({title:"Confirm",message:"Bạn có muốn theo dõi?",ok:{push:!0},cancel:{color:"negative"},persistent:!0}).onOk((()=>{this.theoDoi(t)}))},getDateDiff(t){return c.ZP.getDateDiff(new Date(t),new Date,"days")}}};var p=a(1639),d=a(490),m=a(1233),b=a(3115),g=a(2857),y=a(9984),w=a.n(y);const f=(0,p.Z)(r,[["render",h]]),T=f;w()(r,"components",{QItem:d.Z,QItemSection:m.Z,QItemLabel:b.Z,QIcon:g.Z})},8858:(t,e,a)=>{a.r(e),a.d(e,{default:()=>Z});var n=a(9835),o=a(1957);const i=(0,n.Uk)("Phát sinh thẻ BHYT"),s={class:"q-gutter-y-md column"};function l(t,e,a,l,h,u){const c=(0,n.up)("ListHeader"),r=(0,n.up)("q-icon"),p=(0,n.up)("q-input"),d=(0,n.up)("ThongTinTheBHYT"),m=(0,n.up)("q-separator"),b=(0,n.up)("q-list"),g=(0,n.up)("q-page");return(0,n.wg)(),(0,n.j4)(g,null,{default:(0,n.w5)((()=>[(0,n.Wm)(c,{bgcolor:"bg-orange-4"},{default:(0,n.w5)((()=>[i])),_:1}),(0,n._)("div",s,[(0,n.Wm)(p,{outlined:"",modelValue:h.searchText,"onUpdate:modelValue":e[1]||(e[1]=t=>h.searchText=t),onKeyup:(0,o.D2)(u.timKiem,["enter"]),placeholder:"Mã số BHXH",hint:"Mã số cách nhau bởi dấu phẩy, nhấn Enter để tìm kiếm",dense:""},{append:(0,n.w5)((()=>[""!==h.searchText?((0,n.wg)(),(0,n.j4)(r,{key:0,name:"close",onClick:e[0]||(e[0]=t=>h.searchText=""),class:"cursor-pointer"})):(0,n.kq)("",!0),(0,n.Wm)(r,{name:"search"})])),_:1},8,["modelValue","onKeyup"])]),((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(h.bhyts,(t=>((0,n.wg)(),(0,n.j4)(b,{key:t.id},{default:(0,n.w5)((()=>[(0,n.Wm)(d,{bhyt:t},null,8,["bhyt"]),(0,n.Wm)(m,{spaced:"",inset:""})])),_:2},1024)))),128))])),_:1})}var h=a(3100),u=a(9981),c=a.n(u),r=a(6950),p=a(8359),d=a(8500),m=a(4026);const b={components:{ThongTinTheBHYT:d.Z,ListHeader:m.Z},data(){return{searchText:"",bhyts:[]}},computed:{...(0,h.Se)("auth",["isLogin"])},methods:{async timKiem(){this.bhyts=[],r.Z.show({spinner:p.Z,spinnerSize:"100px"});let t=this.searchText.split(",");for(let a=0;a<t.length;a++){const n=t[a];try{await this.xem(n)}catch(e){console.log(e)}}r.Z.hide()},async luu(t){let{data:e}=await c().put(`https://cmsbudientulap.herokuapp.com/api/bhyts/${t.maSoBhxh}`,t);return e},async completed(t){let{data:e}=await c().put(`https://cmsbudientulap.herokuapp.com/api/bhyts/${t.maSoBhxh}/completed`,{completed:!0});return e},async xem(t){let e=await c().get(`https://ssm-api.vnpost.vn/api/services/app/TraCuu/TraCuuThongTinBHYT?maSoBhxh=${t}`,{headers:{Authorization:`Bearer ${this.isLogin}`}});await this.luu(e.data.result.thongTinTheHGD);let a=await this.completed(e.data.result.thongTinTheHGD);this.bhyts.push(a)}}};var g=a(1639),y=a(9885),w=a(361),f=a(2857),T=a(3246),_=a(926),D=a(9984),k=a.n(D);const x=(0,g.Z)(b,[["render",l]]),Z=x;k()(b,"components",{QPage:y.Z,QInput:w.Z,QIcon:f.Z,QList:T.Z,QSeparator:_.Z})}}]);