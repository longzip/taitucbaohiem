// ==========================================
// 1. DANH SÁCH DỮ LIỆU THƯỜNG
// ==========================================
export const pureStatuses = [
  { label: "Chưa tái tục", value: "Chưa tái tục" },
  { label: "Chưa đồng bộ 1 ngày", value: "Chưa đồng bộ 1day" },
  { label: "Chưa đồng bộ 3 tháng", value: "Chưa đồng bộ" },
  { label: "Chưa liên hệ", value: "Chưa liên hệ" },
  { label: "Đã liên hệ", value: "Đã liên hệ" },
  { label: "Đã tái tục", value: "Đã tái tục" },
  { label: "Từ chối", value: "Từ chối" },
  { label: "Đã nộp BĐH", value: "Đã nộp BĐH" },
  { label: "Đã lưu", value: "Đã lưu" },
  { label: "Đã xóa", value: "Đã xóa" },
  {
    label: "Đã nhận kết quả phát sinh từ BHXH",
    value: "Đã nhận kết quả phát sinh từ BHXH",
  },
  {
    label: "Đã xác nhận yêu cầu phát sinh",
    value: "Đã xác nhận yêu cầu phát sinh",
  },
  { label: "Hồ sơ lỗi", value: "Hồ sơ lỗi" },
  {
    label: "Đã gửi yêu cầu phát sinh nhưng chưa nộp tờ khai",
    value: "Đã gửi yêu cầu phát sinh nhưng chưa nộp tờ khai",
  },
];

export const pureUsers = [
  { label: "Hồ Thị Thắm", value: "NV034186013128" },
  { label: "142010_giaodichvien", value: "3152" },
  { label: "Nguyễn Thị Hằng", value: "pvi" },
  { label: "CTV_TVLAP", value: "174265" },
  { label: "142010_Dam", value: "101130" },
  { label: "142010_truongbc", value: "3154" },
  { label: "142001_THUY", value: "107028" },
  { label: "142001_giaodichvien", value: "3148" },
  { label: "Khác", value: "" },
];

// ==========================================
// 2. TỰ ĐỘNG THÊM LỰA CHỌN "TẤT CẢ"
// ==========================================
export const statusOptions = [
  { label: "Tất cả", value: null },
  ...pureStatuses,
];

export const userOptions = [{ label: "Tất cả", value: null }, ...pureUsers];
