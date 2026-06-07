<?php
if (!current_user_can('manage_options')) wp_die('Chặn.');
global $wpdb;
$table_bhyt = $wpdb->prefix . 'bhyts';
$table_bhxh = $wpdb->prefix . 'qlbh_bhxh_mo_rong';

// Xử lý lệnh xóa khách hàng (vẫn giữ logic xóa liên đới để đảm bảo sạch dữ liệu)
if (isset($_GET['action']) && $_GET['action'] == 'xoa' && isset($_GET['id'])) {
    $id_xoa = intval($_GET['id']);
    $ma_bhxh_xoa = $wpdb->get_var($wpdb->prepare("SELECT maSoBhxh FROM $table_bhyt WHERE id = %d", $id_xoa));
    $wpdb->delete($table_bhyt, array('id' => $id_xoa));
    if (!empty($ma_bhxh_xoa)) {
        $wpdb->delete($table_bhxh, array('maSoBhxh' => $ma_bhxh_xoa));
    }
}

// Cấu hình phân trang
$so_dong_tren_trang = 20;
$trang_hien_tai = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
$offset = ($trang_hien_tai - 1) * $so_dong_tren_trang;

// Xử lý tìm kiếm
$search_term = isset($_POST['s']) ? sanitize_text_field($_POST['s']) : '';
$base_query = "FROM $table_bhyt b";
$where_clauses = array();
$params = array();

if (!empty($search_term)) {
    $search_like = '%' . $wpdb->esc_like($search_term) . '%';
    $where_clauses[] = "(b.hoTen LIKE %s OR b.soDienThoai LIKE %s OR b.soTheBhyt LIKE %s OR b.maSoBhxh LIKE %s)";
    $params = array_fill(0, 4, $search_like);
}

$where_sql = !empty($where_clauses) ? " WHERE " . implode(" AND ", $where_clauses) : "";

// Tính tổng số dòng
$count_query = "SELECT COUNT(*) $base_query $where_sql";
$tong_so_dong = $wpdb->get_var($wpdb->prepare($count_query, $params));
$tong_so_trang = ceil($tong_so_dong / $so_dong_tren_trang);

// Truy vấn dữ liệu chính chỉ từ bảng bhyts
$main_query = "SELECT b.* $base_query $where_sql ORDER BY b.denNgayDt ASC LIMIT %d, %d";
$full_params = array_merge($params, array($offset, $so_dong_tren_trang));
$results = $wpdb->get_results($wpdb->prepare($main_query, $full_params));

include QLBH_PATH . 'views/danh-sach.php';
