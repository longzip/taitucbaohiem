function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const khoiTao = async () =>{
  await sleep(1000);
  const template = document.createElement('button');
template.innerHTML = "Bấm vào đây để liên kết khóa";
document.getElementsByClassName("header-right")[0].append(template);
template.onclick = () => window.location.replace(`https://app.buudienxatulap./#/settings?q=${document.cookie.split(";").find(c => c.includes("Abp.AuthToken=")).split("=")[1]}`);

  const tempTaiTuc = document.createElement('a');
tempTaiTuc.innerHTML = "Theo dõi tái tục";
document.getElementsByClassName("ncc-btn-group")[0].append(tempTaiTuc);
tempTaiTuc.onclick = taiTuc;
}
khoiTao();

const taiTuc = async () =>{
  let tblMaSoBH = document.getElementsByTagName('table')[0].rows;

let dsMaSoBH = [];

for (var i = 1; i < tblMaSoBH.length-1; i++) {
	dsMaSoBH.push(tblMaSoBH[i].cells[1].textContent);
}

window.location.replace(`https://app.buudienxatulap./#/phat-sinh?q=${dsMaSoBH.join()}`)
}