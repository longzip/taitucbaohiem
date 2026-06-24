const LARAVEL_API_URL = "https://app.hotham.vn/api/vnpost/cap-nhat-bien-lai";
(async function () {
  function notify(message, isError = false) {
    console.log(message);
    const alertPrefix = isError ? "❌ LỖI: " : "✅ ";
    alert(alertPrefix + message);
  }

  // Hàm chuyển đổi "Ngày DD tháng MM năm YYYY" sang "YYYY-MM-DD"
  function formatVnDateText(dateText) {
    if (!dateText) return null;
    const match = dateText.match(/Ngày\s+(\d+)\s+tháng\s+(\d+)\s+năm\s+(\d+)/i);
    if (match) {
      return `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(
        2,
        "0"
      )}`;
    }
    return null;
  }

  // Hàm chuyển đổi định dạng "DD/MM/YYYY" hoặc "MM/YYYY" sang định dạng ISO tương ứng
  function formatSlashDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(
        2,
        "0"
      )}`; // YYYY-MM-DD
    } else if (parts.length === 2) {
      return `${parts[1]}-${parts[0].padStart(2, "0")}`; // YYYY-MM
    }
    return dateStr;
  }

  async function saveToApi(data) {
    try {
      const response = await fetch(LARAVEL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        console.error(
          `Lưu dữ liệu thất bại cho mã ${data.ma_tra_cuu}: ${JSON.stringify(
            result
          )}`
        );
        return false;
      } else {
        console.log(`Lưu thành công: ${result.message}`);
        return true;
      }
    } catch (error) {
      console.error(
        `Không thể kết nối đến server để lưu mã ${data.ma_tra_cuu}.\nChi tiết: ${error.message}`
      );
      return false;
    }
  }

  function showManualCopyModal(text) {
    const modalId = "hotham-copy-modal";
    if (document.getElementById(modalId)) return;
    const modalHTML = `<div id="${modalId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;"><div style="background-color: white; padding: 25px; border-radius: 8px; width: 90%; max-width: 600px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);"><h3 style="margin-top: 0; margin-bottom: 15px; font-family: sans-serif; color: #333;">Sao chép tin nhắn thủ công</h3><textarea style="width: 100%; height: 250px; margin-bottom: 15px; font-family: monospace; font-size: 13px; border: 1px solid #ccc; border-radius: 4px; padding: 10px;">${text}</textarea><button id="hotham-close-btn" style="background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">Đóng</button></div></div>`;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    const textarea = document.querySelector(`#${modalId} textarea`);
    textarea.select();
    textarea.focus();
    document
      .getElementById("hotham-close-btn")
      .addEventListener("click", () => {
        document.getElementById(modalId).remove();
      });
  }

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    if (!window.location.href.startsWith("blob:")) {
      notify(
        "Bookmarklet này chỉ hoạt động trên trang xem file PDF blob.",
        true
      );
      return;
    }
    notify("Đang chuẩn bị trích xuất dữ liệu...");
    if (typeof window.pdfjsLib === "undefined") {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.onload = resolve;
        script.onerror = () =>
          reject(new Error("Không thể tải thư viện PDF.js"));
        document.head.appendChild(script);
      });
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }

    const response = await fetch(window.location.href);
    const pdfData = await response.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

    const allPayloads = [];
    const allNguoiNopInfo = [];
    const allMaTraCuu = [];
    let ngayGiaoDichOnyText = "hôm nay";

    notify(`Đang xử lý ${pdf.numPages} biên lai...`);

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");

      // Trích xuất Regex cơ bản
      const maTraCuu =
        (pageText.match(/Mã số tra cứu:\s*([A-Z0-9]+)/) || [])[1] || "";
      const hoTenMatch = pageText.match(
        /Họ và tên người nộp\s*:\s*(.*?)\s*(?:Ngày sinh|Địa chỉ)/
      );
      const hoTen = hoTenMatch ? hoTenMatch[1].trim() : "anh/chị";

      const ngaySinhRaw =
        (pageText.match(/Ngày sinh:\s*([\d\/]+)/) || [])[1] || "";
      const ngaySinh = formatSlashDate(ngaySinhRaw);

      const diaChiMatch = pageText.match(/Địa chỉ:\s*(.*?)\s*Nội dung thu/);
      const diaChi = diaChiMatch ? diaChiMatch[1].trim() : "";

      const ngayGiaoDichMatch = pageText.match(
        /(Ngày\s*\d{1,2}\s*tháng\s*\d{1,2}\s*năm\s*\d{4})/i
      );
      const ngayGiaoDichApi = ngayGiaoDichMatch
        ? formatVnDateText(ngayGiaoDichMatch[1])
        : new Date().toISOString().slice(0, 10);
      if (i === 1 && ngayGiaoDichMatch) {
        ngayGiaoDichOnyText = ngayGiaoDichMatch[1].replace(/\s+/g, " ");
      }

      const noiDungThu =
        (pageText.match(
          /Nội dung thu\s*:\s*(.*?)\s*(?:Số tháng đóng|Số tiền thu)/s
        ) || [])[1]
          ?.trim()
          .replace(/\s+/g, " ") || "";
      const soThangDongMatch = pageText.match(/Số tháng đóng:\s*(\d+)/);
      const soThangDong = soThangDongMatch
        ? parseInt(soThangDongMatch[1], 10)
        : null;

      const soTienThuMatch = pageText.match(/Số tiền thu:\s*([\d\.]+)/);
      const soTienThu = soTienThuMatch
        ? parseInt(soTienThuMatch[1].replace(/\./g, ""), 10)
        : 0;

      const nhanVienMatch = pageText.match(/Nhân viên\s*:\s*([^\s]+)/);
      const nhanVien = nhanVienMatch ? nhanVienMatch[1].trim() : "";

      // Phân loại bảo hiểm & tách mã nội dung thu
      let loaiBaoHiem = "CHƯA_PHÂN_LOẠI";
      let maXacNhan = "";
      let maSoBHXH = "";
      if (noiDungThu) {
        if (noiDungThu.toUpperCase().includes("BHYT")) loaiBaoHiem = "BHYT";
        else if (noiDungThu.toUpperCase().includes("BHXH"))
          loaiBaoHiem = "BHXH";

        const parts = noiDungThu.split(" - ");
        if (parts.length >= 2) {
          maXacNhan = parts[0].trim();
          maSoBHXH = parts[parts.length - 1].trim();
        }
      }

      // Tách khoảng thời gian Từ... Đến... (Định dạng YYYY-MM-DD hoặc YYYY-MM)
      let tuThoiGian = null;
      let denThoiGian = null;
      const chuoiThoiGianMatch = pageText.match(
        /Số tháng đóng:\s*\d+\s*\(([^)]+)\)/i
      );
      if (chuoiThoiGianMatch) {
        const dates = chuoiThoiGianMatch[1].match(/([\d\/]+)/g);
        if (dates && dates.length >= 2) {
          tuThoiGian = formatSlashDate(dates[0]);
          denThoiGian = formatSlashDate(dates[1]); // Đây chính là hạn thẻ nếu loaiBaoHiem == "BHYT"
        }
      }

      if (!maTraCuu || !maXacNhan || !maSoBHXH) {
        console.warn(`Thiếu thông tin bắt buộc trên trang ${i}. Bỏ qua.`);
        continue;
      }

      allMaTraCuu.push(maTraCuu);
      allNguoiNopInfo.push({ ten: hoTen, ma: maXacNhan });

      // Đóng gói Payload đầy đủ thông tin gửi API
      const payload = {
        maTraCuu,
        maXacNhan,
        maSoBHXH,
        loaiBaoHiem,
        hoTen,
        ngaySinh,
        diaChi,
        noiDungThu,
        soThangDong,
        tuThoiGian,
        denThoiGian, // Hạn thẻ BHYT / đến tháng BHXH
        soTienThu,
        nhanVienThu: nhanVien,
        ngayLap: ngayGiaoDichApi,
      };
      allPayloads.push(payload);
    }

    if (allPayloads.length === 0) {
      notify("Không trích xuất được biên lai hợp lệ nào từ file PDF.", true);
      return;
    }

    // Tạo template tin nhắn gửi khách hàng
    const maXacNhanList = allNguoiNopInfo
      .map((info) => `• ${info.ten}: ${info.ma}`)
      .join("\n");
    const maTraCuuListForUrl = allMaTraCuu.join(",");
    const downloadLink = `https://www.hotham.vn/bien-lai-thu-tien?ma_tra_cuu=${maTraCuuListForUrl}`;
    const messageTemplate = `🔔 BIÊN LAI ĐIỆN TỬ BHXH – BHYT ĐÃ SẴN SÀNG\n\nKính gửi Quý khách hàng,\nBiên lai điện tử cho các giao dịch ngày ${ngayGiaoDichOnyText} đã được phát hành.\n\nQuý khách vui lòng tải biên lai tương ứng tại:\n👉 ${downloadLink}\n\n🔗 MÃ XÁC NHẬN TƯƠNG ỨNG:\n${maXacNhanList}\n\n📌 Tra cứu xác nhận trên cổng BHXH Việt Nam:\n👉 https://baohiemxahoi.gov.vn/tracuu/pages/tra-cuu-thong-tin-ghi-nhan-dong-bhxh-bhyt.aspx\n\n✅ Lưu lại mã và biên lai để đảm bảo quyền lợi BHXH, BHYT trọn đời\n📞 Mọi thắc mắc, liên hệ: 0978.333.963 (Zalo – chị Hồ Thị Thắm)\n🌐 Website: www.hotham.vn`;

    try {
      await navigator.clipboard.writeText(messageTemplate);
      notify(
        `Đã tự động sao chép tin nhắn cho ${allPayloads.length} biên lai vào clipboard!`
      );
    } catch (clipboardErr) {
      console.warn(
        "Lỗi sao chép tự động, hiển thị modal thủ công:",
        clipboardErr
      );
      showManualCopyModal(messageTemplate);
      notify(
        "Sao chép tự động thất bại. Vui lòng sao chép tin nhắn trong hộp thoại vừa hiện ra.",
        true
      );
    }

    notify(
      `Đang gửi ${allPayloads.length} biên lai về máy chủ (cách nhau 0.5 giây)...`
    );
    let successCount = 0;
    for (const payload of allPayloads) {
      const success = await saveToApi(payload);
      if (success) {
        successCount++;
      }
      await delay(500);
    }
    notify(
      `Hoàn tất! Đã gửi thành công ${successCount}/${allPayloads.length} biên lai về máy chủ.`
    );
  } catch (error) {
    notify(`Một lỗi nghiêm trọng đã xảy ra: ${error.message}`, true);
  }
})();
