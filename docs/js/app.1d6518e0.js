(()=>{"use strict";var e={4164:(e,t,a)=>{a(702),a(8964);var r=a(1957),s=a(1947),n=a(9835);function o(e,t,a,r,s,o){const i=(0,n.up)("router-view");return(0,n.wg)(),(0,n.j4)(i)}var i=a(3100);const l=(0,n.aZ)({name:"App",methods:{...(0,i.nv)("auth",["handleAuthStateChanged"])},computed:{...(0,i.Se)("auth",["isLogin"])},async mounted(){await this.handleAuthStateChanged()}});var c=a(1639);const d=(0,c.Z)(l,[["render",o]]),u=d;var h=a(3562),m=a(3340),p=a(8910);const g=[{path:"/",component:()=>Promise.all([a.e(736),a.e(213)]).then(a.bind(a,1213)),children:[{path:"",component:()=>Promise.all([a.e(736),a.e(449)]).then(a.bind(a,3449)),meta:{requireAuth:!0}},{path:"/dong-bo",component:()=>Promise.all([a.e(736),a.e(480)]).then(a.bind(a,6480)),meta:{requireAuth:!0}},{path:"/the-ht",component:()=>Promise.all([a.e(736),a.e(116)]).then(a.bind(a,4116)),meta:{requireAuth:!0}},{path:"/settings",component:()=>Promise.all([a.e(736),a.e(113)]).then(a.bind(a,9113)),meta:{requireAuth:!0}},{path:"/phat-sinh",component:()=>Promise.all([a.e(736),a.e(858)]).then(a.bind(a,8858)),meta:{requireAuth:!0}},{path:"/theo-doi",component:()=>Promise.all([a.e(736),a.e(934)]).then(a.bind(a,6934)),meta:{requireAuth:!0}},{path:"/ngung-hoat-dong",component:()=>Promise.all([a.e(736),a.e(133)]).then(a.bind(a,3133)),meta:{requireAuth:!0}},{path:"/tim-kiem",component:()=>Promise.all([a.e(736),a.e(409)]).then(a.bind(a,9409)),meta:{requireAuth:!0}},{path:"/ho-gia-dinh/:id",component:()=>Promise.all([a.e(736),a.e(692)]).then(a.bind(a,8692)),meta:{requireAuth:!0}},{path:"/auth",name:"auth",component:()=>Promise.all([a.e(736),a.e(901)]).then(a.bind(a,9901)),meta:{requireAuth:!1}},{path:"/tra-cuu/:id",component:()=>Promise.all([a.e(736),a.e(76)]).then(a.bind(a,76)),meta:{requireAuth:!1}},{path:"/tra-cuu",component:()=>Promise.all([a.e(736),a.e(76)]).then(a.bind(a,76)),meta:{requireAuth:!1}},{path:"/tra-cuu-tu-dong",component:()=>Promise.all([a.e(736),a.e(905)]).then(a.bind(a,7905)),meta:{requireAuth:!1}}]},{path:"/:catchAll(.*)*",component:()=>Promise.all([a.e(736),a.e(862)]).then(a.bind(a,1862))}],f=g,y=(0,m.BC)((function({store:e}){const t=p.r5,a=(0,p.p7)({scrollBehavior:()=>({left:0,top:0}),routes:f,history:t("")});return a.beforeEach(((e,t,a)=>{e.matched.some((e=>e.meta.requireAuth))&&""===localStorage.getItem("setIsLogin")?a({path:"/auth",query:{next:e.fullPath}}):a()})),a}));async function b(e,t){const r=e(u);r.use(s.Z,t);const n="function"===typeof h["default"]?await(0,h["default"])({}):h["default"],{storeKey:o}=await Promise.resolve().then(a.bind(a,3562)),i="function"===typeof y?await y({store:n}):y;return n.$router=i,{app:r,store:n,storeKey:o,router:i}}var v=a(4393),w=a(1565);const k={config:{},lang:v.Z,plugins:{Dialog:w.Z}};var S=a(368);(0,S.z)("service-worker.js",{ready(){},registered(){},cached(){},updatefound(){},updated(){},offline(){},error(){}}),/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream&&window.navigator.standalone&&a.e(736).then(a.t.bind(a,4848,23));const A="";async function B({app:e,router:t,store:a,storeKey:r},s){let n=!1;const o=e=>{try{return t.resolve(e).href}catch(a){}return Object(e)===e?null:e},i=e=>{if(n=!0,"string"===typeof e&&/^https?:\/\//.test(e))return void(window.location.href=e);const t=o(e);null!==t&&(window.location.href=t,window.location.reload())},l=window.location.href.replace(window.location.origin,"");for(let d=0;!1===n&&d<s.length;d++)try{await s[d]({app:e,router:t,store:a,ssrContext:null,redirect:i,urlPath:l,publicPath:A})}catch(c){return c&&c.url?void i(c.url):void console.error("[Quasar] boot error:",c)}!0!==n&&(e.use(t),e.use(a,r),e.mount("#q-app"))}b(r.ri,k).then((e=>Promise.all([Promise.resolve().then(a.bind(a,1569))]).then((t=>{const a=t.map((e=>e.default)).filter((e=>"function"===typeof e));B(e,a)}))))},1569:(e,t,a)=>{a.r(t),a.d(t,{api:()=>o,default:()=>i});var r=a(3340),s=a(9981),n=a.n(s);const o=n().create({baseURL:"https://cmsbudientulap.herokuapp.com"}),i=(0,r.xr)((({app:e})=>{e.config.globalProperties.$axios=n(),e.config.globalProperties.$api=o}))},3562:(e,t,a)=>{a.r(t),a.d(t,{default:()=>de});var r={};a.r(r),a.d(r,{bhyts:()=>h,timBhyts:()=>m});var s={};a.r(s),a.d(s,{getAllBhyts:()=>p,updateBhyt:()=>g});var n={};a.r(n),a.d(n,{dongBoDuLieu:()=>P,findBhyts:()=>Z,getAllBhyts:()=>D,getBhytSsm:()=>x,lamMoiDanhSach:()=>C,loaiBo:()=>O,luuBhyt:()=>T,theoDoi:()=>N,updateBhyt:()=>j,xem:()=>L,xoaHoGd:()=>B});var o={};a.r(o),a.d(o,{findUser:()=>_,isLogin:()=>$,users:()=>U});var i={};a.r(i),a.d(i,{addMessage:()=>M,addUser:()=>E,clearMessages:()=>z,setIsLogin:()=>R,setUserDetails:()=>q,updateUser:()=>G});var l={};a.r(l),a.d(l,{firebaseGetMessages:()=>oe,firebaseGetUsers:()=>ne,firebaseSendMessage:()=>le,firebaseStopGettingMessages:()=>ie,firebaseUpdateUser:()=>se,handleAuthStateChanged:()=>re,loginUser:()=>te,logoutUser:()=>ae,registerUser:()=>ee});var c=a(3340),d=a(3100);function u(){return{bhyts:[]}}a(702);function h(e){return e.bhyts}const m=e=>t=>(console.log(t),t?[...e.bhyts.filter((e=>(e.hoTen+e.maSoBhxh+e.maHoGd+e.soDienThoai+e.maKCB+"-"+e.denNgayDt).toLowerCase().includes(t.toLowerCase())))]:e.bhyts),p=(e,t)=>{e.bhyts=t},g=(e,t)=>{let a=e.bhyts.find((e=>e.id===t.id));a.completed=t.completed,a.disabled=t.disabled};var f=a(1569),y=a(4328),b=a(6950),v=a(8359);const w={import:async(e,t)=>{let a={};if(navigator.onLine)try{a=await f.api.post(e,t),a?y.Z.create({type:"positive",message:"Bạn đã lưu thành công!"}):y.Z.create({type:"negative",message:"Lưu dữ liệu thất bại!"})}catch(r){r.toString().includes("Network",0)&&y.Z.create({message:"Không thể kế nối đến máy chủ !",color:"red"})}else y.Z.create({message:"Không có kết nối Internet !",color:"red"});return a},post:async(e,t)=>{let a={};if(navigator.onLine){let s={...t};delete s.createdAt,delete s.updatedAt,Object.keys(s).forEach((e=>(null===s[e]||void 0===s[e])&&delete s[e]));try{a=await f.api.post(e,s),a?y.Z.create({type:"positive",message:"Bạn đã lưu thành công!"}):y.Z.create({type:"negative",message:"Lưu dữ liệu thất bại!"})}catch(r){r.toString().includes("Network",0)&&y.Z.create({message:"Không thể kế nối đến máy chủ !",color:"red"})}}else y.Z.create({message:"Không có kết nối Internet !",color:"red"});return a},delete:async e=>{let t={};if(navigator.onLine)try{t=await f.api["delete"](e),t?y.Z.create({type:"positive",message:"Bạn đã lưu thành công!"}):y.Z.create({type:"negative",message:"Lưu dữ liệu thất bại!"})}catch(a){a.toString().includes("Network",0)&&y.Z.create({message:"Không thể kế nối đến máy chủ !",color:"red"})}else y.Z.create({message:"Không có kết nối Internet !",color:"red"});return t},put:async(e,t)=>{let a={};if(navigator.onLine){let s={...t};delete s.createdAt,delete s.updatedAt,Object.keys(s).forEach((e=>(null===s[e]||void 0===s[e])&&delete s[e]));try{a=await f.api.put(e,s),a?y.Z.create({type:"positive",message:"Bạn đã lưu thành công!"}):y.Z.create({type:"negative",message:"Lưu dữ liệu thất bại!"})}catch(r){r.toString().includes("Network",0)&&y.Z.create({message:"Không thể kế nối đến máy chủ !",color:"red"})}}else y.Z.create({message:"Không có kết nối Internet !",color:"red"});return a},get:async e=>{let t={};if(navigator.onLine){b.Z.show({spinner:v.Z,spinnerSize:"100px"});try{t=await f.api.get(e)}catch(a){a.toString().includes("Network",0)&&y.Z.create({message:"Không thể kế nối đến máy chủ !",color:"red"})}}else y.Z.create({message:"Không có kết nối Internet !",color:"red"});return b.Z.hide(),t},getSsm:async(e,t)=>{let a={};if(navigator.onLine){b.Z.show({spinner:v.Z,spinnerSize:"100px"});try{a=await f.api.get(e,{headers:{Authorization:`Bearer ${t}`}})}catch(r){r.toString().includes("Network",0)&&y.Z.create({message:"Không thể kế nối đến máy chủ !",color:"red"})}}else y.Z.create({message:"Không có kết nối Internet !",color:"red"});return b.Z.hide(),a}};var k=a(9981),S=a.n(k);let A=[];const B=async({commit:e},t)=>{await w.get(`/api/xoaHoGd?maHoGd=${t}`)},I=async e=>{if(0===e.length||""===localStorage.getItem("setIsLogin"))return[];A=[];const t=e.split(",");for(let r=0;r<t.length;r++){const e=t[r];try{await L(e)}catch(a){console.log(a)}}return A},T=async e=>{let{data:t}=await S().put(`https://cmsbudientulap.herokuapp.com/api/bhyts/${e.maSoBhxh}`,e);return t},L=async e=>{let{data:t}=await S().get(`https://ssm-api.vnpost.vn/api/services/app/TraCuu/TraCuuThongTinBHYT?maSoBhxh=${e.slice(e.length-10)}`,{headers:{Authorization:`Bearer ${localStorage.getItem("setIsLogin")}`}}),a=await T({...t.result.thongTinTheHGD,maHoGd:t.result.thongTinTK1.maHoGd});A.push(a)},P=async({commit:e},t)=>{const a=await I(t);e("getAllBhyts",[...a])},D=async({commit:e},t)=>{const{completed:a,disabled:r,name:s,thang:n,maHoGd:o,chuaDongBo:i}=t;let l="/api/bhyts?";n&&(l+=`thang=${n}`),s&&(l+=`&name=${s}`),a&&(l+=`&completed=${a}`),r&&(l+=`&disabled=${r}`),o&&(l+=`&maHoGd=${o}`),i&&(l+=`&chuaDongBo=${i}`);const{data:c}=await w.get(l);c&&e("getAllBhyts",c)},Z=async({searchText:e,isLogin:t})=>{console.log(t);const{data:a}=await w.getSsm(`https://ssm-api.vnpost.vn/api/services/app/TraCuu/TraCuuMaSoBHXH?maTinh=01&maHuyen=250&maXa=08986&hoTen=${e}&isCoDau=true&`,t);return a?a.result.value.map((e=>e.maSoBhxh)):[]},x=async({maSoBhxh:e,isLogin:t})=>{const{data:a}=await w.getSsm(`https://ssm-api.vnpost.vn/api/services/app/TraCuu/TraCuuThongTinBHYT?maSoBhxh=${e}`,t);return a?{...a.result.thongTinTheHGD,maHoGd:a.thongTinTK1.maHoGd}:{}},j=async e=>{const{data:t}=await w.put(`/api/bhyts/${e.maSoBhxh}`,e);return t},C=()=>commit("getAllBhyts",[]),O=async({commit:e},{maSoBhxh:t,disabled:a})=>{const{data:r}=await w.put(`/api/bhyts/${t}/disabled`,{disabled:!a});e("updateBhyt",r)},N=async({commit:e},{maSoBhxh:t,completed:a})=>{const{data:r}=await w.put(`/api/bhyts/${t}/completed`,{completed:!a});e("updateBhyt",r)},H={namespaced:!0,getters:r,mutations:s,actions:n,state:u};function K(){return{userDetails:{},isLogin:"",users:{},messages:{}}}const U=e=>{let t={};return Object.keys(e.users).forEach((a=>{a!==e.userDetails.userId&&(t[a]=e.users[a])})),t},_=e=>t=>e.users[t],$=e=>e.isLogin,q=(e,t)=>{e.userDetails=t},E=(e,t)=>{Vue.set(e.users,t.userId,t.userDetails)},G=(e,t)=>{Object.assign(e.users[t.userId],t.userDetails)},M=(e,t)=>{Vue.set(e.messages,t.messageId,t.messageDetails)},z=e=>{e.messages={}},R=(e,t)=>{e.isLogin=t,localStorage.setItem("setIsLogin",t)};var F=a(222),V=a(8502),X=a(8248),Y={apiKey:"AIzaSyDraj3RaCTiGTK_Alsbslb-kbelw9Iyhgw",authDomain:"gvc-task.firebaseapp.com",projectId:"gvc-task",storageBucket:"gvc-task.appspot.com",messagingSenderId:"194642192267",appId:"1:194642192267:web:66bedc6e262d9fce83318e"};let Q=(0,F.ZF)(Y),J=(0,V.v0)(Q),W=(0,X.N8)(Q);const ee=async({},e)=>{},te=async({},{email:e,password:t})=>{await(0,V.e5)(J,e,t)},ae=()=>{const e=(0,V.v0)();(0,V.w7)(e).then((()=>{commit("setUserDetails",{}),commit("setIsLogin","")})).catch((e=>{}))},re=async({commit:e,dispatch:t,state:a})=>{const r=(0,V.v0)();await(0,V.Aj)(r,(t=>{if(t){const a=(0,X.N8)(),r=(0,V.v0)(),s=r.currentUser.uid;(0,X.jM)((0,X.iH)(a,"/users/"+s),(a=>{if(a.exists()){let r=a.val();e("setUserDetails",{name:r.name,email:t.email,smsText:r.smsText,isLogin:r.isLogin,userId:s}),e("setIsLogin",r.isLogin)}else{console.log("No data available"),e("setUserDetails",{name:t.displayName,email:t.email,userId:t.uid});const a=(0,X.N8)();(0,X.t8)((0,X.iH)(a,"users/"+s),{name:t.displayName,email:t.email,userId:t.uid}),e("setIsLogin","")}}),{onlyOnce:!0})}else e("setUserDetails",{}),e("setIsLogin","")}))},se=({},{userId:e,updates:t})=>{if(e){const a=(0,X.N8)();(0,X.t8)((0,X.iH)(a,"users/"+e),t)}},ne=({commit:e})=>{W.ref("users").on("child_added",(t=>{let a=t.val(),r=t.key;e("addUser",{userId:r,userDetails:a})})),W.ref("users").on("child_changed",(t=>{let a=t.val(),r=t.key;e("updateUser",{userId:r,userDetails:a})}))},oe=({commit:e,state:t},a)=>{let r=t.userDetails.userId;messagesRef=W.ref("chats/"+r+"/"+a),messagesRef.on("child_added",(t=>{let a=t.val(),r=t.key;e("addMessage",{messageId:r,messageDetails:a})}))},ie=({commit:e})=>{messagesRef&&(messagesRef.off("child_added"),e("clearMessages"))},le=({},e)=>{W.ref("chats/"+state.userDetails.userId+"/"+e.otherUserId).push(e.message),e.message.from="them",W.ref("chats/"+e.otherUserId+"/"+state.userDetails.userId).push(e.message)},ce={namespaced:!0,getters:o,mutations:i,actions:l,state:K},de=(0,c.h)((function(){const e=(0,d.MT)({modules:{bhyts:H,auth:ce},strict:!1});return e}))}},t={};function a(r){var s=t[r];if(void 0!==s)return s.exports;var n=t[r]={exports:{}};return e[r](n,n.exports,a),n.exports}a.m=e,(()=>{var e=[];a.O=(t,r,s,n)=>{if(!r){var o=1/0;for(d=0;d<e.length;d++){for(var[r,s,n]=e[d],i=!0,l=0;l<r.length;l++)(!1&n||o>=n)&&Object.keys(a.O).every((e=>a.O[e](r[l])))?r.splice(l--,1):(i=!1,n<o&&(o=n));if(i){e.splice(d--,1);var c=s();void 0!==c&&(t=c)}}return t}n=n||0;for(var d=e.length;d>0&&e[d-1][2]>n;d--)e[d]=e[d-1];e[d]=[r,s,n]}})(),(()=>{a.n=e=>{var t=e&&e.__esModule?()=>e["default"]:()=>e;return a.d(t,{a:t}),t}})(),(()=>{var e,t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__;a.t=function(r,s){if(1&s&&(r=this(r)),8&s)return r;if("object"===typeof r&&r){if(4&s&&r.__esModule)return r;if(16&s&&"function"===typeof r.then)return r}var n=Object.create(null);a.r(n);var o={};e=e||[null,t({}),t([]),t(t)];for(var i=2&s&&r;"object"==typeof i&&!~e.indexOf(i);i=t(i))Object.getOwnPropertyNames(i).forEach((e=>o[e]=()=>r[e]));return o["default"]=()=>r,a.d(n,o),n}})(),(()=>{a.d=(e,t)=>{for(var r in t)a.o(t,r)&&!a.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}})(),(()=>{a.f={},a.e=e=>Promise.all(Object.keys(a.f).reduce(((t,r)=>(a.f[r](e,t),t)),[]))})(),(()=>{a.u=e=>"js/"+e+"."+{76:"f5ebd468",113:"d06c681a",116:"66aeb0ee",133:"2adb7049",213:"5f19e581",409:"92bdb09c",449:"e67b86ed",480:"b9292d24",692:"164cbc42",858:"534abf4b",862:"35fd88f4",901:"26a39253",905:"e2bb1c2c",934:"b227eb90"}[e]+".js"})(),(()=>{a.miniCssF=e=>"css/"+({143:"app",736:"vendor"}[e]||e)+"."+{76:"5ae00156",116:"5ae00156",133:"5ae00156",143:"31d6cfe0",409:"5ae00156",449:"5ae00156",480:"5ae00156",692:"5ae00156",736:"76a71318",858:"5ae00156",905:"5ae00156",934:"5ae00156"}[e]+".css"})(),(()=>{a.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()})(),(()=>{a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t)})(),(()=>{var e={},t="todo-buudienxatulap:";a.l=(r,s,n,o)=>{if(e[r])e[r].push(s);else{var i,l;if(void 0!==n)for(var c=document.getElementsByTagName("script"),d=0;d<c.length;d++){var u=c[d];if(u.getAttribute("src")==r||u.getAttribute("data-webpack")==t+n){i=u;break}}i||(l=!0,i=document.createElement("script"),i.charset="utf-8",i.timeout=120,a.nc&&i.setAttribute("nonce",a.nc),i.setAttribute("data-webpack",t+n),i.src=r),e[r]=[s];var h=(t,a)=>{i.onerror=i.onload=null,clearTimeout(m);var s=e[r];if(delete e[r],i.parentNode&&i.parentNode.removeChild(i),s&&s.forEach((e=>e(a))),t)return t(a)},m=setTimeout(h.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=h.bind(null,i.onerror),i.onload=h.bind(null,i.onload),l&&document.head.appendChild(i)}}})(),(()=>{a.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}})(),(()=>{a.p=""})(),(()=>{var e=(e,t,a,r)=>{var s=document.createElement("link");s.rel="stylesheet",s.type="text/css";var n=n=>{if(s.onerror=s.onload=null,"load"===n.type)a();else{var o=n&&("load"===n.type?"missing":n.type),i=n&&n.target&&n.target.href||t,l=new Error("Loading CSS chunk "+e+" failed.\n("+i+")");l.code="CSS_CHUNK_LOAD_FAILED",l.type=o,l.request=i,s.parentNode.removeChild(s),r(l)}};return s.onerror=s.onload=n,s.href=t,document.head.appendChild(s),s},t=(e,t)=>{for(var a=document.getElementsByTagName("link"),r=0;r<a.length;r++){var s=a[r],n=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(n===e||n===t))return s}var o=document.getElementsByTagName("style");for(r=0;r<o.length;r++){s=o[r],n=s.getAttribute("data-href");if(n===e||n===t)return s}},r=r=>new Promise(((s,n)=>{var o=a.miniCssF(r),i=a.p+o;if(t(o,i))return s();e(r,i,s,n)})),s={143:0};a.f.miniCss=(e,t)=>{var a={76:1,116:1,133:1,409:1,449:1,480:1,692:1,858:1,905:1,934:1};s[e]?t.push(s[e]):0!==s[e]&&a[e]&&t.push(s[e]=r(e).then((()=>{s[e]=0}),(t=>{throw delete s[e],t})))}})(),(()=>{var e={143:0};a.f.j=(t,r)=>{var s=a.o(e,t)?e[t]:void 0;if(0!==s)if(s)r.push(s[2]);else{var n=new Promise(((a,r)=>s=e[t]=[a,r]));r.push(s[2]=n);var o=a.p+a.u(t),i=new Error,l=r=>{if(a.o(e,t)&&(s=e[t],0!==s&&(e[t]=void 0),s)){var n=r&&("load"===r.type?"missing":r.type),o=r&&r.target&&r.target.src;i.message="Loading chunk "+t+" failed.\n("+n+": "+o+")",i.name="ChunkLoadError",i.type=n,i.request=o,s[1](i)}};a.l(o,l,"chunk-"+t,t)}},a.O.j=t=>0===e[t];var t=(t,r)=>{var s,n,[o,i,l]=r,c=0;if(o.some((t=>0!==e[t]))){for(s in i)a.o(i,s)&&(a.m[s]=i[s]);if(l)var d=l(a)}for(t&&t(r);c<o.length;c++)n=o[c],a.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return a.O(d)},r=self["webpackChunktodo_buudienxatulap"]=self["webpackChunktodo_buudienxatulap"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var r=a.O(void 0,[736],(()=>a(4164)));r=a.O(r)})();