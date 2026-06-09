<?php
if (!current_user_can('manage_options')) wp_die('Chặn.');
global $wpdb;
$table_bhyt = $wpdb->prefix . 'bhyts';
$thong_bao = '';

if (isset($_POST['qlbh_Luu_bhyt']) && check_admin_referer('qlbh_them_bhyt')) {
    $wpdb->insert($table_bhyt, array(
        'hoTen' => sanitize_text_field($_POST['ho_ten']),
        'ngaySinhDt' => sanitize_text_field($_POST['ngay_sinh']),
        'soCmnd' => sanitize_text_field($_POST['so_cccd']),
        'soDienThoai' => sanitize_text_field($_POST['so_dien_thoai']),
        'soTheBhyt' => sanitize_text_field($_POST['ma_so_bhyt']),
        'maToKhaiRieng' => sanitize_text_field($_POST['ma_to_khai']), /* Nhận mã tờ khai */
        'diaChiLh' => sanitize_text_field($_POST['dia_ban']),
        'denNgayDt' => sanitize_text_field($_POST['ngay_het_han_bhyt']),
        'ghiChu' => sanitize_textarea_field($_POST['ghi_chu_bhyt'])
    ));
    $thong_bao = '<div class="notice notice-success is-dismissible"><p>Đã lưu thông tin người tham gia BHYT thành công!</p></div>';
}

include QLBH_PATH . 'views/them-moi-bhyt.php';
