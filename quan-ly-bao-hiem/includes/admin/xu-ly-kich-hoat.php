<?php
if (!current_user_can('manage_options')) wp_die('Chặn.');
global $wpdb;
$table_bhyt = $wpdb->prefix . 'bhyts';
$table_bhxh = $wpdb->prefix . 'qlbh_bhxh_mo_rong';
$thong_bao = '';
$khach_id_get = isset($_GET['khach_id']) ? intval($_GET['khach_id']) : '';

if (isset($_POST['qlbh_Luu_bhxh']) && check_admin_referer('qlbh_kich_hoat_bhxh_nonce')) {
    $khach_id = intval($_POST['khach_hang_id']);
    $ma_bhxh = sanitize_text_field($_POST['ma_so_bhxh']);
    $ngay_het = sanitize_text_field($_POST['ngay_het_han_bhxh']);

    // 1. Lưu thông tin vào bảng BHXH mở rộng (Khóa chính là ma_so_bhxh)
    $wpdb->replace($table_bhxh, array(
        'maSoBhxh' => $ma_bhxh,
        'ngayHetHanBhxh' => $ngay_het,
        'ghiChu' => sanitize_textarea_field($_POST['ghi_chu_bhxh'])
    ));

    // 2. Cập nhật ngược lại mã số BHXH vào bảng BHYT gốc để tạo liên kết liên bảng
    $wpdb->update($table_bhyt, array('maSoBhxh' => $ma_bhxh), array('id' => $khach_id));

    $thong_bao = '<div class="notice notice-success"><p>Đã liên kết mã số và kích hoạt gói BHXH tự nguyện thành công!</p></div>';
}

$danh_sach_goc = $wpdb->get_results("SELECT id, hoTen FROM $table_bhyt ORDER BY hoTen ASC");

