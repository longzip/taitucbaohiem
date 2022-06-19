const txtTien = $('<input type="text" id="txt_tien_value" name="txt_tien_value" required="" data-parsley-trigger="change" data-parsley-length="[1,100]">')
const btnSave = $('<button class="btn btn-info" type="button" onclick="saveWallet()" id="btn-save" disabled = true><i class="fa fa-save"></i> Lưu HĐ</button>');
const btnShow = $('<button class="btn btn-primary" type="button" onclick="showWallet()" id="btn-eye"><i class="fa fa-eye"></i> Xem</button>');
const btnLock = $('<button class="btn btn-success" type="button" onclick="unLock()" id="btn-lock"><i class="fa fa-lock"></i> Mở</button>');
const btnTraLai = $('<button class="btn btn-secondary" type="button" onclick="traLai()" id="btn-minus">Cộng</button>');
const btnSaoChep = $('<button class="btn btn-primary" type="button" onclick="doCopy()" id="btn-copy"><i class="fa fa-copy"></i> Copy</button>');
const lblTongCong = $('<span id="lbl_tien" style="font-size: 28px; font-weight: 900;">0</span>');


$("#wallet-current-balance").parent().append(btnSave);
$("#wallet-current-balance").parent().append(btnShow);
$("#wallet-current-balance").parent().append(btnLock);
$("#wallet-current-balance").parent().append(txtTien);
$("#wallet-current-balance").parent().append(btnTraLai);
$("#wallet-current-balance").parent().append(lblTongCong);

$("#btn-reset").parent().before(btnSaoChep);

document.getElementById("txt_tien_value").addEventListener("keydown",
   function(event) {
      if (event.keyCode == 13){
         traLai();
      }
   }, true);

const resetCong = () => {
  localStorage.setItem("tongcong",JSON.stringify({tongCong:0, soHoaDon:[]}));
	document.getElementById("lbl_tien").textContent = 0;
	document.getElementById("btn-minus").textContent= 'Cộng:';
	document.getElementById('txt_customer_value').value = '';
}

const luuVi = () =>{
  localStorage.setItem("ourarraykey",JSON.stringify(parseInt($("#wallet-current-balance").text().replaceAll(".",""))));
}

const saveWallet = ()=> {
	luuVi();
	resetCong();
	document.getElementById("btn-save").disabled = true
}

let tongTien = 0;

const daThanhToan = () =>
	Math.round((parseInt(localStorage.getItem("ourarraykey"))-parseInt($("#wallet-current-balance").text().replaceAll(".","")))/1000+0.4)

const showWallet = ()=> {
  // 	alert("Tổng: " + daThanhToan());
	const templ = document.getElementById("lbl_tien");
	templ.textContent = templ.textContent + ` = ${daThanhToan()}`;
}

const unLock = () => {
	document.getElementById("btn-save").disabled = false;
	luuVi();
	resetCong();
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
	let {soHoaDon, tongCong} = JSON.parse(localStorage.getItem("tongcong"));
	if(evn.ma && !soHoaDon.includes(evn.ma)){
		tongCong += parseInt(evn.soTien);
		soHoaDon.push(evn.ma);
		localStorage.setItem("tongcong",JSON.stringify({tongCong, soHoaDon}));
		document.getElementById("lbl_tien").textContent= tongCong.toLocaleString();
		document.getElementById("btn-minus").textContent= `Cộng ${soHoaDon.length}:`;
		document.getElementById('txt_customer_value').value = '';
	}
	if(evn.ma)
  	$.ajax({
       url: `https://evn-buudienxatulap.herokuapp.com/api/evns`,
       type: "POST",
       async: true,
       data: evn
     });
}