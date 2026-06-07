<?php
if (!current_user_can('manage_options')) wp_die('Chặn.');
global $wpdb;
$table_bhyt = $wpdb->prefix . 'qlbh_bhyt';
$table_bhxh = $wpdb->prefix . 'qlbh_bhxh_mo_rong';

// Xử lý lệnh xóa khách hàng
if (isset($_GET['action']) && $_GET['action'] == 'xoa' && isset($_GET['id'])) {
    $id_xoa = intval($_GET['id']);
    // Lấy mã số BHXH của người sắp xóa để xóa sạch thông tin ở cả bảng mở rộng
    $ma_bhxh_xoa = $wpdb->get_var($wpdb->prepare("SELECT maSoBhxh FROM $table_bhyt WHERE id = %d", $id_xoa));

    $wpdb->delete($table_bhyt, array('id' => $id_xoa));
    if (!empty($ma_bhxh_xoa)) {
        $wpdb->delete($table_bhxh, array('maSoBhxh' => $ma_bhxh_xoa));
    }
}

// Cấu hình phân trang tốc độ cao cho 3.000 dân
$so_dong_tren_trang = 20;
$trang_hien_tai = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
$offset = ($trang_hien_tai - 1) * $so_dong_tren_trang;

$search_term = isset($_POST['s']) ? sanitize_text_field($_POST['s']) : '';
$where_clause = "";

if (!empty($search_term)) {
    $where_clause = $wpdb->prepare(" WHERE b.hoTen LIKE %s OR b.soDienThoai LIKE %s OR b.soTheBhyt LIKE %s OR b.maSoBhxh LIKE %s ", '%' . $wpdb->esc_like($search_term) . '%', '%' . $wpdb->esc_like($search_term) . '%', '%' . $wpdb->esc_like($search_term) . '%', '%' . $wpdb->esc_like($search_term) . '%');
}

// Tính tổng dòng bằng liên kết khóa ngoại ma_so_bhxh mới
$tong_so_dong = $wpdb->get_var("SELECT COUNT(*) FROM $table_bhyt b LEFT JOIN $table_bhxh x ON b.maSoBhxh = x.maSoBhxh $where_clause");
$tong_so_trang = ceil($tong_so_dong / $so_dong_tren_trang);

// THAY ĐỔI QUAN TRỌNG: Sử dụng b.ma_so_bhxh = x.ma_so_bhxh để gộp dữ liệu
$results = $wpdb->get_results($wpdb->prepare("
    SELECT b.*, x.ngayHetHanBhxh
    FROM $table_bhyt b
    LEFT JOIN $table_bhxh x ON b.maSoBhxh = x.maSoBhxh
    $where_clause
    ORDER BY b.denNgayDt ASC
    LIMIT %d, %d
", $offset, $so_dong_tren_trang));

include QLBH_PATH . 'views/danh-sach.php';
