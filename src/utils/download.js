/**
 * Triggers a file download in the browser.
 * @param {string} filename - The desired name of the file.
 * @param {string} text - The content of the file.
 */
export const downloadFile = (filename, text) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  if (document.createEvent) {
    const event = document.createEvent("MouseEvents");
    event.initEvent("click", true, true);
    element.dispatchEvent(event);
  } else {
    element.click();
  }
};
