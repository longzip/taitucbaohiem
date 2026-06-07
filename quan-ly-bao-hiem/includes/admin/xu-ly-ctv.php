<?php
if (!current_user_can('manage_options')) wp_die('Chặn.');
global $wpdb;
$table_lich_su = $wpdb->prefix . 'qlbh_lich_su_dong_tien';

// Thiết lập bộ lọc tháng và năm phục vụ kế toán
$thang_loc = isset($_GET['thang_loc']) ? sanitize_text_field($_GET['thang_loc']) : date('m');
$nam_loc = isset($_GET['nam_loc']) ? sanitize_text_field($_GET['nam_loc']) : date('Y');

// Truy vấn tổng kết doanh số của từng CTV bằng lệnh GROUP BY SQL
$bxh_ctv = $wpdb->get_results($wpdb->prepare("
    SELECT nguoiThu as nguoi_thu,
           COUNT(id) as so_luot,
           SUM(tongTien) as tong_thu,
           SUM(tienHoaHong) as tong_hoa_hong
    FROM $table_lich_su
    WHERE MONTH(ngayLap) = %d AND YEAR(ngayLap) = %d
    GROUP BY nguoiThu
    ORDER BY tong_thu DESC
", $thang_loc, $nam_loc));

include QLBH_PATH . 'views/cong-tac-vien.php';
