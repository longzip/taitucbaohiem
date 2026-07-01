import { Notify } from "quasar";

/**
 * Copies a plain text string to the clipboard.
 * @param {string} text - The text to copy.
 * @param {string} successMessage - The message to show on successful copy.
 */
const copyText = (text, successMessage = "Bạn đã sao chép thành công!") => {
  navigator.clipboard.writeText(text).then(
    () => {
      Notify.create({
        type: "positive",
        message: successMessage,
      });
    },
    (err) => {
      Notify.create({
        type: "negative",
        message: "Không thực hiện được! " + err,
      });
    }
  );
};

/**
 * Copies all social security numbers from a list of BHYT objects.
 * @param {Array<object>} bhyts - The list of BHYT objects.
 */
export const copyMaSoBhxh = (bhyts) => {
  if (!bhyts || bhyts.length === 0) return;
  const textToCopy = bhyts.map((bhyt) => bhyt.maSoBhxh).join("\r\n");
  copyText(textToCopy, `Đã sao chép ${bhyts.length} mã số BHXH.`);
};

/**
 * Copies all phone numbers from a list of BHYT objects.
 * @param {Array<object>} bhyts - The list of BHYT objects.
 */
export const copySoDienThoai = (bhyts) => {
  if (!bhyts || bhyts.length === 0) return;
  const phoneNumbers = [...new Set(bhyts.map((bhyt) => bhyt.soDienThoai2 || bhyt.soDienThoai))];
  const textToCopy = phoneNumbers.join("\r\n");
  copyText(textToCopy, `Đã sao chép ${phoneNumbers.length} số điện thoại.`);
};

/**
 * Creates and prepares a CSV-like string for phone book import.
 * @param {Array<object>} bhyts - The list of BHYT objects.
 * @returns {string} A string formatted for CSV phone book.
 */
export const prepareDanhBa = (bhyts) => {
  if (!bhyts || bhyts.length === 0) return "";

  const mapSoDienThoai = new Map();
  for (let bhyt of bhyts) {
    mapSoDienThoai.set(bhyt.soDienThoai2 || bhyt.soDienThoai, bhyt);
  }

  const danhBaList = [...new Set(
    [...mapSoDienThoai.values()].map(
      ({ soDienThoai2, soDienThoai, hoTen, ngaySinhDt }) =>
        `${hoTen} ${new Date(ngaySinhDt).getFullYear()}\t${soDienThoai2 || soDienThoai}`
    )
  )].join("\r\n");

  return "Name\tPhone\r\n" + danhBaList;
};
