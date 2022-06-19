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

function drawPrintEVN(trans) {
        let providerMap = JSON.parse('{"CNBENTRE":{"logo":"https:\/\/static.paysmart.com.vn\/billing\/15.%20Bien_nhan_Cap_Nuoc_Ben_Tre.jpg","name":"Nước Bến Tre","type":"WACO","phone":"","district_id":"","iconUrl":"https:\/\/static.paysmart.com.vn\/billing\/icon-water\/Water_Ben_Tre@3x.png","default":"true","province_id":"83","active":"true","service_code":"water","provider_code":"CNBENTRE"},"CNTHOTNOT":{"logo":"https:\/\/dev-stc.paysmart.com.vn\/billing\/12.%20Bien_nhan_Cap_Nuoc_Can_Tho_2.jpg","name":"Nước Thốt Nốt","type":"WACO","phone":"","district_id":"","iconUrl":"https:\/\/dev-stc.paysmart.com.vn\/billing\/icon-water\/Water_ThotNot_CT@3x.png","default":"false","province_id":"92","active":"true","service_code":"water","provider_code":"CNTHOTNOT"},"CNCT":{"logo":"https:\/\/static.paysmart.com.vn\/billing\/11.%20Bien_Nhan_Cap_Nuoc_Can_Tho.png","name":"Nước Cần Thơ","type":"WACO","phone":"","district_id":"","iconUrl":"https:\/\/static.paysmart.com.vn\/billing\/icon-water\/Water_Can_Tho@3x.png","default":"true","province_id":"92","active":"true","service_code":"water","provider_code":"CNCT"},"CNCAIRANG":{"logo":"https:\/\/dev-stc.paysmart.com.vn\/billing\/12.%20Bien_nhan_Cap_Nuoc_Can_Tho_2.jpg","name":"Nước Cái Răng","type":"WACO","phone":"","district_id":"","iconUrl":"https:\/\/dev-stc.paysmart.com.vn\/billing\/icon-water\/Water_Cai_Rang_CT@3x.png","default":"false","province_id":"92","active":"true","service_code":"water","provider_code":"CNCAIRANG"},"CNTRANOC":{"logo":"https:\/\/dev-stc.paysmart.com.vn\/billing\/21.%20Bien_nhan_Cap_Nuoc_Tra_Noc_O_Mon.jpg","name":"Nước Trà Nóc - Ô Môn","type":"WACO","phone":"","district_id":"","iconUrl":"https:\/\/dev-stc.paysmart.com.vn\/billing\/icon-water\/Water_Tra_Noc%403x.png","default":"false","province_id":"92","active":"true","service_code":"water","provider_code":"CNTRANOC"},"EVNS":{"logo":"https:\/\/static.paysmart.com.vn\/icon\/EVNSPC.png","name":"EVN Miền Nam","type":"EVN","phone":"","default":"true","district_id":"","province_id":"60","service_code":"electric","provider_code":"EVNS"},"EVNHN":{"logo":"https:\/\/dev-stc.paysmart.com.vn\/billing\/dien-evnhn.jpg","name":"EVN Hà Nội","type":"EVN","phone":"","district_id":"","iconUrl":"https:\/\/dev-stc.paysmart.com.vn\/icon\/EVNHN.png","default":"true","province_id":"01","active":"true","service_code":"electric","provider_code":"EVNHN"},"CNCANTHO2":{"logo":"https:\/\/static.paysmart.com.vn\/billing\/12.%20Bien_nhan_Cap_Nuoc_Can_Tho_2.jpg","name":"Nước Cần Thơ 2","type":"WACO","phone":"","district_id":"","iconUrl":"https:\/\/static.paysmart.com.vn\/billing\/icon-water\/Water_Can_Tho2@3x.png","default":"false","province_id":"92","active":"true","service_code":"water","provider_code":"CNCANTHO2"}}');

        let _container = $("<div />");
        let _bills = trans.bills;
        for (let k in _bills) {
            let _bill = _bills[k];
            let _billDetail = _bill.billDetail || {};
            let _data = {
                start_date: formatDataEmpty(_billDetail.startDate),
                end_date: formatDataEmpty(_billDetail.endDate),
                provider_logo: providerMap[trans.provider_code].iconUrl,
                customer_name: formatDataEmpty(trans.customer_name),
                customer_address: formatDataEmpty(trans.customer_address),
                customer_code: formatDataEmpty(trans.customer_code),
                capacity_no: formatDataEmpty(_billDetail.kwhNo),
                home_no: formatDataEmpty(_billDetail.homeNo),
                serial_number: formatDataEmpty(_billDetail.serialNumber),
                bill_id: formatDataEmpty(_bill.billId),
                payment_method: formatDataEmpty(_billDetail.paymentMethod),
                period: formatDataEmpty(_bill.period),
                content_start_date: formatDataEmpty(_billDetail.startDate),
                content_end_date: formatDataEmpty(_billDetail.endDate),
                start_stage_no: formatDataEmpty(_billDetail.startStageNo),
                end_stage_no: formatDataEmpty(_billDetail.endStageNo),
                price_DNTT: _billDetail.priceDNTT ? _billDetail.priceDNTT.replace(/;/g, "\n") : "\n",
                price_detail: formatNumberArray(_billDetail.priceDetail),
                amount_detail: formatNumberArray(_billDetail.amountDetail),
                total_capacity_no: formatDataEmpty(_billDetail.capacityNo),
                debt_amount: formatNumber(_billDetail.debtAmount),
                debt_fee: formatNumber(_billDetail.debtFee),
                amount: formatNumber(_bill.amount),
                amount_text: DOCSO().doc(_bill.amount) + " đồng chẵn"
            };

            let _base = $("<div />").append($("#bill-template-evn").html());

            Object.keys(_data).forEach((k, i) => {
                if (_base.find("#" + k).prop("tagName").toLowerCase() === 'img') {
                    _base.find("#" + k).prop("src", _data[k]);
                } else if (_base.find("#" + k).hasClass("price_DNTT") || _base.find("#" + k).hasClass("price_detail") || _base.find("#" + k).hasClass("amount_detail")) {
                    _base.find("#" + k).empty().html(_data[k]);
                } else {
                    _base.find("#" + k).empty().text(_data[k]);
                }
            });

            if (k > 0) {
                _container.append($("<div style='page-break-before: always;'></div>"));
            }
            _container.append(_base.clone());
        }

        _container.print({
            globalStyles: false,
            stylesheet: "https://app.buudienxatulap.ga/printv2.css"
        });
    }