"use strict";(self["webpackChunktodo_buudienxatulap"]=self["webpackChunktodo_buudienxatulap"]||[]).push([[21],{8021:(t,e,n)=>{n.r(e),n.d(e,{default:()=>D});var l=n(9835);const i=(0,l.Uk)(" BHXH TỰ NGUYỆN VÀ BHYT "),o=(0,l.Uk)(" Các chức năng ");function a(t,e,n,a,u,c){const r=(0,l.up)("q-btn"),s=(0,l.up)("q-toolbar-title"),p=(0,l.up)("q-toolbar"),d=(0,l.up)("q-header"),m=(0,l.up)("q-item-label"),h=(0,l.up)("EssentialLink"),k=(0,l.up)("q-list"),g=(0,l.up)("q-drawer"),w=(0,l.up)("router-view"),f=(0,l.up)("q-page-container"),b=(0,l.up)("q-layout");return(0,l.wg)(),(0,l.j4)(b,{view:"lHh Lpr lFf"},{default:(0,l.w5)((()=>[(0,l.Wm)(d,{elevated:""},{default:(0,l.w5)((()=>[(0,l.Wm)(p,null,{default:(0,l.w5)((()=>[(0,l.Wm)(r,{flat:"",dense:"",round:"",icon:"menu","aria-label":"Menu",onClick:t.toggleLeftDrawer},null,8,["onClick"]),(0,l.Wm)(s,null,{default:(0,l.w5)((()=>[i])),_:1}),(0,l.Wm)(r,{round:"",color:"primary",icon:"logout",onClick:t.logoutUser,to:"/auth"},null,8,["onClick"])])),_:1})])),_:1}),(0,l.Wm)(g,{modelValue:t.leftDrawerOpen,"onUpdate:modelValue":e[0]||(e[0]=e=>t.leftDrawerOpen=e),"show-if-above":"",bordered:""},{default:(0,l.w5)((()=>[(0,l.Wm)(k,null,{default:(0,l.w5)((()=>[(0,l.Wm)(m,{header:""},{default:(0,l.w5)((()=>[o])),_:1}),((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(t.essentialLinks,(t=>((0,l.wg)(),(0,l.j4)(h,(0,l.dG)({key:t.title},t),null,16)))),128))])),_:1})])),_:1},8,["modelValue"]),(0,l.Wm)(f,null,{default:(0,l.w5)((()=>[(0,l.Wm)(w)])),_:1})])),_:1})}var u=n(499),c=n(3100),r=n(6970);function s(t,e,n,i,o,a){const u=(0,l.up)("q-icon"),c=(0,l.up)("q-item-section"),s=(0,l.up)("q-item-label"),p=(0,l.up)("q-item");return(0,l.wg)(),(0,l.j4)(p,{clickable:"",tag:"a",to:t.link},{default:(0,l.w5)((()=>[t.icon?((0,l.wg)(),(0,l.j4)(c,{key:0,avatar:""},{default:(0,l.w5)((()=>[(0,l.Wm)(u,{name:t.icon},null,8,["name"])])),_:1})):(0,l.kq)("",!0),(0,l.Wm)(c,null,{default:(0,l.w5)((()=>[(0,l.Wm)(s,null,{default:(0,l.w5)((()=>[(0,l.Uk)((0,r.zw)(t.title),1)])),_:1}),(0,l.Wm)(s,{caption:""},{default:(0,l.w5)((()=>[(0,l.Uk)((0,r.zw)(t.caption),1)])),_:1})])),_:1})])),_:1},8,["to"])}const p=(0,l.aZ)({name:"EssentialLink",props:{title:{type:String,required:!0},caption:{type:String,default:""},link:{type:String,default:"#"},icon:{type:String,default:""}}});var d=n(1639),m=n(490),h=n(1233),k=n(2857),g=n(3115),w=n(9984),f=n.n(w);const b=(0,d.Z)(p,[["render",s]]),H=b;f()(p,"components",{QItem:m.Z,QItemSection:h.Z,QIcon:k.Z,QItemLabel:g.Z});const _=[{title:"Tìm kiếm",caption:"Theo Tên, Mã thẻ, số đt",icon:"search",link:"/"},{title:"Tái tục",caption:"DS BHYT tái tục",icon:"home",link:"/tai-tuc"},{title:"Đã hết hạn",caption:"DS BHYT đã hết hạn",icon:"sync",link:"/het-han"},{title:"Tra cứu",caption:"Tìm theo mã BHXH",icon:"search",link:"/tra-cuu"},{title:"Tìm kiếm",caption:"Tìm theo họ tên",icon:"person_search",link:"/tim-kiem"},{title:"Hồ sơ chưa xử lý",caption:"Các hồ sơ chưa xử lý",icon:"star",link:"/ho-so-chua-xu-ly"},{title:"Hồ sơ đã xử lý",caption:"Các hồ sơ đã xử lý",icon:"star",link:"/ho-so-da-xu-ly"},{title:"Đang theo dõi",caption:"Mã số BHXH đang theo dõi",icon:"star",link:"/theo-doi"},{title:"Ngừng theo dõi",caption:"Mã số BHXH ngừng hoạt động",icon:"do_not_disturb_on",link:"/ngung-hoat-dong"},{title:"Chưa có dữ liệu",caption:"Mã số BHXH chưa cập nhật",icon:"sync",link:"/dong-bo"},{title:"Cài đặt",caption:"Thông tin người dùng",icon:"settings",link:"/settings"}],Z=(0,l.aZ)({name:"MainLayout",components:{EssentialLink:H},setup(){const t=(0,u.iH)(!1);return{essentialLinks:_,leftDrawerOpen:t,toggleLeftDrawer(){t.value=!t.value}}},methods:{...(0,c.nv)("auth",["logoutUser"])}});var T=n(7605),q=n(6602),y=n(1663),W=n(4455),L=n(1973),Q=n(6689),v=n(3246),C=n(2133);const B=(0,d.Z)(Z,[["render",a]]),D=B;f()(Z,"components",{QLayout:T.Z,QHeader:q.Z,QToolbar:y.Z,QBtn:W.Z,QToolbarTitle:L.Z,QDrawer:Q.Z,QList:v.Z,QItemLabel:g.Z,QPageContainer:C.Z})}}]);