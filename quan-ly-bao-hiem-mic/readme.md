
# Plugin Quản Lý Bảo Hiểm - Tiện Ích Mở Rộng MIC 169k

- **Tác giả:** Long Web Studio
- **Website:** www.longwebstudio.net
- **Zalo:** 0966570913 / 0374638603
- **Phiên bản:** 1.0.0
- **Mô tả:** Phân hệ mở rộng độc lập, tích hợp với WPGraphQL để quản lý Giấy chứng nhận bảo hiểm con người thương mại MIC gói 169k.

## Cài đặt

1.  Nén thư mục `quan-ly-bao-hiem-mic` thành một file `.zip`.
2.  Trong trang quản trị WordPress, điều hướng đến **Gói mở rộng (Plugins) -> Cài mới (Add New)**.
3.  Nhấp vào nút **Tải lên gói mở rộng (Upload Plugin)** và chọn file `.zip` bạn vừa tạo.
4.  Sau khi cài đặt xong, nhấp vào **Kích hoạt (Activate)**.

Khi kích hoạt, plugin sẽ tự động tạo ra hai bảng trong cơ sở dữ liệu:
- `wp_qlbh_hopdong_mic`: Để lưu thông tin hợp đồng.
- `wp_qlbh_mic_lich_su_thu_tien`: Để lưu lịch sử các lần thu tiền.

## Hướng dẫn sử dụng GraphQL API

Plugin này cung cấp các điểm cuối (endpoints) GraphQL để tương tác với dữ liệu hợp đồng bảo hiểm MIC. Bạn có thể sử dụng các công cụ như GraphiQL IDE để thực hiện các truy vấn này.

---

### Query: `danhSachTatCaMicDon`

Dùng để lấy danh sách tất cả các hợp đồng bảo hiểm.

- **Mô tả:** Trả về một danh sách các hợp đồng MIC. Có thể kết hợp với tham số `searchKeyword` để lọc kết quả dựa trên Số hợp đồng, Tên, CCCD, hoặc SĐT của người được bảo hiểm.

#### Truy vấn mẫu:

```graphql
query LayDanhSachHopDong($timKiem: String) {
  danhSachTatCaMicDon(searchKeyword: $timKiem) {
    idHopDong
    soHopDongMic
    ngayBatDau
    ngayHetHan
    trangThaiDon
    ndbhHoTen
    ndbhCccd
    ndbhSdt
    soNgayConLai
    lichSuChuaDuyet {
      idLog
      trangThaiNopTien
    }
    lichSuThanhToan {
        idLog
        ngayThu
        soHoaDon
        maTraCuu
    }
  }
}
```

#### Biến (Variables) mẫu:

```json
{
  "timKiem": "Nguyễn Văn A"
}
```

---

### Mutation: `thuTienMic`

Dùng để ghi nhận việc đã thu tiền cho một hợp đồng.

- **Mô tả:** 
    - Tạo một bản ghi lịch sử thu tiền mới cho `idHopDong` được chỉ định.
    - Nếu `idLog` được cung cấp, nó sẽ cập nhật bản ghi đã có thay vì tạo mới.
    - Nếu `soHoaDon` và `maTraCuu` được cung cấp đầy đủ, trạng thái hợp đồng sẽ được cập nhật thành `Hieu luc` và ngày hết hạn được gia hạn thêm 1 năm.
    - Nếu thiếu một trong hai, trạng thái hợp đồng sẽ là `Da thu tien` (Chờ biên lai).

#### Truy vấn mẫu:

```graphql
mutation GhiNhanThuTien($input: ThuTienMicInput!) {
  thuTienMic(input: $input) {
    success
    message
  }
}
```

#### Biến (Variables) mẫu:

*Để gia hạn hợp đồng:* 
```json
{
  "input": {
    "idHopDong": 123,
    "soHoaDon": "SHD789XYZ",
    "maTraCuu": "MTC123ABC",
    "phuongThuc": "Chuyen khoan"
  }
}
```

*Chỉ ghi nhận đã thu tiền (chờ biên lai):*
```json
{
  "input": {
    "idHopDong": 123,
    "phuongThuc": "Tien mat"
  }
}
```


