"use strict";(self["webpackChunktodo_buudienxatulap"]=self["webpackChunktodo_buudienxatulap"]||[]).push([[454],{4026:(t,e,a)=>{a.d(e,{Z:()=>y});var n=a(9835),o=a(6970);const h={class:"text-bold text-subtitle1"};function i(t,e,a,i,s,l){const c=(0,n.up)("q-banner");return(0,n.wg)(),(0,n.j4)(c,{dense:"","inline-actions":"",class:(0,o.C_)([a.bgcolor,"list-header text-white text-center"])},{default:(0,n.w5)((()=>[(0,n._)("span",h,[(0,n.WI)(t.$slots,"default")])])),_:3},8,["class"])}const s={props:["bgcolor"]};var l=a(1639),c=a(7128),r=a(9984),m=a.n(r);const u=(0,l.Z)(s,[["render",i]]),y=u;m()(s,"components",{QBanner:c.Z})},3162:(t,e,a)=>{a.d(e,{Z:()=>x});var n=a(9835),o=a(6970);const h=(0,n.Uk)(" Mã hộ:"),i=["href"],s=["href"],l=["href"];function c(t,e,a,c,r,m){const u=(0,n.up)("q-icon"),y=(0,n.up)("q-item-label"),d=(0,n.up)("q-item-section"),p=(0,n.up)("q-item");return(0,n.wg)(),(0,n.j4)(p,{class:(0,o.C_)({"bg-warning":a.bhyt.coTheUuTienCaoHon,"bg-positive":m.getDateDiff(a.bhyt.denNgayDt)>30,"bg-blue-grey-3":m.getDateDiff(a.bhyt.denNgayDt)<1})},{default:(0,n.w5)((()=>[(0,n.Wm)(d,null,{default:(0,n.w5)((()=>[(0,n.Wm)(y,null,{default:(0,n.w5)((()=>[(0,n.Wm)(u,{class:(0,o.C_)(1==a.bhyt.gioiTinh?"text-pink":"text-primary"),name:1==a.bhyt.gioiTinh?"female":"male"},null,8,["class","name"]),(0,n.Uk)((0,o.zw)(a.bhyt.hoTen||a.bhyt.hoVaTen)+" "+(0,o.zw)(a.bhyt.ngaySinhDt||a.bhyt.ngayThangNamSinh)+" ",1),(0,n.Wm)(u,{onClick:e[0]||(e[0]=t=>m.xacNhanLoaiBo(a.bhyt)),name:1==a.bhyt.disabled?"do_not_disturb_on":"delete_forever",color:1==a.bhyt.disabled?"red":"gray"},null,8,["name","color"])])),_:1}),(0,n.Wm)(y,{caption:"",lines:"2"},{default:(0,n.w5)((()=>[h,(0,n._)("a",{target:"_blank",href:`https://www.buudienxatulap.ga/wordpress/wp-pwa/#/ho-gia-dinh/${a.bhyt.maHoGd}`},(0,o.zw)(a.bhyt.maHoGd),9,i)])),_:1}),(0,n.Wm)(y,{caption:"",lines:"2"},{default:(0,n.w5)((()=>[(0,n._)("a",{target:"_blank",href:`https://www.buudienxatulap.ga/wordpress/wp-pwa/#/tra-cuu?q=${a.bhyt.soTheBhyt?a.bhyt.soTheBhyt:a.bhyt.maSoBhxh||a.bhyt.maSoBHXH}`},(0,o.zw)(a.bhyt.soTheBhyt?a.bhyt.soTheBhyt:a.bhyt.maSoBhxh||a.bhyt.maSoBHXH),9,s),(0,n.Wm)(u,{class:"q-ml-md",onClick:e[1]||(e[1]=t=>m.copyTextToClipboard(a.bhyt.soTheBhyt?a.bhyt.soTheBhyt:a.bhyt.maSoBhxh||a.bhyt.maSoBHXH)),name:"content_copy"}),(0,n.Wm)(u,{class:"q-ml-md",onClick:e[2]||(e[2]=t=>m.copyUrlToClipboard(a.bhyt.soTheBhyt?a.bhyt.soTheBhyt:a.bhyt.maSoBhxh||a.bhyt.maSoBHXH)),name:"share"})])),_:1}),(0,n.Wm)(y,{caption:"",lines:"2"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(a.bhyt.maKCB),1)])),_:1}),(0,n.Wm)(y,{caption:"",lines:"2"},{default:(0,n.w5)((()=>[(0,n.Uk)("5 năm:"+(0,o.zw)(a.bhyt.ngay5Nam||a.bhyt.trangThaiHoSoName),1)])),_:1}),(0,n.Wm)(y,{caption:"",lines:"2"},{default:(0,n.w5)((()=>[(0,n._)("a",{href:`tel:${a.bhyt.soDienThoai}`},(0,o.zw)(a.bhyt.soDienThoai),9,l)])),_:1})])),_:1}),(0,n.Wm)(d,{side:"",top:""},{default:(0,n.w5)((()=>[(0,n.Wm)(y,{caption:""},{default:(0,n.w5)((()=>[(0,n.Uk)((0,o.zw)(m.getDateDiff(a.bhyt.denNgayDt))+" ngày",1)])),_:1}),(0,n.Wm)(y,{caption:""},{default:(0,n.w5)((()=>[(0,n.Uk)("Đến:"+(0,o.zw)(a.bhyt.denNgayDt||a.bhyt.ngayDenHan),1)])),_:1}),(0,n.Wm)(u,{onClick:e[3]||(e[3]=t=>m.xacNhanTheoDoi(a.bhyt)),name:"star",color:1==a.bhyt.completed?"yellow":"gray"},null,8,["color"]),(0,n.Wm)(y,{caption:""},{default:(0,n.w5)((()=>[(0,n.Uk)("Cập nhật:"+(0,o.zw)(a.bhyt.updated_at?new Date(a.bhyt.updated_at).toLocaleDateString():a.bhyt.ngayLapString),1)])),_:1})])),_:1})])),_:1},8,["class"])}var r=a(3100),m=a(4376),u=a(4328);const y={props:["bhyt"],methods:{...(0,r.nv)("bhyts",["loaiBo","theoDoi"]),xacNhanLoaiBo(t){t.maSoBhxh||(t.maSoBhxh=t.maSoBHXH),this.$q.dialog({title:"Confirm",message:"Bạn có muốn loại bỏ?",ok:{push:!0},cancel:{color:"negative"},persistent:!0}).onOk((()=>{this.loaiBo(t)}))},xacNhanTheoDoi(t){t.maSoBhxh||(t.maSoBhxh=t.maSoBHXH),this.$q.dialog({title:"Confirm",message:"Bạn có muốn theo dõi?",ok:{push:!0},cancel:{color:"negative"},persistent:!0}).onOk((()=>{this.theoDoi(t)}))},getDateDiff(t){return m.ZP.getDateDiff(new Date(t),new Date,"days")},copyUrlToClipboard(t){navigator.clipboard.writeText(`https://www.buudienxatulap.ga/tra-thoi-han-bao-hiem-y-te/?q=${t}`).then((function(){u.Z.create({type:"positive",message:"Bạn đã sao chép thành công!"})}),(function(t){u.Z.create({type:"negative",message:"Không thực hiện được!"+t})}))},copyTextToClipboard(t){navigator.clipboard.writeText(t).then((function(){u.Z.create({type:"positive",message:"Bạn đã sao chép thành công!"})}),(function(t){u.Z.create({type:"negative",message:"Không thực hiện được!"+t})}))}}};var d=a(1639),p=a(490),b=a(1233),g=a(3115),w=a(2857),B=a(9984),T=a.n(B);const f=(0,d.Z)(y,[["render",c]]),x=f;T()(y,"components",{QItem:p.Z,QItemSection:b.Z,QItemLabel:g.Z,QIcon:w.Z})},9454:(t,e,a)=>{a.r(e),a.d(e,{default:()=>x});var n=a(9835),o=a(1957);const h={class:"q-pa-md"},i=(0,n.Uk)("Danh sách thẻ BHYT"),s={class:"q-gutter-y-md column"};function l(t,e,a,l,c,r){const m=(0,n.up)("q-btn"),u=(0,n.up)("ListHeader"),y=(0,n.up)("q-icon"),d=(0,n.up)("q-input"),p=(0,n.up)("ThongTinTheBHYT"),b=(0,n.up)("q-separator"),g=(0,n.up)("q-list");return(0,n.wg)(),(0,n.iD)("div",h,[(0,n.Wm)(u,{bgcolor:"bg-orange-4"},{default:(0,n.w5)((()=>[i,(0,n.Wm)(m,{rounded:"",color:"primary",label:"Tải",onClick:e[0]||(e[0]=e=>t.dongBo()),icon:"sync"})])),_:1}),(0,n._)("div",s,[(0,n.Wm)(d,{outlined:"",modelValue:t.searchText,"onUpdate:modelValue":e[2]||(e[2]=e=>t.searchText=e),placeholder:"Từ khóa",hint:"Tìm kiếm theo thông tin thẻ BHYT",onKeyup:(0,o.D2)(t.timKiem,["enter"]),dense:""},{append:(0,n.w5)((()=>[""!==t.searchText?((0,n.wg)(),(0,n.j4)(y,{key:0,name:"close",onClick:e[1]||(e[1]=e=>t.searchText=""),class:"cursor-pointer"})):(0,n.kq)("",!0),(0,n.Wm)(y,{name:"search"})])),_:1},8,["modelValue","onKeyup"])]),((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(t.timBhyts(),(t=>((0,n.wg)(),(0,n.j4)(g,{key:t.id},{default:(0,n.w5)((()=>[(0,n.Wm)(p,{bhyt:t},null,8,["bhyt"]),(0,n.Wm)(b,{spaced:"",inset:""})])),_:2},1024)))),128))])}var c=a(3100),r=a(3162),m=a(4026);const u=(0,n.aZ)({components:{ThongTinTheBHYT:r.Z,ListHeader:m.Z},name:"IndexPage",data(){return{searchText:""}},methods:{...(0,c.nv)("bhyts",["getAllBhyts","dongBoDuLieu"]),async timKiem(){await this.getAllBhyts({name:this.searchText})},async dongBo(){this.dongBoDuLieu(this.timBhyts().map((t=>t.maSoBhxh)).join())}},computed:{...(0,c.Se)("bhyts",["timBhyts"])},mounted(){}});var y=a(1639),d=a(4455),p=a(361),b=a(2857),g=a(3246),w=a(926),B=a(9984),T=a.n(B);const f=(0,y.Z)(u,[["render",l]]),x=f;T()(u,"components",{QBtn:d.Z,QInput:p.Z,QIcon:b.Z,QList:g.Z,QSeparator:w.Z})}}]);