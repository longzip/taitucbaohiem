async function runScript(tabId, tabUrl) {
    // Chỉ chạy kịch bản trên các URL blob, nơi PDF được hiển thị.
    // Đây là cách đáng tin cậy để đảm bảo chúng ta đang xử lý một tệp PDF.
    if (tabUrl && tabUrl.startsWith('blob:https://ssm.vnpost.vn')) {
        try {
            // Thực thi thư viện PDF.js trước
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['pdf.min.js']
            });

            // Sau đó thực thi kịch bản nội dung chính
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            });
        } catch (err) {
            // Có thể bỏ qua lỗi nếu không thể thực thi kịch bản trên một URL blob lạ
            console.warn(`Không thể thực thi kịch bản trên ${tabUrl}: ${err}`);
        }
    }
}

// Kích hoạt thủ công bằng cách nhấp vào biểu tượng tiện ích
chrome.action.onClicked.addListener((tab) => {
    runScript(tab.id, tab.url);
});

// Kích hoạt tự động khi tải trang
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Chỉ chạy khi URL của tab đã được cập nhật đầy đủ và là một blob URL
    if (changeInfo.status === 'complete') {
        runScript(tabId, tab.url);
    }
});
