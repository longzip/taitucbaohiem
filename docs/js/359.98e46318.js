"use strict";(self["webpackChunktodo_buudienxatulap"]=self["webpackChunktodo_buudienxatulap"]||[]).push([[359],{1359:(e,a,t)=>{t.r(a),t.d(a,{default:()=>b});var n=t(9835);function s(e,a,t,s,l,u){const o=(0,n.up)("q-input"),i=(0,n.up)("q-btn"),r=(0,n.up)("q-form"),m=(0,n.up)("q-card"),d=(0,n.up)("q-page");return(0,n.wg)(),(0,n.j4)(d,null,{default:(0,n.w5)((()=>[(0,n.Wm)(m,{class:"q-pa-md"},{default:(0,n.w5)((()=>[(0,n.Wm)(r,{onSubmit:u.luuThongTin,class:"q-gutter-md"},{default:(0,n.w5)((()=>[(0,n.Wm)(o,{filled:"",modelValue:l.formData.name,"onUpdate:modelValue":a[0]||(a[0]=e=>l.formData.name=e),label:"Tên của bạn *",hint:"Tên hoặc họ và tên","lazy-rules":"",rules:[e=>e&&e.length>0||"Vui lòng cho biết tên của bạn"]},null,8,["modelValue","rules"]),(0,n.Wm)(o,{modelValue:l.formData.email,"onUpdate:modelValue":a[1]||(a[1]=e=>l.formData.email=e),class:"q-mb-md",outlined:"",type:"email",label:"Tên đăng nhập",disable:""},null,8,["modelValue"]),(0,n.Wm)(o,{modelValue:l.formData.smsText,"onUpdate:modelValue":a[2]||(a[2]=e=>l.formData.smsText=e),class:"q-mb-md",outlined:"",type:"textarea",label:"Mẫu gửi tin SMS"},null,8,["modelValue"]),(0,n.Wm)(o,{modelValue:l.formData.isLogin,"onUpdate:modelValue":a[3]||(a[3]=e=>l.formData.isLogin=e),class:"q-mb-md",outlined:"",type:"textarea",label:"Khóa bí mật"},null,8,["modelValue"]),(0,n._)("div",null,[(0,n.Wm)(i,{label:"Cập nhật",type:"submit",color:"primary"})])])),_:1},8,["onSubmit"])])),_:1})])),_:1})}t(6822);var l=t(3100);const u={data(){return{formData:{name:"Bưu điện xã Tự Lập",email:"info@buudienxatulap.ga",smsText:"sss",isLogin:"a"}}},computed:{...(0,l.rn)("auth",["userDetails"])},methods:{...(0,l.nv)("auth",["firebaseUpdateUser","handleAuthStateChanged"]),luuThongTin(){this.$q.dialog({title:"Xác nhận",message:"Bạn có muốn lưu thông tin cấu hình",cancel:!0,persistent:!0}).onOk((()=>{this.firebaseUpdateUser({userId:this.userDetails.userId,updates:this.formData}),this.handleAuthStateChanged()}))},async saveBHYT(e){const a={"Content-Type":"application/json"},t="https://cmstulap.herokuapp.com/api/user-ghi-chu",n=await fetch(t,{method:"PUT",headers:a,body:JSON.stringify({ghiChu:e})}),s=await n.json();if(s.errors)throw console.error(s.errors),new Error("Failed to fetch API");return s}},mounted(){const{isLogin:e}=this.userDetails;this.$route.query.q?(this.formData.isLogin=this.$route.query.q,this.firebaseUpdateUser({userId:this.userDetails.userId,updates:this.formData}),this.handleAuthStateChanged(),this.saveBHYT(this.$route.query.q)):this.formData.isLogin=e}};var o=t(1639),i=t(9885),r=t(4458),m=t(8326),d=t(361),h=t(4455),p=t(9984),c=t.n(p);const f=(0,o.Z)(u,[["render",s]]),b=f;c()(u,"components",{QPage:i.Z,QCard:r.Z,QForm:m.Z,QInput:d.Z,QBtn:h.Z})}}]);