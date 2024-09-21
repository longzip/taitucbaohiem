// src/utils/chuoi-utils.js

function laHoTenHopLe(chuoi) {
  // Loại bỏ khoảng trắng thừa đầu và cuối chuỗi
  chuoi = chuoi.trim();

  // Kiểm tra xem chuỗi có chứa ít nhất 2 từ
  if (chuoi.split(" ").length < 2) {
    return false;
  }

  // Kiểm tra xem mỗi từ có phải là chữ cái hay không
  const cacTu = chuoi.split(" ");
  for (let i = 0; i < cacTu.length; i++) {
    if (!/^[A-Za-z]+$/.test(cacTu[i])) {
      return false;
    }
  }

  // Nếu tất cả các điều kiện trên đều đúng, chuỗi là họ và tên hợp lệ
  return true;
}

function dinhDangHoTen(chuoi) {
  // Loại bỏ khoảng trắng thừa đầu và cuối chuỗi
  chuoi = chuoi.trim();

  // Kiểm tra xem chuỗi có phải là họ và tên hợp lệ không
  if (!laHoTenHopLe(chuoi)) {
    return chuoi;
  }

  // Viết hoa chữ cái đầu tiên của mỗi từ, các chữ còn lại viết thường
  let hoTenDinhDang = "";
  const cacTu = chuoi.split(" ");
  for (let i = 0; i < cacTu.length; i++) {
    hoTenDinhDang +=
      cacTu[i].charAt(0).toUpperCase() + cacTu[i].slice(1).toLowerCase() + " ";
  }

  // Loại bỏ khoảng trắng thừa ở cuối chuỗi
  return hoTenDinhDang.trim();
}

function vietHoaChuCaiDauTien(hoTen) {
  const cacTu = hoTen.split(" ");
  const cacTuVietHoa = cacTu.map((tu) => {
    return tu.charAt(0).toUpperCase() + tu.slice(1).toLowerCase();
  });
  return cacTuVietHoa.join(" ");
}

function lay10ChuSoCuoi(chuoi) {
  // Tách các số ra khỏi chuỗi
  const danhSachSo = chuoi.match(/\d+/g);

  // Gộp các số thành một chuỗi duy nhất
  const chuoiSoGop = danhSachSo.join("");

  // Kiểm tra xem chuỗi số có phải là dãy 10 chữ số không
  if (chuoiSoGop.length >= 10) {
    // Lấy 10 chữ số cuối cùng từ cuối lên
    return chuoiSoGop.slice(-10);
  } else {
    return null;
  }
}

function laCCCDChip(cccd) {
  // Kiểm tra độ dài
  if (cccd.length !== 12) {
    return false;
  }

  // Kiểm tra xem chuỗi có phải là số không
  if (!/^\d+$/.test(cccd)) {
    return false;
  }

  // Nếu chuỗi có độ dài là 12 và là số thì đó là CCCD
  return true;
}

function layPhanTuDauTienTuChuoiTachBangDauPhay(chuoi) {
  return chuoi.split("|")[0];
}

function dinhDangNgayThang(ngayThang) {
  const ngay = new Date(ngayThang);
  return ngay.toLocaleDateString("vi-VN");
}

function dinhDangSo(so, soChuSo = 0) {
  if (so > 0) {
    return so.toLocaleString("vi-VN", {
      minimumFractionDigits: soChuSo,
      maximumFractionDigits: soChuSo,
    });
  } else {
    return so;
  }
}

function dinhDangTien(tien) {
  return tien.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function laSoDienThoaiDiDongHopLe(soDienThoai) {
  // Kiểm tra độ dài
  if (soDienThoai.length !== 10) {
    return false;
  }

  // Kiểm tra xem chuỗi có phải là số không
  if (!/^\d+$/.test(soDienThoai)) {
    return false;
  }

  // Kiểm tra đầu số
  const dauSo = soDienThoai.substring(0, 2);
  const cacDauSoHopLe = ["09", "03", "01", "07", "08"]; // Thêm đầu số 07, 08
  if (!cacDauSoHopLe.includes(dauSo)) {
    return false;
  }

  // Nếu tất cả các điều kiện đều đúng, đó là số điện thoại di động hợp lệ
  return true;
}

function xacDinhLoaiChuoi(chuoi) {
  const phanTuDauTien = layPhanTuDauTienTuChuoiTachBangDauPhay(chuoi);

  if (laCCCDChip(phanTuDauTien)) {
    return "Số CCCD";
  } else if (laSoDienThoaiDiDongHopLe(phanTuDauTien)) {
    return "Số điện thoại di động";
  } else if (laHoTenHopLe(phanTuDauTien)) {
    return "Họ và tên";
  } else if (lay10ChuSoCuoi(phanTuDauTien).length === 10) {
    return "Dãy 10 chữ số cuối";
  } else {
    return "Loại chuỗi không xác định";
  }
}

export {
  laHoTenHopLe,
  dinhDangHoTen,
  vietHoaChuCaiDauTien,
  lay10ChuSoCuoi,
  laCCCDChip,
  layPhanTuDauTienTuChuoiTachBangDauPhay,
  dinhDangNgayThang,
  dinhDangSo,
  dinhDangTien,
  laSoDienThoaiDiDongHopLe,
  xacDinhLoaiChuoi,
};