// Kiem tra bien toan cuc de tranh viec script chay nhieu lan
if (window.hothamVnpostExtensionRunning) {
  console.log("VNPost Extension is already running.");
  // return;
} else {
  window.hothamVnpostExtensionRunning = true;
}

const LARAVEL_API_URL = "https://app.hotham.vn/api/vnpost/cap-nhat-bien-lai";

function notify(message, isError = false) {
  const alertPrefix = isError ? "❌ LỖI: " : "✅ ";
  alert(alertPrefix + message);
  if (isError) {
    window.hothamVnpostExtensionRunning = false; // Reset co khi co loi
  }
}

// Hàm hiển thị modal để sao chép thủ công
function showManualCopyModal(text) {
  const modalId = "hotham-copy-modal";
  if (document.getElementById(modalId)) return;
  const modalHTML = `<div id="${modalId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;"><div style="background-color: white; padding: 25px; border-radius: 8px; width: 90%; max-width: 600px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);"><h3 style="margin-top: 0; margin-bottom: 15px; font-family: sans-serif; color: #333;">Sao chép tin nhắn thủ công</h3><textarea style="width: 100%; height: 250px; margin-bottom: 15px; font-family: monospace; font-size: 13px; border: 1px solid #ccc; border-radius: 4px; padding: 10px;">${text}</textarea><button id="hotham-close-btn" style="background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">Đóng</button></div></div>`;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  const textarea = document.querySelector(`#${modalId} textarea`);
  textarea.select();
  textarea.focus();
  document.getElementById("hotham-close-btn").addEventListener("click", () => {
    document.getElementById(modalId).remove();
  });
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async function () {
  try {
    if (typeof pdfjsLib === "undefined") {
      throw new Error("Thư viện pdf.js chưa được tải. Vui lòng tải lại trang và thử lại.");
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("pdf.worker.min.js");

    const response = await fetch(window.location.href);
    const pdfData = await response.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

    const allPayloads = [];
    const allNguoiNopInfo = [];
    const allMaTraCuu = [];
    let ngayGiaoDich = "hôm nay";
    let ngayGiaoDichApi = new Date().toISOString().slice(0, 10);
    let hasDate = false;

    notify(`Đang xử lý ${pdf.numPages} biên lai...`);

    function formatDate(match) {
        if (!match) return "hôm nay";
        const day = match[1].padStart(2, '0');
        const month = match[2].padStart(2, '0');
        const year = match[3];
        return `${day}/${month}/${year}`;
    }
    
    const formatSlashDate = (dateStr) => {
        if (!dateStr) return null;
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        } else if (parts.length === 2) {
            return `${parts[1]}-${parts[0].padStart(2, '0')}`;
        }
        return dateStr;
    };

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');

        const maTraCuu = (pageText.match(/Mã số tra cứu:\s*([A-Z0-9]+)/) || [])[1] || "";
        const hoTenMatch = pageText.match(/Họ và tên người nộp\s*:\s*(.*?)\s*Địa chỉ/);
        const hoTen = hoTenMatch ? hoTenMatch[1].trim() : "anh/chị";
        const nhanVien = (pageText.match(/(\d+_[a-zA-Z]+)/i) || [])[1]?.trim();

        if (!hasDate) {
            const ngayGiaoDichMatch = pageText.match(/Ngày\s*(\d{1,2})\s*tháng\s*(\d{1,2})\s*năm\s*(\d{4})/);
            if (ngayGiaoDichMatch) {
                ngayGiaoDich = formatDate(ngayGiaoDichMatch);
                const day = ngayGiaoDichMatch[1].padStart(2, '0');
                const month = ngayGiaoDichMatch[2].padStart(2, '0');
                const year = ngayGiaoDichMatch[3];
                ngayGiaoDichApi = `${year}-${month}-${day}`;
                hasDate = true;
            }
        }

        const noiDungThu = (pageText.match(/Nội dung thu\s*:\s*(.*?)\s*(?:Số tháng đóng|Số tiền thu)/s) || [])[1]?.trim().replace(/\s+/g, ' ') || "";
        
        let loaiBienLai = null;
        if (noiDungThu.includes('BHYT')) {
            loaiBienLai = 'BHYT';
        } else if (noiDungThu.includes('BHXH')) {
            loaiBienLai = 'BHXH';
        }

        let maXacNhan = "", maSoBHXH = "";
        if (noiDungThu) {
            const parts = noiDungThu.split(' - ');
            if (parts.length >= 2) {
                maXacNhan = parts[0].trim();
                maSoBHXH = parts[parts.length - 1].trim();
            }
        }

        const soThangDongMatch = pageText.match(/Số tháng đóng:\s*(\d+)/i);
        const soThangDong = soThangDongMatch ? parseInt(soThangDongMatch[1], 10) : null;

        const soTienThuMatch = pageText.match(/Số tiền thu\s*:\s*([\d.,]+)/i);
        let soTienThu = null;
        if (soTienThuMatch) {
            const amountString = soTienThuMatch[1].replace(/\./g, ''); // Bỏ dấu chấm phân cách hàng nghìn
            soTienThu = parseInt(amountString, 10);
        }

        const chuoiThoiGianMatch = pageText.match(/từ (?:ngày|tháng)\s*([\d\/]+)\s*đến (?:ngày|tháng)\s*([\d\/]+)/i);
        let tuThoiGian = null;
        let denThoiGian = null;
        if (chuoiThoiGianMatch) {
            const rawTuThoiGian = chuoiThoiGianMatch[1];
            const rawDenThoiGian = chuoiThoiGianMatch[2];

            const tuParts = rawTuThoiGian.split('/');
            if (tuParts.length === 2) { // "MM/YYYY" format
                tuThoiGian = `${tuParts[1]}-${tuParts[0].padStart(2, '0')}-01`;
            } else {
                tuThoiGian = formatSlashDate(rawTuThoiGian);
            }

            const denParts = rawDenThoiGian.split('/');
            if (denParts.length === 2) { // "MM/YYYY" format
                const month = parseInt(denParts[0], 10);
                const year = parseInt(denParts[1], 10);
                const endDate = new Date(year, month - 1, 1);

                let monthsToAdd;
                switch (soThangDong) {
                    case 3:
                        monthsToAdd = 3;
                        break;
                    case 6:
                        monthsToAdd = 4;
                        break;
                    case 12:
                        monthsToAdd = 7;
                        break;
                    default:
                        monthsToAdd = 1;
                        break;
                }
                endDate.setMonth(endDate.getMonth() + monthsToAdd);

                denThoiGian = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-01`;
            } else {
                denThoiGian = formatSlashDate(rawDenThoiGian);
            }
        }

        if (!maTraCuu || !maXacNhan || !maSoBHXH) {
            console.warn(`Thiếu thông tin trên trang ${i}. Bỏ qua.`);
            continue;
        }

        allMaTraCuu.push(maTraCuu);
        allNguoiNopInfo.push({ ten: hoTen, ma: maXacNhan });

        const payload = {
            ma_tra_cuu: maTraCuu,
            ma_xac_nhan: maXacNhan,
            ma_so_bhxh: maSoBHXH,
            noi_dung_thu_day_du: noiDungThu,
            loai_bien_lai: loaiBienLai,
            ngay_giao_dich: ngayGiaoDichApi,
            nhan_vien_thu: nhanVien,
            so_thang_dong: soThangDong,
            tu_thoi_gian: tuThoiGian,
            den_thoi_gian: denThoiGian,
            so_tien_thu: soTienThu
        };
        allPayloads.push(payload);
    }

    if (allPayloads.length === 0) {
        throw new Error("Không trích xuất được biên lai hợp lệ nào từ file PDF.");
    }

    const maXacNhanList = allNguoiNopInfo.map(info => `• ${info.ten}: ${info.ma}`).join('\n');
    const maTraCuuListForUrl = allMaTraCuu.join(',');
    const downloadLink = `https://www.hotham.vn/bien-lai-thu-tien?ma_tra_cuu=${maTraCuuListForUrl}`;
    const messageTemplate = `🔔 BIÊN LAI ĐIỆN TỬ BHXH – BHYT ĐÃ SẴN SÀNG\n\nKính gửi Quý khách hàng,\nBiên lai điện tử cho các giao dịch ngày ${ngayGiaoDich} đã được phát hành.\n\nQuý khách vui lòng tải biên lai tương ứng tại:\n👉 ${downloadLink}\n\n🔗 MÃ XÁC NHẬN TƯƠNG ỨNG:\n${maXacNhanList}\n\n📌 Tra cứu xác nhận trên cổng BHXH Việt Nam:\n👉 https://baohiemxahoi.gov.vn/tracuu/pages/tra-cuu-thong-tin-ghi-nhan-dong-bhxh-bhyt.aspx\n
✅ Lưu lại mã và biên lai để đảm bảo quyền lợi BHXH, BHYT trọn đời\n📞 Mọi thắc mắc, liên hệ: 0978.333.963 (Zalo – chị Hồ Thị Thắm)\n🌐 Website: www.hotham.vn`;

    try {
        await navigator.clipboard.writeText(messageTemplate);
        notify(`Đã tự động sao chép tin nhắn cho ${allPayloads.length} biên lai vào clipboard!`);
    } catch (clipboardErr) {
        console.warn('Lỗi sao chép tự động, hiển thị modal thủ công:', clipboardErr);
        showManualCopyModal(messageTemplate);
        notify("Sao chép tự động thất bại. Vui lòng sao chép tin nhắn trong hộp thoại vừa hiện ra.", true);
    }

    notify(`Đang gửi ${allPayloads.length} biên lai về máy chủ (cách nhau 0.5 giây)...`);
    let successCount = 0;
    
    async function saveToApi(data) {
        try {
            const response = await fetch(LARAVEL_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) {
                console.error(`Lưu dữ liệu thất bại cho mã ${data.ma_tra_cuu}: ${JSON.stringify(result)}`);
                return false;
            } else {
                console.log(`Lưu thành công: ${result.message}`);
                return true;
            }
        } catch (error) {
            console.error(`Không thể kết nối đến server để lưu mã ${data.ma_tra_cuu}.\nChi tiết: ${error.message}`);
            return false;
        }
    }

    for (const payload of allPayloads) {
        const success = await saveToApi(payload);
        if (success) {
            successCount++;
        }
        await delay(500);
    }

    notify(`Hoàn tất! Đã gửi thành công ${successCount}/${allPayloads.length} biên lai về máy chủ.`);
    window.hothamVnpostExtensionRunning = false; // Reset co khi chay xong

  } catch (error) {
    console.error("Lỗi hệ thống:", error);
    notify(`Một lỗi nghiêm trọng đã xảy ra: ${error.message}`, true);
  }
})();