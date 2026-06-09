<?php
if (!current_user_can('manage_options')) wp_die('Chặn.');
global $wpdb;
$table_lich_su = $wpdb->prefix . 'qlbh_lich_su_dong_tien';
$table_bhyt = $wpdb->prefix . 'bhyts';
$thong_bao = '';

// 1. LOGIC XÓA RÁC CACHE HỆ THỐNG
if (isset($_POST['qlbh_clean_cache']) && check_admin_referer('qlbh_clean_cache_nonce')) {
    wp_cache_flush();
    $thong_bao = '<div class="notice notice-success"><p>🚀 Đã làm sạch toàn bộ bộ nhớ đệm tạm thời!</p></div>';
}

// 2. LOGIC ĐÓNG GÓI ARCHIVE NĂM CŨ
if (isset($_POST['qlbh_archive_data']) && check_admin_referer('qlbh_archive_nonce')) {
    $nam_can_xoa = intval($_POST['nam_archive']);
    $data_excel = $wpdb->get_results($wpdb->prepare("SELECT ls.*, b.hoTen FROM $table_lich_su ls JOIN $table_bhyt b ON ls.khachHangId = b.id WHERE YEAR(ls.ngayLap) = %d ORDER BY ls.ngayLap ASC", $nam_can_xoa));

    if (!empty($data_excel)) {
        ob_clean();
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=KHO-NAM-'.$nam_can_xoa.'.csv');
        $output = fopen('php://output', 'w');
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF)); // Chống lỗi font chữ Việt
        fputcsv($output, array('Ngày Đóng', 'Tên Khách Hàng', 'Nguồn Thu', 'Số Tiền Thu', 'Tiền Hoa Hồng', 'Người Thu', 'Số Biên Lai'));

        foreach ($data_excel as $row) {
            fputcsv($output, array(date('d/m/Y', strtotime($row->ngayLap)), $row->hoTen, $row->loaiGiaoDich, $row->tongTien, $row->tienHoaHong, $row->nguoiThu, $row->soBienLai));
        }
        fclose($output);

        // Tiến hành xóa sạch dòng dữ liệu năm cũ trên web sau khi file đã tải về máy của bạn an toàn
        $wpdb->query($wpdb->prepare("DELETE FROM $table_lich_su WHERE YEAR(ngayLap) = %d", $nam_can_xoa));
        exit;
    } else {
        $thong_bao = '<div class="notice notice-error"><p>Không tìm thấy bất kỳ dữ liệu nào để nén đóng gói.</p></div>';
    }
}

include QLBH_PATH . 'views/toi-uu-he-thong.php';
