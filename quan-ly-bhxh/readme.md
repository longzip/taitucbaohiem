# Quản Lý Bảo Hiểm Xã Hội

Plugin WordPress để quản lý dữ liệu đóng BHXH và ghi nhận thanh toán qua WPGraphQL.

## Cài đặt

1. Tải lên thư mục `quan-ly-bhxh` vào thư mục `/wp-content/plugins/`.
2. Kích hoạt plugin thông qua menu 'Plugins' trong WordPress.

## Sử dụng

Plugin này mở rộng WPGraphQL với các loại và trường sau:

*   **Truy vấn `bhxhRecords`:** Lấy danh sách tất cả các hồ sơ BHXH.

    ```graphql
    query {
      bhxhRecords {
        id
        hoTen
        maSoBHXH
        tongTien
        trangThaiHoSo
      }
    }
    ```
