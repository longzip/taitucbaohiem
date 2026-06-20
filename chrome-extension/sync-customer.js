// 1. Cấu hình URL API của bạn
const apiUrl = 'https://hotham.vn/wordpress/rYkOy1HCCRD0JZZcrshVYaUR39QfcG15QWUC437BMM5Pk3gNLu';

// ==========================================
// PHẦN 1: TỰ ĐỘNG LẤY PARAMETER URL ĐIỀN FORM
// ==========================================
function autoFillForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const paramMaThe = urlParams.get('mathe');
    const paramHoTen = urlParams.get('hoten');
    const paramNgaySinh = urlParams.get('ngaysinh');

    if (paramMaThe) {
        const inputMaThe = document.getElementById('txtMaThe');
        if (inputMaThe) {
            inputMaThe.value = paramMaThe;
            inputMaThe.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
    if (paramHoTen) {
        const inputHoTen = document.getElementById('txtHoTen');
        if (inputHoTen) {
            inputHoTen.value = paramHoTen;
            inputHoTen.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
    if (paramNgaySinh) {
        const inputNgaySinh = document.getElementById('txtNgaySinh');
        if (inputNgaySinh) {
            inputNgaySinh.value = paramNgaySinh;
            inputNgaySinh.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
}

// ==========================================
// PHẦN 2: TRÍCH XUẤT DỮ LIỆU & GỬI API
// ==========================================
function extractAndSaveData() {
    // Tìm vùng chứa thông báo kết quả tra cứu
    const containerKetQua = document.querySelector('.ketqua-tracuu');
    if (!containerKetQua) return;

    // Gộp toàn bộ văn bản xuất hiện trong vùng kết quả để Regex không bị sót thẻ HTML
    const allTextResult = containerKetQua.textContent || '';

    // Lấy các phần tử form input làm dữ liệu dự phòng
    const inputMaThe = document.getElementById('txtMaThe');
    const inputHoTen = document.getElementById('txtHoTen');
    const inputNgaySinh = document.getElementById('txtNgaySinh');

    // --- 1. XỬ LÝ MÃ SỐ BHXH (10 SỐ CUỐI) ---
    let maSoBhxh = '';
    let maTheGoc = ''
    const matchMaThe = allTextResult.match(/Mã thẻ:\s*([A-Z0-9]+)/);

    if (matchMaThe) {
        maTheGoc = matchMaThe[1].trim();
        if (maTheGoc.length >= 10) maSoBhxh = maTheGoc.slice(-10);
    } else if (inputMaThe && inputMaThe.value.trim()) {
        let maTheForm = inputMaThe.value.trim();
        if (maTheForm.length >= 10) maSoBhxh = maTheForm.slice(-10);
        else maSoBhxh = maTheForm;
    }

    // --- 2. XỬ LÝ HỌ TÊN ---
    let hoTen = '';
    const matchHoTen = allTextResult.match(/Họ tên:\s*([^,!\n]+)/);
    if (matchHoTen) {
        hoTen = matchHoTen[1].trim();
    } else if (inputHoTen && inputHoTen.value.trim()) {
        hoTen = inputHoTen.value.trim();
    }

    // --- 3. XỬ LÝ NGÀY SINH ---
    // Luôn ưu tiên lấy ngày sinh đầy đủ từ ô nhập liệu trên form
    let ngaySinh = inputNgaySinh ? inputNgaySinh.value.trim() : '';

    // --- 4. XỬ LÝ HẠN THẺ (Quét toàn bộ chuỗi kết quả) ---
    let hanTheTuNgay = '';
    let hanTheDenNgay = '';

    // Ưu tiên 1: Tìm định dạng gia hạn mới "Hạn thẻ từ ngày DD/MM/YYYY đến ngày DD/MM/YYYY"
    const matchHanTheMoi = allTextResult.match(/Hạn thẻ từ ngày\s*([0-9\/]+)\s*đến ngày\s*([0-9\/]+)/);

    if (matchHanTheMoi) {
        hanTheTuNgay = matchHanTheMoi[1].trim();
        hanTheDenNgay = matchHanTheMoi[2].trim();
    } else {
        // Ưu tiên 2: Tìm định dạng cũ "Hạn thẻ: DD/MM/YYYY - DD/MM/YYYY"
        const matchHanTheCu = allTextResult.match(/Hạn thẻ:\s*([0-9\/]+\s*-\s*[0-9\/]+)/);
        if (matchHanTheCu) {
            const dates = matchHanTheCu[1].split('-');
            if (dates.length === 2) {
                hanTheTuNgay = dates[0].trim();
                hanTheDenNgay = dates[1].trim();
            }
        }
    }

    // --- 5. XỬ LÝ ĐỦ 5 NĂM LIÊN TỤC ---
    let du5NamLienTuc = '';
    const match5Nam = allTextResult.match(/Thời điểm đủ 5 năm liên tục:\s*([^)]+)/);
    if (match5Nam) {
        du5NamLienTuc = match5Nam[1].trim();
    }

    // --- 6. ĐÓNG GÓI DỮ LIỆU ---
    const payloadData = {
        maSoBhxh: maSoBhxh,
        hoVaTen: hoTen,
        ngaySinh: ngaySinh,
        hanTheTuNgay: hanTheTuNgay,
        hanTheDenNgay: hanTheDenNgay,
        thoiDiem5Nam: du5NamLienTuc,
        maSoThe: maTheGoc
    };

    console.log('Tiện ích BHXH trích xuất kết quả mới:', payloadData);

    const mutation = `
        mutation SyncCustomer($input: SyncCustomerInput!) {
            syncCustomer(input: $input) {
                message
                status
            }
        }
    `;

    // Gửi dữ liệu qua API bằng Fetch
    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: mutation,
            variables: {
                input: payloadData
            }
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.data && result.data.syncCustomer && result.data.syncCustomer.status === 'success') {
            alert('Tiện ích BHXH: Đã tự động lưu kết quả vào CSDL!');
        } else {
            const errorMessage = result.errors ? result.errors.map(e => e.message).join('\n') : (result.data.syncCustomer ? result.data.syncCustomer.message : 'Lỗi không xác định');
            console.error('Tiện ích BHXH: Gửi API thất bại. Lỗi:', errorMessage);
        }
    })
    .catch(error => console.error('Tiện ích BHXH: Lỗi kết nối API:', error));
}

// ==========================================
// PHẦN 3: KHỞI CHẠY TỰ ĐỘNG
// ==========================================
// 1. Chạy ngay lệnh điền form khi vừa load xong trang
autoFillForm();

// 2. Lắng nghe thay đổi AJAX ở vùng kết quả #tcContainer
const targetContainer = document.getElementById('tcContainer');
if (targetContainer) {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                extractAndSaveData();
            }
        });
    });

    observer.observe(targetContainer, { childList: true, subtree: true });
    console.log('Tiện ích BHXH: Đã kích hoạt chế độ tự động lắng nghe kết quả tra cứu.');

    // Kiểm tra luôn nếu trang đã có sẵn dữ liệu từ trước
    extractAndSaveData();
}