---

### Mutation: `huyThuMic`

Dùng để hủy một giao dịch thu tiền đã được ghi nhận.

- **Mô tả:** Xóa một bản ghi trong lịch sử thu tiền dựa vào `idLog`. Đồng thời, trạng thái của hợp đồng gốc sẽ được chuyển về `Can tai tuc`.

#### Truy vấn mẫu:

```graphql
mutation HuyGhiNhanThuTien($logId: Int!) {
  huyThuMic(input: { idLog: $logId }) {
    success
    message
  }
}
```

#### Biến (Variables) mẫu:

```json
{
  "logId": 456
}
```

---

### Mutation: `taoHopDongMicTuBhyt`

Dùng để tạo nhanh một hợp đồng MIC mới từ dữ liệu BHYT có sẵn.

- **Mô tả:** Tìm kiếm thông tin người dùng trong bảng `wp_bhyts` thông qua `maSoBhxh`. Nếu tìm thấy và chưa có hợp đồng MIC nào tồn tại với mã BHXH đó, một hợp đồng MIC mới sẽ được tạo với trạng thái `Can tai tuc`.

#### Truy vấn mẫu:

```graphql
mutation TaoHĐMic($bhxh: String!) {
  taoHopDongMicTuBhyt(input: { maSoBhxh: $bhxh }) {
    success
    message
  }
}
```

#### Biến (Variables) mẫu:

```json
{
  "bhxh": "0123456789"
}
```

---

### Mutation: `luuHopDongMicTuGCN`

Dùng để tạo mới hoặc cập nhật một hợp đồng từ thông tin trên Giấy chứng nhận (GCN) bản cứng.

- **Mô tả:** 
    - Dữ liệu đầu vào là các thông tin trên GCN.
    - Plugin sẽ kiểm tra xem đã có hợp đồng nào với `ndbhCccd` (Số CCCD) tương ứng chưa.
    - Nếu có, hợp đồng sẽ được cập nhật.
    - Nếu chưa, một hợp đồng mới sẽ được tạo.
    - Trạng thái hợp đồng sẽ được tự động đặt là `Hieu luc`.

#### Truy vấn mẫu:

```graphql
mutation LuuHopDong($input: LuuHopDongMicTuGCNInput!) {
  luuHopDongMicTuGCN(input: $input) {
    success
    message
  }
}
```

#### Biến (Variables) mẫu:

```json
{
  "input": {
    "ndbhHoTen": "Nguyễn Thị B",
    "ndbhCccd": "098765432101",
    "ndbhNgaySinh": "15/05/1990",
    "ngayBatDau": "01/01/2024",
    "ngayHetHan": "31/12/2024",
    "soHopDongMic": "MIC2024-12345"
  }
}
```

---

## Tiện ích: Lưu hợp đồng từ GCN bằng Bookmarklet

Đây là một cách cực kỳ hiệu quả để lưu thông tin từ trang tra cứu Giấy chứng nhận của MIC vào hệ thống WordPress của bạn chỉ với một cú nhấp chuột.

### Cách tạo Bookmarklet

1.  Trên trình duyệt Chrome, nhấp chuột phải vào thanh dấu trang và chọn **Thêm trang (Add page)**.
2.  Ở ô **Tên (Name)**, bạn có thể đặt tên bất kỳ, ví dụ: `Lưu HĐ MIC`.
3.  Ở ô **URL**, dán **toàn bộ** đoạn mã JavaScript dưới đây vào.
4.  Nhấp **Lưu (Save)**.

### Mã JavaScript cho Bookmarklet

Sao chép toàn bộ đoạn mã dưới đây. **Lưu ý quan trọng:** bạn **BẮT BUỘC** phải thay đổi giá trị của `graphqlEndpoint` và các `selectors` để phù hợp với website của bạn và cấu trúc trang tra cứu của MIC.

