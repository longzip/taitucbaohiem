const timKiem=async()=>{let t=[],e=document.getElementsByTagName("table")[1];for(let a=1;a<e.rows.length;a++)t.push(e.rows[a].cells[1].textContent),await $.ajax({type:"PUT",url:`https://cmsbudientulap.com/api/bhyts/${e.rows[a].cells[1].textContent}`,data:{maSoBhxh:e.rows[a].cells[1].textContent,hoTen:e.rows[a].cells[2].textContent,ngaySinhDt:new Date(e.rows[a].cells[3].textContent.split("/").reverse().join("-")).toISOString(),gioiTinh:e.rows[a].cells[4].textContent.includes("Nam"),maHoGd:new URLSearchParams(window.location.search).get("maHo")}});location.replace(`https://longzip.github.io/todo-buudienxatulap/#/tra-cuu?q=${t.join()}`)};function sleep(t){return new Promise((e=>setTimeout(e,t)))}let maSoBhxhs=JSON.parse(localStorage.getItem("maSoBhxhs"));const luu=async()=>{let t=document.getElementsByTagName("table")[1],e=[];for(let s=1;s<t.rows.length;s++)t.rows[s].cells[6].textContent.includes("250")&&!maSoBhxhs.includes(t.rows[s].cells[1].textContent)&&e.push({maSoBhxh:t.rows[s].cells[1].textContent,hoTen:t.rows[s].cells[2].textContent,ngaySinhDt:new Date(t.rows[s].cells[2].textContent.split("/").reverse().join("-")),gioiTinh:t.rows[s].cells[3].textContent.includes("Nam"),maHoGd:new URLSearchParams(window.location.search).get("maHo")});if(e.length){console.log(e);let t=JSON.parse(localStorage.getItem("bhyts"));t=t.concat(e),t.length>10&&(await addBhyts(t),t=[],await sleep(200),await getBhyts(),maSoBhxhs=JSON.parse(localStorage.getItem("maSoBhxhs"))),await localStorage.setItem("bhyts",JSON.stringify(t))}let a=JSON.parse(localStorage.getItem("dsMaHos"));const o=a.pop();localStorage.setItem("dsMaHos",JSON.stringify(a)),o&&location.replace(`https://hgd.baohiemxahoi.gov.vn/doViewInfoHo.do?maHo=${o.maHoGd}`)},getHoGd=async()=>{let t=await $.ajax({type:"GET",url:"https://cmsbudientulap.com/api/maHoGd",data:{}});localStorage.setItem("dsMaHos",JSON.stringify(t))},getBhyts=async()=>{JSON.parse(localStorage.getItem("bhyts"));let t=await $.ajax({type:"GET",url:"https://cmsbudientulap.com/api/maSoBhxhs",data:{}});localStorage.setItem("maSoBhxhs",JSON.stringify(t.map((t=>t.maSoBhxh))))},addBhyts=async t=>{await $.ajax({type:"PUT",url:"https://cmsbudientulap.com/api/themds",data:{ds:t}})};let tudong=async()=>{await sleep(200);const t=document.createElement("a");t.innerHTML="Bấm vào đây để tra cứu nhanh BHYT",document.getElementsByTagName("table")[1].parentElement.append(t),t.onclick=timKiem};tudong();