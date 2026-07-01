// src/utils/chon-muc-dong-bhyt.js

// 1. Chỉ cần thay đổi mức lương cơ sở tại đây (Ví dụ: 2.340.000đ hoặc 2.530.000đ)
const mucLuongCoSo = 2530000;

// 2. Tính mức đóng BHYT GỐC của 1 THÁNG theo quy định hộ gia đình
const base1Month = mucLuongCoSo * 0.045; // Người thứ 1: 4.5% mức lương cơ sở
const m1 = Math.round(base1Month); // Người thứ 1
const m2 = Math.round(base1Month * 0.7); // Người thứ 2: 70% người thứ 1
const m3 = Math.round(base1Month * 0.6); // Người thứ 3: 60% người thứ 1
const m4 = Math.round(base1Month * 0.5); // Người thứ 4: 50% người thứ 1
const m5 = Math.round(base1Month * 0.4); // Từ người thứ 5: 40% người thứ 1

// Hàm helper định dạng hiển thị tiền tệ VND (Ví dụ: 1.263.600đ)
const formatMoney = (val) => new Intl.NumberFormat("vi-VN").format(val) + "đ";

// 3. Khởi tạo danh sách mucDongBHYTOptions với đầy đủ các mức đóng 3, 6, 12 tháng
export const mucDongBHYTOptions = [
  // Mức 12 tháng (Mặc định ban đầu)
  {
    label: `T1 (12T): ${formatMoney(m1 * 12)}`,
    value: m1 * 12,
    color: "secondary",
  },
  { label: `T2 (12T): ${formatMoney(m2 * 12)}`, value: m2 * 12 },
  { label: `T3 (12T): ${formatMoney(m3 * 12)}`, value: m3 * 12 },
  { label: `T4 (12T): ${formatMoney(m4 * 12)}`, value: m4 * 12 },
  { label: `T5 (12T): ${formatMoney(m5 * 12)}`, value: m5 * 12 },

  // Mức 6 tháng
  {
    label: `T1 (6 tháng): ${formatMoney(m1 * 6)}`,
    value: m1 * 6,
    color: "primary",
  },
  { label: `T2 (6 tháng): ${formatMoney(m2 * 6)}`, value: m2 * 6 },
  { label: `T3 (6 tháng): ${formatMoney(m3 * 6)}`, value: m3 * 6 },
  { label: `T4 (6 tháng): ${formatMoney(m4 * 6)}`, value: m4 * 6 },
  { label: `T5 (6 tháng): ${formatMoney(m5 * 6)}`, value: m5 * 6 },

  // Mức 3 tháng
  {
    label: `T1 (3 tháng): ${formatMoney(m1 * 3)}`,
    value: m1 * 3,
    color: "warning",
  },
  { label: `T2 (3 tháng): ${formatMoney(m2 * 3)}`, value: m2 * 3 },
  { label: `T3 (3 tháng): ${formatMoney(m3 * 3)}`, value: m3 * 3 },
  { label: `T4 (3 tháng): ${formatMoney(m4 * 3)}`, value: m4 * 3 },
  { label: `T5 (3 tháng): ${formatMoney(m5 * 3)}`, value: m5 * 3 },

  { label: "Hủy thu", value: "0" },
];
