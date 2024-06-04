const resetCong = async () => {
  localStorage.setItem(
    "tongcong",
    JSON.stringify({ tongCong: 0, soHoaDon: [] })
  );
  document.getElementById("lbl_tien").textContent = 0;
  document.getElementById("btn-minus").textContent = "Cộng:";
  document.getElementById("txt_customer_value").value = "";
};
const searchBHYT = async (searchText) => {
  let a = document.createElement("a");
  a.target = "_blank";
  a.href = `https://thambuudien.ga/tra-thoi-han-bao-hiem-y-te?q=${searchText}`;
  a.click();
};

const luuVi = () => {
  localStorage.setItem(
    "ourarraykey",
    JSON.stringify(
      parseInt($("#wallet-current-balance").text().replaceAll(".", ""))
    )
  );
};

const saveWallet = () => {
  luuVi();
  resetCong();
  document.getElementById("btn-save").disabled = true;
};

let tongTien = 0;

const daThanhToan = () =>
  Math.ceil(
    (parseInt(localStorage.getItem("ourarraykey")) -
      parseInt($("#wallet-current-balance").text().replaceAll(".", ""))) /
      1000
  );

const showWallet = () => {
  // 	alert("Tổng: " + daThanhToan());
  const templ = document.getElementById("lbl_tien");
  templ.textContent = templ.textContent + ` = ${daThanhToan()}`;
};

const unLock = () => {
  //document.getElementById("btn-save").disabled = false;
  luuVi();
  resetCong();
};
const tienThua = () => {
  const { tongCong } = JSON.parse(localStorage.getItem("tongcong"));
  return parseInt(document.getElementById("txt_tien_value").value) - tongCong;
  //   if (
  //     tongCong ===
  //     parseInt(localStorage.getItem("ourarraykey")) -
  //       parseInt($("#wallet-current-balance").text().replaceAll(".", ""))
  //   )
  //     return (
  //       parseInt(document.getElementById("txt_tien_value").value) - daThanhToan()
  //     );
  //   else return 'Lỗi';
};

const tienTra = () =>
  Math.floor(
    (parseInt(document.getElementById("txt_tien_value").value) * 1000 -
      parseInt(
        document
          .getElementsByClassName("total-amount")[0]
          .textContent.replaceAll(".", "")
      )) /
      1000
  );

const traLai = () => {
  let { soHoaDon } = JSON.parse(localStorage.getItem("tongcong"));
  if (!soHoaDon) return;
  if (soHoaDon.length === 0) alert("Trả lại: " + tienTra());
  else alert("Trả lại: " + tienThua());
};
const readEvn = async () => {
  return {
    ma: document.getElementById("customer-code").textContent,
    ten: document.getElementById("customer-name").textContent,
    soDienThoai: document.getElementById("customer-phone").textContent,
    diaChi: document.getElementById("customer-address").textContent,
    soTien: document
      .getElementsByClassName("total-amount")[0]
      .textContent.replaceAll(".", ""),
    ghiChu: document.getElementById("depositor_note").value,
  };
};

const doCopy = async () => {
  const evn = await readEvn();
  document.getElementById("depositor_name").value = evn.ten;
  document.getElementById("depositor_address").value = evn.diaChi;
  let { soHoaDon, tongCong } = JSON.parse(localStorage.getItem("tongcong"));
  if (evn.ma && !soHoaDon.includes(evn.ma)) {
    tongCong += Math.ceil(parseInt(evn.soTien) / 1000);
    soHoaDon.push(evn.ma);
    localStorage.setItem("tongcong", JSON.stringify({ tongCong, soHoaDon }));
    document.getElementById("lbl_tien").textContent = tongCong.toLocaleString();
    document.getElementById(
      "btn-minus"
    ).textContent = `Cộng ${soHoaDon.length}:`;
    document.getElementById("txt_customer_value").value = "";
  }
  //   if (evn.ma)
  //     $.ajax({
  //       url: "https://lws.hotham.vn/wordpress/wp-content/app/api/evns",
  //       type: "POST",
  //       headers: headerParams,
  //       async: true,
  //       data: evn,
  //     });
};