```javascript
javascript:(function() {
    /*
     * ====================================================================
     *                    CÀI ĐẶT & TÙY CHỈNH
     * ====================================================================
     */

    // 1. URL GraphQL Endpoint của bạn
    // Thay 'https://your-website.com/graphql' bằng URL thật
    const graphqlEndpoint = 'https://your-website.com/graphql';

    // 2. CSS Selectors để lấy dữ liệu từ trang GCN
    // BẠN PHẢI THAY ĐỔI CÁC SELECTOR NÀY CHO ĐÚNG
    // Mở trang GCN -> Chuột phải -> Inspect để tìm ID hoặc class của các trường dữ liệu
    const SELECTORS = {
        hoTen: '#fullName',       // Ví dụ: '#lblFullName' hoặc '.ten-nguoi-mua'
        cccd: '#idCard',          // Ví dụ: '#lblIDCard'
        ngaySinh: '#dateOfBirth', // Ví dụ: '#lblDOB'
        soHopDong: '#policyNumber', // Ví dụ: '#lblPolicyNumber'
        ngayBatDau: '#startDate',   // Ví dụ: '#lblStartDate'
        ngayHetHan: '#endDate',     // Ví dụ: '#lblEndDate'
    };

    /*
     * ====================================================================
     *                  (Không cần chỉnh sửa code bên dưới)
     * ====================================================================
     */

    // Hàm helper để lấy text từ selector
    function getText(selector) {
        try {
            const element = document.querySelector(selector);
            return element ? element.innerText.trim() : '';
        } catch (e) {
            console.error(`Lỗi với selector: ${selector}`, e);
            return '';
        }
    }

    // Trích xuất dữ liệu
    const inputData = {
        ndbhHoTen: getText(SELECTORS.hoTen),
        ndbhCccd: getText(SELECTORS.cccd),
        ndbhNgaySinh: getText(SELECTORS.ngaySinh),
        soHopDongMic: getText(SELECTORS.soHopDong),
        ngayBatDau: getText(SELECTORS.ngayBatDau),
        ngayHetHan: getText(SELECTORS.ngayHetHan),
    };

    // Kiểm tra dữ liệu bắt buộc
    if (!inputData.ndbhHoTen || !inputData.ndbhCccd) {
        alert('Không thể tự động trích xuất đủ thông tin (Họ tên, CCCD) từ trang.\n\nVui lòng kiểm tra lại các giá trị `SELECTORS` trong mã bookmarklet.');
        return;
    }

    console.log("Dữ liệu đã trích xuất:", inputData);

    // Chuẩn bị mutation
    const mutation = `
        mutation LuuHopDong($input: LuuHopDongMicTuGCNInput!) {
          luuHopDongMicTuGCN(input: $input) {
            success
            message
          }
        }
    `;

    const variables = { "input": inputData };

    // Gửi yêu cầu GraphQL
    alert(`Đang tiến hành lưu hợp đồng cho:\n- Họ tên: ${inputData.ndbhHoTen}\n- CCCD: ${inputData.ndbhCccd}`);
    
    fetch(graphqlEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mutation, variables: variables })
    })
    .then(res => {
        if (!res.ok) { throw new Error('Network response was not ok: ' + res.statusText); }
        return res.json();
    })
    .then(result => {
        if (result.errors) {
            throw new Error("Lỗi từ GraphQL: " + JSON.stringify(result.errors));
        }
        const payload = result.data.luuHopDongMicTuGCN;
        if (payload.success) {
            alert('THÀNH CÔNG!\n\n' + payload.message);
        } else {
            alert('THẤT BẠI!\n\n' + payload.message);
        }
    })
    .catch(error => {
        console.error("Lỗi khi thực thi bookmarklet:", error);
        alert('Đã xảy ra lỗi nghiêm trọng khi gửi yêu cầu đến máy chủ.\n\nXem Console (F12) để biết thêm chi tiết.\nLỗi: ' + error.message);
    });
})();
```

### Cách sử dụng

1.  Truy cập trang tra cứu Giấy chứng nhận điện tử của MIC.
2.  Nhập thông tin và tra cứu để hiển thị chi tiết GCN.
3.  Trên trang chi tiết GCN, nhấp vào bookmark **Lưu HĐ MIC** mà bạn đã tạo.
4.  Bookmarklet sẽ tự động đọc thông tin, gửi về website WordPress của bạn và hiển thị thông báo thành công hoặc thất bại.
