"use strict";(self["webpackChunktodo_buudienxatulap"]=self["webpackChunktodo_buudienxatulap"]||[]).push([[365],{4026:(t,e,a)=>{a.d(e,{Z:()=>y});var o=a(9835),n=a(6970);const h={class:"text-bold text-subtitle1"};function i(t,e,a,i,s,l){const r=(0,o.up)("q-banner");return(0,o.wg)(),(0,o.j4)(r,{dense:"","inline-actions":"",class:(0,n.C_)([a.bgcolor,"list-header text-white text-center"])},{default:(0,o.w5)((()=>[(0,o._)("span",h,[(0,o.WI)(t.$slots,"default")])])),_:3},8,["class"])}const s={props:["bgcolor"]};var l=a(1639),r=a(7128),c=a(9984),d=a.n(c);const m=(0,l.Z)(s,[["render",i]]),y=m;d()(s,"components",{QBanner:r.Z})},3162:(t,e,a)=>{a.d(e,{Z:()=>x});var o=a(9835),n=a(6970);const h=(0,o.Uk)(" Mã hộ:"),i=["href"],s=["href"],l=["href"];function r(t,e,a,r,c,d){const m=(0,o.up)("q-icon"),y=(0,o.up)("q-item-label"),b=(0,o.up)("q-item-section"),p=(0,o.up)("q-item");return(0,o.wg)(),(0,o.j4)(p,{class:(0,n.C_)({"bg-warning":a.bhyt.coTheUuTienCaoHon,"bg-positive":d.getDateDiff(a.bhyt.denNgayDt)>30,"bg-blue-grey-3":d.getDateDiff(a.bhyt.denNgayDt)<1})},{default:(0,o.w5)((()=>[(0,o.Wm)(b,null,{default:(0,o.w5)((()=>[(0,o.Wm)(y,null,{default:(0,o.w5)((()=>[(0,o.Wm)(m,{class:(0,n.C_)(1==a.bhyt.gioiTinh?"text-pink":"text-primary"),name:1==a.bhyt.gioiTinh?"female":"male"},null,8,["class","name"]),(0,o.Uk)((0,n.zw)(a.bhyt.hoTen||a.bhyt.hoVaTen)+" "+(0,n.zw)(a.bhyt.ngaySinhDt||a.bhyt.ngayThangNamSinh)+" ",1),(0,o.Wm)(m,{onClick:e[0]||(e[0]=t=>d.xacNhanLoaiBo(a.bhyt)),name:1==a.bhyt.disabled?"do_not_disturb_on":"delete_forever",color:1==a.bhyt.disabled?"red":"gray"},null,8,["name","color"])])),_:1}),(0,o.Wm)(y,{caption:"",lines:"2"},{default:(0,o.w5)((()=>[h,(0,o._)("a",{target:"_blank",href:`https://www.buudienxatulap.ga/wordpress/wp-pwa/#/ho-gia-dinh/${a.bhyt.maHoGd}`},(0,n.zw)(a.bhyt.maHoGd),9,i)])),_:1}),(0,o.Wm)(y,{caption:"",lines:"2"},{default:(0,o.w5)((()=>[(0,o._)("a",{target:"_blank",href:`https://www.buudienxatulap.ga/wordpress/wp-pwa/#/tra-cuu?q=${a.bhyt.soTheBhyt?a.bhyt.soTheBhyt:a.bhyt.maSoBhxh||a.bhyt.maSoBHXH}`},(0,n.zw)(a.bhyt.soTheBhyt?a.bhyt.soTheBhyt:a.bhyt.maSoBhxh||a.bhyt.maSoBHXH),9,s),(0,o.Wm)(m,{class:"q-ml-md",onClick:e[1]||(e[1]=t=>d.copyTextToClipboard(a.bhyt.soTheBhyt?a.bhyt.soTheBhyt:a.bhyt.maSoBhxh||a.bhyt.maSoBHXH)),name:"content_copy"}),(0,o.Wm)(m,{class:"q-ml-md",onClick:e[2]||(e[2]=t=>d.copyUrlToClipboard(a.bhyt.soTheBhyt?a.bhyt.soTheBhyt:a.bhyt.maSoBhxh||a.bhyt.maSoBHXH)),name:"share"})])),_:1}),(0,o.Wm)(y,{caption:"",lines:"2"},{default:(0,o.w5)((()=>[(0,o.Uk)((0,n.zw)(a.bhyt.maKCB),1)])),_:1}),(0,o.Wm)(y,{caption:"",lines:"2"},{default:(0,o.w5)((()=>[(0,o.Uk)("5 năm:"+(0,n.zw)(a.bhyt.ngay5Nam||a.bhyt.trangThaiHoSoName),1)])),_:1}),(0,o.Wm)(y,{caption:"",lines:"2"},{default:(0,o.w5)((()=>[(0,o._)("a",{href:`tel:${a.bhyt.soDienThoai}`},(0,n.zw)(a.bhyt.soDienThoai),9,l)])),_:1})])),_:1}),(0,o.Wm)(b,{side:"",top:""},{default:(0,o.w5)((()=>[(0,o.Wm)(y,{caption:""},{default:(0,o.w5)((()=>[(0,o.Uk)((0,n.zw)(d.getDateDiff(a.bhyt.denNgayDt))+" ngày",1)])),_:1}),(0,o.Wm)(y,{caption:""},{default:(0,o.w5)((()=>[(0,o.Uk)("Đến:"+(0,n.zw)(a.bhyt.denNgayDt||a.bhyt.ngayDenHan),1)])),_:1}),(0,o.Wm)(m,{onClick:e[3]||(e[3]=t=>d.xacNhanTheoDoi(a.bhyt)),name:"star",color:1==a.bhyt.completed?"yellow":"gray"},null,8,["color"]),(0,o.Wm)(y,{caption:""},{default:(0,o.w5)((()=>[(0,o.Uk)("Cập nhật:"+(0,n.zw)(a.bhyt.updated_at?new Date(a.bhyt.updated_at).toLocaleDateString():a.bhyt.ngayLapString),1)])),_:1})])),_:1})])),_:1},8,["class"])}var c=a(3100),d=a(4376),m=a(4328);const y={props:["bhyt"],methods:{...(0,c.nv)("bhyts",["loaiBo","theoDoi"]),xacNhanLoaiBo(t){t.maSoBhxh||(t.maSoBhxh=t.maSoBHXH),this.$q.dialog({title:"Confirm",message:"Bạn có muốn loại bỏ?",ok:{push:!0},cancel:{color:"negative"},persistent:!0}).onOk((()=>{this.loaiBo(t)}))},xacNhanTheoDoi(t){t.maSoBhxh||(t.maSoBhxh=t.maSoBHXH),this.$q.dialog({title:"Confirm",message:"Bạn có muốn theo dõi?",ok:{push:!0},cancel:{color:"negative"},persistent:!0}).onOk((()=>{this.theoDoi(t)}))},getDateDiff(t){return d.ZP.getDateDiff(new Date(t),new Date,"days")},copyUrlToClipboard(t){navigator.clipboard.writeText(`https://www.buudienxatulap.ga/tra-thoi-han-bao-hiem-y-te/?q=${t}`).then((function(){m.Z.create({type:"positive",message:"Bạn đã sao chép thành công!"})}),(function(t){m.Z.create({type:"negative",message:"Không thực hiện được!"+t})}))},copyTextToClipboard(t){navigator.clipboard.writeText(t).then((function(){m.Z.create({type:"positive",message:"Bạn đã sao chép thành công!"})}),(function(t){m.Z.create({type:"negative",message:"Không thực hiện được!"+t})}))}}};var b=a(1639),p=a(490),u=a(1233),g=a(3115),w=a(2857),f=a(9984),B=a.n(f);const T=(0,b.Z)(y,[["render",r]]),x=T;B()(y,"components",{QItem:p.Z,QItemSection:u.Z,QItemLabel:g.Z,QIcon:w.Z})},1365:(t,e,a)=>{a.r(e),a.d(e,{default:()=>T});var o=a(9835),n=a(6970);const h={class:"q-pa-md"},i=["href"];function s(t,e,a,s,l,r){const c=(0,o.up)("q-btn"),d=(0,o.up)("ListHeader"),m=(0,o.up)("ThongTinTheBHYT"),y=(0,o.up)("q-separator"),b=(0,o.up)("q-list");return(0,o.wg)(),(0,o.iD)("div",h,[(0,o.Wm)(d,{bgcolor:"bg-orange-4"},{default:(0,o.w5)((()=>[(0,o.Uk)("Danh sách thẻ BHYT theo hộ gia đình - "+(0,n.zw)(t.bhyts.length)+" thẻ : ",1),(0,o._)("a",{href:`https://hgd.baohiemxahoi.gov.vn/doViewInfoHo.do?maHo=${t.maHoGd}`,target:"_blank"},(0,n.zw)(t.maHoGd),9,i),(0,o.Wm)(c,{rounded:"",color:"primary",label:"Tải",onClick:e[0]||(e[0]=e=>t.dongBo()),icon:"sync"}),(0,o.Wm)(c,{color:"deep-orange",rounded:"",label:"Xóa",onClick:e[1]||(e[1]=e=>t.xacNhanXoa(t.maHoGd)),icon:"delete_forever"})])),_:1}),((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(t.bhyts,(t=>((0,o.wg)(),(0,o.j4)(b,{key:t.id},{default:(0,o.w5)((()=>[(0,o.Wm)(m,{bhyt:t},null,8,["bhyt"]),(0,o.Wm)(y,{spaced:"",inset:""})])),_:2},1024)))),128))])}var l=a(3100),r=a(6950),c=a(8359),d=a(3162),m=a(4026);const y=(0,o.aZ)({components:{ThongTinTheBHYT:d.Z,ListHeader:m.Z},name:"IndexPage",data(){return{maHoGd:""}},methods:{...(0,l.nv)("bhyts",["getAllBhyts","xoaHoGd","dongBoDuLieu"]),async loadData(){await this.getAllBhyts({maHoGd:this.maHoGd})},async dongBo(){r.Z.show({spinner:c.Z,spinnerSize:"100px"}),await this.dongBoDuLieu(this.bhyts.map((t=>t.maSoBhxh)).join()),r.Z.hide()},async xacNhanXoa(t){this.$q.dialog({title:"Confirm",message:"Bạn có muốn xóa hộ gia đình?",ok:{push:!0},cancel:{color:"negative"},persistent:!0}).onOk((async()=>{await this.xoaHoGd(t),this.$router.go()}))}},computed:{...(0,l.Se)("bhyts",["bhyts"])},mounted(){this.maHoGd=this.$route.params.id,this.loadData()}});var b=a(1639),p=a(4455),u=a(3246),g=a(926),w=a(9984),f=a.n(w);const B=(0,b.Z)(y,[["render",s]]),T=B;f()(y,"components",{QBtn:p.Z,QList:u.Z,QSeparator:g.Z})}}]);