function drawPrintEVN(trans) {
  let providerMap = JSON.parse(
    '{"CNBENTRE":{"logo":"https://static.paysmart.com.vn/billing/15.%20Bien_nhan_Cap_Nuoc_Ben_Tre.jpg","name":"Nước Bến Tre","type":"WACO","phone":"","district_id":"","iconUrl":"https://static.paysmart.com.vn/billing/icon-water/Water_Ben_Tre@3x.png","default":"true","province_id":"83","active":"true","service_code":"water","provider_code":"CNBENTRE"},"CNTHOTNOT":{"logo":"https://dev-stc.paysmart.com.vn/billing/12.%20Bien_nhan_Cap_Nuoc_Can_Tho_2.jpg","name":"Nước Thốt Nốt","type":"WACO","phone":"","district_id":"","iconUrl":"https://dev-stc.paysmart.com.vn/billing/icon-water/Water_ThotNot_CT@3x.png","default":"false","province_id":"92","active":"true","service_code":"water","provider_code":"CNTHOTNOT"},"CNCT":{"logo":"https://static.paysmart.com.vn/billing/11.%20Bien_Nhan_Cap_Nuoc_Can_Tho.png","name":"Nước Cần Thơ","type":"WACO","phone":"","district_id":"","iconUrl":"https://static.paysmart.com.vn/billing/icon-water/Water_Can_Tho@3x.png","default":"true","province_id":"92","active":"true","service_code":"water","provider_code":"CNCT"},"CNCAIRANG":{"logo":"https://dev-stc.paysmart.com.vn/billing/12.%20Bien_nhan_Cap_Nuoc_Can_Tho_2.jpg","name":"Nước Cái Răng","type":"WACO","phone":"","district_id":"","iconUrl":"https://dev-stc.paysmart.com.vn/billing/icon-water/Water_Cai_Rang_CT@3x.png","default":"false","province_id":"92","active":"true","service_code":"water","provider_code":"CNCAIRANG"},"CNTRANOC":{"logo":"https://dev-stc.paysmart.com.vn/billing/21.%20Bien_nhan_Cap_Nuoc_Tra_Noc_O_Mon.jpg","name":"Nước Trà Nóc - Ô Môn","type":"WACO","phone":"","district_id":"","iconUrl":"https://dev-stc.paysmart.com.vn/billing/icon-water/Water_Tra_Noc%403x.png","default":"false","province_id":"92","active":"true","service_code":"water","provider_code":"CNTRANOC"},"EVNS":{"logo":"https://static.paysmart.com.vn/icon/EVNSPC.png","name":"EVN Miền Nam","type":"EVN","phone":"","default":"true","district_id":"","province_id":"60","service_code":"electric","provider_code":"EVNS"},"EVNHN":{"logo":"https://dev-stc.paysmart.com.vn/billing/dien-evnhn.jpg","name":"EVN Hà Nội","type":"EVN","phone":"","district_id":"","iconUrl":"https://dev-stc.paysmart.com.vn/icon/EVNHN.png","default":"true","province_id":"01","active":"true","service_code":"electric","provider_code":"EVNHN"},"CNCANTHO2":{"logo":"https://static.paysmart.com.vn/billing/12.%20Bien_nhan_Cap_Nuoc_Can_Tho_2.jpg","name":"Nước Cần Thơ 2","type":"WACO","phone":"","district_id":"","iconUrl":"https://static.paysmart.com.vn/billing/icon-water/Water_Can_Tho2@3x.png","default":"false","province_id":"92","active":"true","service_code":"water","provider_code":"CNCANTHO2"}}'
  );

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
      price_DNTT: _billDetail.priceDNTT
        ? _billDetail.priceDNTT.replace(/;/g, "\n")
        : "\n",
      price_detail: formatNumberArray(_billDetail.priceDetail),
      amount_detail: formatNumberArray(_billDetail.amountDetail),
      total_capacity_no: formatDataEmpty(_billDetail.capacityNo),
      debt_amount: formatNumber(_billDetail.debtAmount),
      debt_fee: formatNumber(_billDetail.debtFee),
      amount: formatNumber(_bill.amount),
      amount_text: DOCSO().doc(_bill.amount) + " đồng chẵn",
    };

    let _base = $("<div />").append($("#bill-template-evn-1").html());

    Object.keys(_data).forEach((k, i) => {
      if (
        _base
          .find("#" + k)
          .prop("tagName")
          .toLowerCase() === "img"
      ) {
        _base.find("#" + k).prop("src", _data[k]);
      } else if (
        _base.find("#" + k).hasClass("price_DNTT") ||
        _base.find("#" + k).hasClass("price_detail") ||
        _base.find("#" + k).hasClass("amount_detail")
      ) {
        _base
          .find("#" + k)
          .empty()
          .html(_data[k]);
      } else {
        _base
          .find("#" + k)
          .empty()
          .text(_data[k]);
      }
    });

    if (k > 0) {
      _container.append($("<div style='page-break-before: always;'></div>"));
    }
    _container.append(_base.clone());
  }

  _container.print({
    globalStyles: false,
    stylesheet: "https://todo.hotham.vn/printv2.css",
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const khoiTao = async () => {
  await sleep(1000);
  const txtTien = $(
    '<input type="text" id="txt_tien_value" name="txt_tien_value" required="" data-parsley-trigger="change" data-parsley-length="[1,100]">'
  );
  //const btnSave = $('<button class="btn btn-info" type="button" onclick="saveWallet()" id="btn-save" disabled = true><i class="fa fa-save"></i> Lưu HĐ</button>');
  const btnShow = $(
    '<button class="btn btn-primary" type="button" onclick="showWallet()" id="btn-eye"><i class="fa fa-eye"></i> Xem</button>'
  );
  const btnLock = $(
    '<button class="btn btn-success" type="button" onclick="unLock()" id="btn-lock"><i class="fa fa-lock"></i> Xóa</button>'
  );
  const btnTraLai = $(
    '<button class="btn btn-secondary" type="button" onclick="traLai()" id="btn-minus">Cộng</button>'
  );
  const btnSaoChep = $(
    '<button class="btn btn-primary" type="button" onclick="doCopy()" id="btn-copy"><i class="fa fa-copy"></i> Copy</button>'
  );
  const lblTongCong = $(
    '<span id="lbl_tien" style="font-size: 28px; font-weight: 900;">0</span>'
  );

  //$("#wallet-current-balance").parent().append(btnSave);
  $("#wallet-current-balance").parent().append(btnShow);
  $("#wallet-current-balance").parent().append(btnLock);
  $("#wallet-current-balance").parent().append(txtTien);
  $("#wallet-current-balance").parent().append(btnTraLai);
  $("#wallet-current-balance").parent().append(lblTongCong);

  $("#btn-reset").parent().before(btnSaoChep);

  await sleep(1000);

  $("#bill-template-evn-1").html(`
  <div class="bill-container" style="font-size: 13px;">
  <section class="top row">
      <div class="col-2">
          <div class="logo" style="margin: 5px;">
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
width="70px" height="70px" viewBox="0 0 1160 1160" enable-background="new 0 0 1160 1160" xml:space="preserve">
<rect x="0" y="0" width="1160" height="1160" fill="rgb(255,255,255)" /><g transform="translate(80,80)"><g transform="translate(320,0) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,0) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,0) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,0) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,40) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,40) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,40) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,40) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,80) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,80) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,80) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,80) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,80) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,80) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,120) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,120) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,120) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,120) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,160) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,160) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,160) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,160) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,200) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,200) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,200) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,200) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,200) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,240) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,240) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,240) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,240) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,240) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,280) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,280) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(80,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(240,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(760,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(880,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(120,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(200,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(760,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(920,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(40,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(80,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(160,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(200,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(240,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(880,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(40,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(120,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(160,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(760,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(40,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(120,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(200,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(240,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(40,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(80,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(160,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(760,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(920,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(40,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(80,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(240,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(880,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(160,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(760,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(40,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(120,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(160,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(200,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(240,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(760,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(920,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,680) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,680) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,680) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,680) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,680) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,680) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,680) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,760) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,760) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,760) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,760) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,760) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,760) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,760) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,760) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(760,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,840) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,840) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,840) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(880,840) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(920,840) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(760,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(920,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,920) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,920) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,920) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,920) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,920) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,920) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(760,920) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,920) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,0) scale(2.8, 2.8)"><g transform="" style="fill: rgb(0, 0, 0);">
<g>
  <rect x="15" y="15" style="fill:none;" width="70" height="70"/>
  <path d="M85,0H15H0v15v70v15h15h70h15V85V15V0H85z M85,85H15V15h70V85z"/>
</g>
</g></g><g transform="translate(720,0) scale(2.8, 2.8)"><g transform="" style="fill: rgb(0, 0, 0);">
<g>
  <rect x="15" y="15" style="fill:none;" width="70" height="70"/>
  <path d="M85,0H15H0v15v70v15h15h70h15V85V15V0H85z M85,85H15V15h70V85z"/>
</g>
</g></g><g transform="translate(0,720) scale(2.8, 2.8)"><g transform="" style="fill: rgb(0, 0, 0);">
<g>
  <rect x="15" y="15" style="fill:none;" width="70" height="70"/>
  <path d="M85,0H15H0v15v70v15h15h70h15V85V15V0H85z M85,85H15V15h70V85z"/>
</g>
</g></g><g transform="translate(80,80) scale(1.2, 1.2)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,80) scale(1.2, 1.2)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(80,800) scale(1.2, 1.2)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g></g></svg>
          </div>
      </div>
      <div class="col-8" style="padding-top: 5px;font-size: 14px;">
          <div style="text-align: center">
              <b>THANH TOÁN TIỀN ĐIỆN QUA BƯU ĐIỆN VHX TỰ LẬP</b>
          </div>
          <div style="text-align: center;padding-top: 2px;font-size: 10px;">
          (từ <span id="start_date">20/04/2019</span> đến <span id="end_date">20/04/2019</span>)<br>
          </div>
          <div style="text-align: center;padding-top: 5px;font-size: 18px;">
              💥 Lịch thu: Buổi sáng từ 8h00- 11h00 (Các ngày 13, 14 & 15 hàng tháng, nghỉ CN).
          </div>
      </div>
      <div class="col-2">
          <div class="logo" style="margin: 5px;float: right;">
              <img id="provider_logo" src="/resources/assets/images/logo_vietnam_post.png" width="70px" height="70px">
          </div>
      </div>
  </section>

  <section class="customer-info row">
      <div class="left col-6">
          <div style="margin: 5px;">
              <div class="item" style="display: flex;align-items: center">
                  <div>
                      Tên KH:
                  </div>
                  <div style="font-weight: bold;" id="customer_name">BUI ANH TRUNG</div>
              </div>
              <div class="item" style="display: flex;align-items: flex-start">
                  <div style="min-width: -moz-max-content;min-width: max-content;">
                      Địa chỉ:
                  </div>
                  <div style="font-weight: bold;" id="customer_address">
                      379 PHUNG SON A TAN LONG PH PG
                  </div>
              </div>
              <div class="item" style="display: flex;align-items: center">
                  <div>
                      Mã KH:
                  </div>
                  <div style="font-weight: bold;" id="customer_code">BUI ANH TRUNG</div>
              </div>
              <div class="item" style="display: flex;align-items: center">
                  <div>
                      Số công tơ:
                  </div>
                  <div style="font-weight: bold;" id="capacity_no">BUI ANH TRUNG</div>
              </div>
              <div class="item" style="display: flex;align-items: center">
                  <div>
                      Số hộ:
                  </div>
                  <div style="font-weight: bold;" id="home_no">BUI ANH TRUNG</div>
              </div>
              <div class="item" style="display: flex;align-items: center">
                  <div>
                      Seri HĐĐT:
                  </div>
                  <div style="font-weight: bold;" id="serial_number">BUI ANH TRUNG</div>
              </div>
          </div>
      </div>
      <div class="left col-6">
          <div style="margin: 5px;">
              <div class="item" style="display: flex;align-items: center">
                  <div>
                      ID hóa đơn:
                  </div>
                  <div style="font-weight: bold;" id="bill_id">BUI ANH TRUNG</div>
              </div>
              <div class="item" style="display: flex;align-items: center">
                  <div>
                      NV: <span style="font-weight: bold;">Hồ Thị Thắm - 0978.333.963 </span>
                  </div>
                  (<div id="payment_method">379 PHUNG SON A TAN LONG PH PG</div>)
              </div>
              <div class="item" style="display: flex;align-items: start">
                  <div style="min-width: -moz-max-content;min-width: max-content;">
                      Nội dung:
                  </div>
                  <div style="font-weight: bold;word-wrap: break-word;">Thanh toán hóa đơn tiền điện kỳ <span id="period">20/04/2019</span> từ ngày <span id="content_start_date">20/04/2019</span> đến ngày <span id="content_end_date">20/04/2019</span></div>
              </div>
              <div class="item" style="display: flex;align-items: center">
                  <div>
                      CSĐK:
                  </div>
                  <div style="font-weight: bold;" id="start_stage_no">BUI ANH TRUNG</div>
              </div>
              <div class="item" style="display: flex;align-items: center">
                  <div>
                      CSCK:
                  </div>
                  <div style="font-weight: bold;" id="end_stage_no">BUI ANH TRUNG</div>
              </div>
          </div>
      </div>
  </section>

  <section class="signature-evn row">
      <div class="col-12">
          <table style="width: 100%;">
              <colgroup>
                  <col width="30%">
                  <col width="30%">
                  <col width="40%">
              </colgroup>
              <tr>
                  <th>ĐNTT</th>
                  <th>Đơn giá (VND)</th>
                  <th>Thành tiền (VND)</th>
              </tr>
              <tr>
                  <td style="text-align: right; padding-right: 5px;"><div id="price_DNTT" style="white-space: pre-line;"></div></td>
                  <td style="text-align: right; padding-right: 5px;"><div id="price_detail" style="white-space: pre-line;"></div></td>
                  <td style="text-align: right; padding-right: 5px;"><div id="amount_detail" style="white-space: pre-line;"></div></td>
              </tr>
              <tr>
                  <td id="total_capacity_no" style="text-align: right; padding-right: 5px;"></td>
                  <td></td>
                  <td id="debt_amount" style="text-align: right; padding-right: 5px;"></td>
              </tr>
              <tr>
                  <th colspan="2" style="text-align: left; padding-left: 5px;">
                      Thuế GTGT
                  </th>
                  <td id="debt_fee" style="text-align: right; padding-right: 5px;"></td>
              </tr>
              <tr>
                  <th colspan="2" style="text-align: left; padding-left: 5px;">
                      Số tiền thanh toán
                  </th>
                  <td id="amount" style="text-align: right; padding-right: 5px;"></td>
              </tr>
              <tr>
                  <td colspan="3" style="text-align: left; padding-left: 5px;">
                      <span style="font-weight: bold;">Số tiền bằng chữ: </span><span id="amount_text"></span>
                  </td>

              </tr>
              <tr>
                  <td colspan="3" style="text-align: left; padding-left: 5px; font-size: 14px;">
                  📌ĐÓNG TIỀN BHXH TỰ NGUYỆN + GIA HẠN THẺ BHYT QUA BƯU ĐIỆN:<br>
                      Người dân khi muốn <ins>tham gia BHXH tự nguyện</ins> (hỗ trợ 66K/tháng tiền đóng) để hưởng chế độ hưu trí và tử tuất, <ins>gia hạn thẻ bảo hiểm y tế (BHYT)</ins> có <strong>giảm trừ mức đóng</strong> chỉ cần đến trực tiếp Điểm thu BHXH, BHYT Bưu điện VHX Tự Lập <em>(thôn Phú Mỹ, xã Tự Lập, huyện Mê Linh, tp Hà Nội)</em> <strong>gặp chị Hồ Thị Thắm (<del>thay anh Lập nghỉ</del>)</strong> thông báo số BHXH (cung cấp mã thẻ BHYT cũ), nộp tiền đóng & nhận biên lai thu tiền.
                  </td>

              </tr>
          </table>
      </div>
  </section>

</div>
  `);

  try {
    document.getElementById("txt_tien_value").addEventListener(
      "keydown",
      function (event) {
        if (event.keyCode == 13) {
          traLai();
        }
      },
      true
    );
  } catch (error) {}
  try {
    let { soHoaDon, tongCong } = JSON.parse(localStorage.getItem("tongcong"));
    document.getElementById("lbl_tien").textContent = tongCong.toLocaleString();
    document.getElementById(
      "btn-minus"
    ).textContent = `Cộng ${soHoaDon.length}:`;
  } catch (error) {}
};

khoiTao();
