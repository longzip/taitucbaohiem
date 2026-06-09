<?php
if (!current_user_can('manage_options')) wp_die('Chặn.');
global $wpdb;
$table_lich_su = $wpdb->prefix . 'qlbh_lich_su_dong_tien';

// Mặc định lọc theo tháng hiện tại nếu không có lựa chọn nào khác
$thang_loc = isset($_GET['thang_loc']) ? sanitize_text_field($_GET['thang_loc']) : date('m');
$nam_loc = isset($_GET['nam_loc']) ? sanitize_text_field($_GET['nam_loc']) : date('Y');

$sql = "
    SELECT nguoiThu as nguoi_thu,
           COUNT(id) as so_luot,
           SUM(tongTien) as tong_thu,
           SUM(tienHoaHong) as tong_hoa_hong
    FROM $table_lich_su
";

$where_clauses = array();
$params = array();

if (!empty($thang_loc)) {
    $where_clauses[] = "MONTH(ngayLap) = %d";
    $params[] = $thang_loc;
}

$where_clauses[] = "YEAR(ngayLap) = %d";
$params[] = $nam_loc;

if (!empty($where_clauses)) {
    $sql .= " WHERE " . implode(" AND ", $where_clauses);
}

$sql .= "
    GROUP BY nguoiThu
    ORDER BY tong_thu DESC
";

$bxh_ctv = $wpdb->get_results($wpdb->prepare($sql, $params));

include QLBH_PATH . 'views/cong-tac-vien.php';
