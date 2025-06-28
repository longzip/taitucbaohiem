// useDanhBaGenerator.js

export function useDanhBaGenerator() {
  // Lấy năm sinh
  const getBirthYear = (dateString) => {
    return new Date(dateString).getFullYear();
  };

  // Lấy tháng dạng 2 chữ số
  const getMonth = (dateString) => {
    return ("0" + (new Date(dateString).getMonth() + 1)).slice(-2);
  };

  // Tính tháng kế tiếp sau offset
  const nextMonth = (startMonth, offset) => {
    let next = (parseInt(startMonth) + offset) % 12;
    return ("0" + (next === 0 ? 12 : next)).slice(-2);
  };

  // Mã kỳ đóng BHXH
  const getBHXHPrefix = (maPhuongThucDong, ngayLapTN) => {
    if (!ngayLapTN) return "";
    const month = getMonth(ngayLapTN);

    switch (maPhuongThucDong) {
      case "1":
        return "M";
      case "3":
        return `Q_${month}-${nextMonth(month, 3)}-${nextMonth(
          month,
          6
        )}-${nextMonth(month, 9)}`;
      case "6":
        return `H_${month}-${nextMonth(month, 6)}`;
      case "12":
        return `Y_${month}`;
      default:
        return "";
    }
  };

  // Mã tháng BHYT
  const getBHYTSuffix = (ngayLap) => {
    if (!ngayLap) return "";
    const month = getMonth(ngayLap);
    return `BHYT${month}`;
  };

  const generateContacts = (data) => {
    const uniqueMap = new Map();

    data.forEach(person => {
      const phone = person.soDienThoai || person.soDienThoai2;
      if (!phone || uniqueMap.has(phone)) return; // Loại trùng số

      const name = `${person.hoTen} ${getBirthYear(person.ngaySinhDt)}`;
      const bhxh = getBHXHPrefix(person.maPhuongThucDong, person.ngayLapTN);
      const bhyt = getBHYTSuffix(person.ngayLap);
      const contactName = `${bhxh ? bhxh + '_' : ''}${bhyt}_${name}`;

      uniqueMap.set(phone, {
        Name: contactName,
        Phone: phone
      });
    });

    return Array.from(uniqueMap.values());
  };


  // Chuyển thành CSV
  const toCSV = (rows) => {
    if (!rows.length) return "";
    const headers = Object.keys(rows[0]);
    const lines = rows.map((row) =>
      headers.map((field) => `"${row[field] || ""}"`).join(",")
    );
    return [headers.join(","), ...lines].join("\n");
  };

  // Tải file CSV
  const downloadCSV = (filename, content) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Tích hợp: sinh CSV và tải về
  const exportDanhBaCSV = (data, filename = "danh_ba_bhxh_bhyt.csv") => {
    const contacts = generateContacts(data);
    const csv = toCSV(contacts);
    downloadCSV(filename, csv);
  };

  return {
    generateContacts,
    toCSV,
    downloadCSV,
    exportDanhBaCSV,
  };
}
