import moment from "moment";

/**
 * Formats a date to a relative time string (e.g., "a few seconds ago").
 * @param {string | Date | null | undefined} date - The date to format.
 * @returns {string} The formatted relative time or a placeholder string.
 */
export const formatDate = (date) => {
  // 1. Check for invalid input
  if (!date || String(date).trim() === "") {
    return "Chưa xác định";
  }

  // 2. Convert to a moment object
  const mDate = moment(date);

  // 3. Validate the date
  if (!mDate.isValid()) {
    return "Ngày không hợp lệ";
  }

  // 4. Return the relative time
  return mDate.fromNow();
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
