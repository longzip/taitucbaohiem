"use strict";(self["webpackChunktodo_buudienxatulap"]=self["webpackChunktodo_buudienxatulap"]||[]).push([[694],{4026:(t,e,a)=>{a.d(e,{Z:()=>p});var n=a(9835),o=a(6970);const h={class:"text-bold text-subtitle1"};function i(t,e,a,i,s,c){const l=(0,n.up)("q-banner");return(0,n.wg)(),(0,n.j4)(l,{dense:"","inline-actions":"",class:(0,o.C_)([a.bgcolor,"list-header text-white text-center"])},{default:(0,n.w5)((()=>[(0,n._)("span",h,[(0,n.WI)(t.$slots,"default")])])),_:3},8,["class"])}const s={props:["bgcolor"]};var c=a(1639),l=a(7128),r=a(9984),d=a.n(r);const m=(0,c.Z)(s,[["render",i]]),p=m;d()(s,"components",{QBanner:l.Z})},3162:(t,e,a)=>{a.d(e,{Z:()=>x});var n=a(9835),o=a(6970);const h=(0,n.Uk)(" Mã hộ:"),i=["href"],s=["href"],c=["href"];function l(t,e,a,l,r,d){const m=(0,n.up)("q-icon"),p=(0,n.up)("q-item-label"),y=(0,n.up)("q-item-section"),u=(0,n.up)("q-item");return(0,n.wg)(),(0,n.j4)(u,{class:(0,o.C_)({"bg-warning":a.bhyt.coTheUuTienCaoHon,"bg-positive":d.getDateDiff(a.bhyt.denNgayDt)>30,"bg-blue-grey-3":d.getDateDiff(a.bhyt.denNgayDt)<1})},{default:(0,n.w5)((()=>[(0,n.Wm)(y,null,{default:(0,n.w5)((()=>[(0,n.Wm)(p,null,{default:(0,n.w5)((()=>[(0,n.Wm)(m,{class:(0,o.C_)(1==a.bhyt.gioiTinh?"text-pink":"text-primary"),name:1==a.bhyt.gioiTinh?"female":"male"},null,8,["class","name"]),(0,n.Uk)((0,o.zw)(a.bhyt.hoTen||a.bhyt.hoVaTen)+" "+(0,o.zw)(a.bhyt.ngaySinhDt||a.bhyt.ngayThangNamSinh)+" ",1),(0,n.Wm)(m,{onClick:e[0]||(e[0]=t=>d.xacNhanLoaiBo(a.bhyt)),name:1==a.bhyt.disabled?"do_not_disturb_on":"delete_forever",color:1==a.bhyt.disabled?"red":"gray"},null,8,["name","color"])])),_:1}),(0,n.Wm)(p,{caption:"",lines:"2"},{default:(0,n.w5)((()=>[h,(0,n._)("a",{target:"_blank",href:`https://www.buudienxatulap.ga/wordpress/wp-pwa/#/ho-gia-dinh/${a.bhyt.maHoGd}`},(0,o.zw)(a.bhyt.maHoGd),9,i)])),_:1}),(0,n.Wm)(p,{caption:"",lines:"2"},{default:(0,n.w5)((()=>[(0,n._)("a",{target:"_blank",href:`https://www.buudienxatulap.ga/wordpress/wp-pwa/#/tra-cuu?q=${a.bhyt.soTheBhyt?a.bhyt.soTheBhyt:a.bhyt.maSoBhxh||a.bhyt.maSoBHXH}`},(0,o.zw)(a.bhyt.soTheBhyt?a.bhyt.soTheBhyt:a.bhyt.maSoBhxh||a.bhyt.maSoBHXH),9,s),(0,n.Wm)(m,{class:"q-ml-md",onClick:e[1]||(e[1]=t=>d.copyTextToClipboard(a.bhyt.soTheBhyt?a.bhyt.soTheBhyt:a.bhyt.maSoBhxh||a.bhyt.maSoBHXH)),name:"content_copy"}),(0,n.Wm)(m,{class:"q-ml-md",onClick:e[2]||(e[2]=t=>d.copyUrlToClipboard(a.bhyt.soTheBhyt?a.bhyt.soTheBhyt:a.bhyt.maSoBhxh||a.bhyt.maSoBHXH)),name:"share"})])),_:1}),(0,n.Wm)(p,{caption:"",lines:"2"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(a.bhyt.maKCB),1)])),_:1}),(0,n.Wm)(p,{caption:"",lines:"2"},{default:(0,n.w5)((()=>[(0,n.Uk)("5 năm:"+(0,o.zw)(a.bhyt.ngay5Nam||a.bhyt.trangThaiHoSoName),1)])),_:1}),(0,n.Wm)(p,{caption:"",lines:"2"},{default:(0,n.w5)((()=>[(0,n._)("a",{href:`tel:${a.bhyt.soDienThoai}`},(0,o.zw)(a.bhyt.soDienThoai),9,c)])),_:1})])),_:1}),(0,n.Wm)(y,{side:"",top:""},{default:(0,n.w5)((()=>[(0,n.Wm)(p,{caption:""},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(d.getDateDiff(a.bhyt.denNgayDt))+" ngày",1)])),_:1}),(0,n.Wm)(p,{caption:""},{default:(0,n.w5)((()=>[(0,n.Uk)("Đến:"+(0,o.zw)(a.bhyt.denNgayDt||a.bhyt.ngayDenHan),1)])),_:1}),(0,n.Wm)(m,{onClick:e[3]||(e[3]=t=>d.xacNhanTheoDoi(a.bhyt)),name:"star",color:1==a.bhyt.completed?"yellow":"gray"},null,8,["color"]),(0,n.Wm)(p,{caption:""},{default:(0,n.w5)((()=>[(0,n.Uk)("Cập nhật:"+(0,o.zw)(a.bhyt.updated_at?new Date(a.bhyt.updated_at).toLocaleDateString():a.bhyt.ngayLapString),1)])),_:1})])),_:1})])),_:1},8,["class"])}var r=a(3100),d=a(4376),m=a(4328);const p={props:["bhyt"],methods:{...(0,r.nv)("bhyts",["loaiBo","theoDoi"]),xacNhanLoaiBo(t){t.maSoBhxh||(t.maSoBhxh=t.maSoBHXH),this.$q.dialog({title:"Confirm",message:"Bạn có muốn loại bỏ?",ok:{push:!0},cancel:{color:"negative"},persistent:!0}).onOk((()=>{this.loaiBo(t)}))},xacNhanTheoDoi(t){t.maSoBhxh||(t.maSoBhxh=t.maSoBHXH),this.$q.dialog({title:"Confirm",message:"Bạn có muốn theo dõi?",ok:{push:!0},cancel:{color:"negative"},persistent:!0}).onOk((()=>{this.theoDoi(t)}))},getDateDiff(t){return d.ZP.getDateDiff(new Date(t),new Date,"days")},copyUrlToClipboard(t){navigator.clipboard.writeText(`https://www.buudienxatulap.ga/tra-thoi-han-bao-hiem-y-te/?q=${t}`).then((function(){m.Z.create({type:"positive",message:"Bạn đã sao chép thành công!"})}),(function(t){m.Z.create({type:"negative",message:"Không thực hiện được!"+t})}))},copyTextToClipboard(t){navigator.clipboard.writeText(t).then((function(){m.Z.create({type:"positive",message:"Bạn đã sao chép thành công!"})}),(function(t){m.Z.create({type:"negative",message:"Không thực hiện được!"+t})}))}}};var y=a(1639),u=a(490),b=a(1233),g=a(3115),w=a(2857),T=a(9984),f=a.n(T);const B=(0,y.Z)(p,[["render",l]]),x=B;f()(p,"components",{QItem:u.Z,QItemSection:b.Z,QItemLabel:g.Z,QIcon:w.Z})},7694:(t,e,a)=>{a.r(e),a.d(e,{default:()=>x});var n=a(9835);const o={class:"q-pa-md"},h=(0,n.Uk)("Danh sách thẻ BHYT cần gia hạn "),i={class:"q-gutter-y-md column"};function s(t,e,a,s,c,l){const r=(0,n.up)("q-btn"),d=(0,n.up)("ListHeader"),m=(0,n.up)("q-icon"),p=(0,n.up)("q-input"),y=(0,n.up)("ThongTinTheBHYT"),u=(0,n.up)("q-separator"),b=(0,n.up)("q-list");return(0,n.wg)(),(0,n.iD)("div",o,[(0,n.Wm)(d,{bgcolor:"bg-orange-4"},{default:(0,n.w5)((()=>[h,(0,n.Wm)(r,{rounded:"",color:"primary",onClick:e[0]||(e[0]=e=>t.dongBo()),icon:"sync"}),(0,n.Wm)(r,{rounded:"",color:"primary",onClick:e[1]||(e[1]=e=>t.copyTextToClipboard()),icon:"content_copy"})])),_:1}),(0,n._)("div",i,[(0,n.Wm)(p,{outlined:"",modelValue:t.searchText,"onUpdate:modelValue":e[3]||(e[3]=e=>t.searchText=e),placeholder:"Từ khóa",hint:"Tìm kiếm danh sách hiện tại",dense:""},{append:(0,n.w5)((()=>[""!==t.searchText?((0,n.wg)(),(0,n.j4)(m,{key:0,name:"close",onClick:e[2]||(e[2]=e=>t.searchText=""),class:"cursor-pointer"})):(0,n.kq)("",!0),(0,n.Wm)(m,{name:"search"})])),_:1},8,["modelValue"])]),((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(t.timBhyts(t.searchText),(t=>((0,n.wg)(),(0,n.j4)(b,{key:t.id},{default:(0,n.w5)((()=>[(0,n.Wm)(y,{bhyt:t},null,8,["bhyt"]),(0,n.Wm)(u,{spaced:"",inset:""})])),_:2},1024)))),128))])}a(702);var c=a(3100),l=a(4328),r=a(3162),d=a(4026);const m=(0,n.aZ)({components:{ThongTinTheBHYT:r.Z,ListHeader:d.Z},name:"IndexPage",data(){return{searchText:""}},methods:{...(0,c.nv)("bhyts",["getAllBhyts","dongBoDuLieu"]),async loadData(){await this.getAllBhyts({completed:"0",disabled:"0",hetHan:"1"})},async dongBo(){this.dongBoDuLieu(this.timBhyts(this.searchText).map((t=>t.maSoBhxh)).join())},copyTextToClipboard(){navigator.clipboard.writeText([...new Set(this.soDienThoais)].join()).then((function(){l.Z.create({type:"positive",message:"Bạn đã sao chép thành công!"})}),(function(t){l.Z.create({type:"negative",message:"Không thực hiện được!"+t})}))}},computed:{...(0,c.Se)("bhyts",["timBhyts","soDienThoais"])},mounted(){this.loadData()}});var p=a(1639),y=a(4455),u=a(361),b=a(2857),g=a(3246),w=a(926),T=a(9984),f=a.n(T);const B=(0,p.Z)(m,[["render",s]]),x=B;f()(m,"components",{QBtn:y.Z,QInput:u.Z,QIcon:b.Z,QList:g.Z,QSeparator:w.Z})}}]);