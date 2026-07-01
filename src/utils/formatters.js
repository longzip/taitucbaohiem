import moment from "moment";

/**
 * Formats a date to a relative time string (e.g., "a few seconds ago").
 * @param {string | Date | null | undefined} date - The date to format.
 * @returns {string} The formatted relative time or a placeholder string.
 */
export const formatDate = (date) => {
  if (!date || String(date).trim() === "") {
    return "Chưa xác định";
  }
  const mDate = moment(date);
  if (!mDate.isValid()) {
    return "Ngày không hợp lệ";
  }
  return mDate.fromNow();
};

/**
 * Formats a date to a locale-specific date string (e.g., "dd/mm/yyyy").
 * @param {string | Date | null | undefined} dateString - The date to format.
 * @returns {string} The formatted date string or an empty string.
 */
export const dinhDangNgayThang = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

/**
 * Returns the relative time from now, without the suffix (e.g., "a few seconds").
 * @param {string | Date | null | undefined} date - The date to compare.
 * @returns {string} The relative time string.
 */
export const khoangCachThoiGian = (date) => {
  return moment(date).fromNow(true);
};


/**
 * Masks a portion of the social security number for privacy.
 * @param {string} maSoCanAn - The social security number to mask.
 * @returns {string} The masked number.
 */
export const baoMatSoBHXH = (maSoCanAn) => {
  if (!maSoCanAn || !maSoCanAn.length) return "";
  const s = [...maSoCanAn];
  // Replace 3 characters with '***', starting from the 7th character from the end.
  s.splice(-7, 3, "***");
  return s.join("");
};
