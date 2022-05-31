const txtTien = $('<input type="text" id="txt_tien_value" name="txt_tien_value" required="" data-parsley-trigger="change" data-parsley-length="[1,100]">')
const btnSave = $('<button class="btn btn-secondary" type="button" onclick="saveWallet()" id="btn-save" disabled = true><i class="fa fa-save"></i> Lưu</button>');
const btnShow = $('<button class="btn btn-show" type="button" onclick="showWallet()" id="btn-eye"><i class="fa fa-eye"></i> Xem</button>');
const btnLock = $('<button class="btn btn-show" type="button" onclick="unLock()" id="btn-lock"><i class="fa fa-lock"></i> Mở</button>');
const btnTraLai = $('<button class="btn btn-show" type="button" onclick="traLai()" id="btn-minus"><i class="fa fa-minus"></i> Trả lại</button>');
const btnSaoChep = $('<button class="btn btn-copy" type="button" onclick="doCopy()" id="btn-copy"><i class="fa fa-copy"></i> Copy</button>');

$("#wallet-current-balance").parent().append(btnSave);
$("#wallet-current-balance").parent().append(btnShow);
$("#wallet-current-balance").parent().append(btnLock);
$("#wallet-current-balance").parent().append(txtTien);
$("#wallet-current-balance").parent().append(btnTraLai);
$("#btn-reset").parent().append(btnSaoChep);

document.getElementById("txt_tien_value").addEventListener("keydown",
   function(event) {
      if (event.keyCode == 13){
         traLai();
      }
   }, true);

const saveWallet = ()=> {
localStorage.setItem("ourarraykey",JSON.stringify(parseInt($("#wallet-current-balance").text().replaceAll(".",""))));
	alert("Đã lưu: " + parseInt(localStorage.getItem("ourarraykey")));
	document.getElementById("btn-save").disabled = true
}

let tongTien = 0;

const daThanhToan = () =>
	Math.round((parseInt(localStorage.getItem("ourarraykey"))-parseInt($("#wallet-current-balance").text().replaceAll(".","")))/1000+0.4)

const showWallet = ()=> {
	alert("Tổng: " + daThanhToan());
}

const unLock = () => {
	document.getElementById("btn-save").disabled = false;
}
const tienThua = () => parseInt(document.getElementById("txt_tien_value").value) - daThanhToan()

const tienTra = () => Math.floor((parseInt(document.getElementById("txt_tien_value").value)*1000 - parseInt($('#total-amount').text().replaceAll(".","")))/1000)

const traLai = () => {
	if(document.getElementById("btn-save").disabled === false)
		alert("Trả lại: " + tienTra())
	else
		alert("Trả lại: " + tienThua())
}
const readEvn = async () => {

	return {
		ma: document.getElementById("customer-code").textContent,
		ten: document.getElementById("customer-name").textContent,
		soDienThoai: document.getElementById("customer-phone").textContent,
		diaChi: document.getElementById("customer-address").textContent,
		soTien: document.getElementById("total-amount").textContent.replaceAll(".",""),
		ghiChu: document.getElementById("depositor_note").value,
	}
}

const doCopy = async () => {
	const evn = await readEvn();
	document.getElementById("depositor_name").value = evn.ten;
	document.getElementById("depositor_address").value = evn.diaChi;
	$.ajax({
    url: `https://evn-buudienxatulap.com/api/evns`,
    type: "POST",
    async: true,
    data: evn
  });
}