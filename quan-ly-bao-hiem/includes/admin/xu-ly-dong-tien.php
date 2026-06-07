<?php
if (!current_user_can('manage_options')) wp_die('Chặn.');
global $wpdb;
$table_bhyt = $wpdb->prefix . 'qlbh_bhyt';
$table_bhxh = $wpdb->prefix . 'qlbh_bhxh_mo_rong';
$table_lich_su = $wpdb->prefix . 'qlbh_lich_su_dong_tien';
$thong_bao = '';

if (isset($_GET['action']) && $_GET['action'] == 'da_nhan_zalo' && isset($_GET['ls_id'])) { $wpdb->update($table_lich_su, array('trangThaiNhac' => 'Đã nhắn Zalo'), array('id' => intval($_GET['ls_id']))); }

if (isset($_POST['qlbh_cap_nhat_thu_tien'])) {
    $ls_id = intval($_POST['ls_id']); $so_tien = intval($_POST['so_tien_dong_nhanh']); $hinh_thuc = sanitize_text_field($_POST['hinh_thuc_tt']);
    $dong_cu = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_lich_su WHERE id = %d", $ls_id));
    if ($dong_cu) { $wpdb->update($table_lich_su, array('tongTien'=>$so_tien, 'tienHoaHong'=>round(($so_tien*$dong_cu->phanTramHoaHong)/100), 'hinhThucTt'=>$hinh_thuc, 'trangThaiNhac'=>'Chờ kết quả BHXH', 'nguoiThu'=>'Bản thân ('.$hinh_thuc.')', 'ngayDuKienGiaHan'=>sanitize_text_field($_POST['ngay_het_han_moi_nhanh'])), array('id'=>$ls_id)); }
}

// KHÂU DUYỆT BIÊN LAI: Cập nhật hạn dùng dựa theo liên kết khóa mới
if (isset($_POST['qlbh_hoan_thanh_gia_han'])) {
    $ls_id = intval($_POST['ls_id_duyet']); $so_bl = sanitize_text_field($_POST['so_bien_lai']); $ma_tc = sanitize_text_field($_POST['ma_tra_cuu']); $url_anh = '';
    if (!empty($_FILES['file_anh_bien_lai']['name'])) { require_once(ABSPATH . 'wp-admin/includes/file.php'); $uploaded_file = wp_handle_upload($_FILES['file_anh_bien_lai'], array('test_form' => false)); if (isset($uploaded_file['url'])) $url_anh = $uploaded_file['url']; }

    $dong_cu = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_lich_su WHERE id = %d", $ls_id));
    if ($dong_cu) {
        $wpdb->update($table_lich_su, array('soBienLai'=>$so_bl, 'maTraCuu'=>$ma_tc, 'anhBienLai'=>$url_anh, 'trangThaiNhac'=>'Đã gia hạn'), array('id'=>$ls_id));

        // Thực hiện gia hạn chuẩn xác theo trường liên kết ma_so_bhxh mới
        if ($dong_cu->loaiGiaoDich === 'BHYT') {
            $wpdb->update($table_bhyt, array('denNgayDt'=>$dong_cu->ngayDuKienGiaHan), array('id'=>$dong_cu->khachHangId));
        } else {
            // Tìm mã số BHXH từ bảng gốc dựa vào khach_hang_id để gia hạn vào bảng mở rộng
            $ma_bhxh_gia_han = $wpdb->get_var($wpdb->prepare("SELECT maSoBhxh FROM $table_bhyt WHERE id = %d", $dong_cu->khachHangId));
            if (!empty($ma_bhxh_gia_han)) {
                $wpdb->update($table_bhxh, array('ngayHetHanBhxh'=>$dong_cu->ngayDuKienGiaHan), array('maSoBhxh'=>$ma_bhxh_gia_han));
            }
        }
    }
}

if (isset($_POST['qlbh_ghi_thu_v4']) && check_admin_referer('qlbh_form_thu_tien_v4')) {
    $khach_id = intval($_POST['khach_hang_id']); $loai_gd = sanitize_text_field($_POST['loai_giao_dich']); $so_tien = intval($_POST['so_tien_dong']); $phan_tram = floatval($_POST['phan_tram_hoa_hong']); $ngay_gia_han = sanitize_text_field($_POST['ngay_het_han_moi']);
    $wpdb->insert($table_lich_su, array('khachHangId'=>$khach_id, 'loaiGiaoDich'=>$loai_gd, 'ngayLap'=>sanitize_text_field($_POST['ngay_dong']), 'tongTien'=>$so_tien, 'phanTramHoaHong'=>$phan_tram, 'tienHoaHong'=>round(($so_tien*$phan_tram)/100), 'nguoiThu'=>sanitize_text_field($_POST['nguoi_thu']), 'ghiChuDong'=>sanitize_textarea_field($_POST['ghi_chu_dong']), 'trangThaiNhac'=>'Đã gia hạn', 'ngayDuKienGiaHan'=>$ngay_gia_han));
    if ($loai_gd === 'BHYT') { $wpdb->update($table_bhyt, array('denNgayDt' => $ngay_gia_han), array('id' => $khach_id)); }
    else {
        $ma_bhxh_g = $wpdb->get_var($wpdb->prepare("SELECT maSoBhxh FROM $table_bhyt WHERE id = %d", $khach_id));
        if(!empty($ma_bhxh_g)) { $wpdb->update($table_bhxh, array('ngayHetHanBhxh' => $ngay_gia_han), array('maSoBhxh' => $ma_bhxh_g)); }
    }
}

$thang_loc = isset($_GET['thang_loc']) ? sanitize_text_field($_GET['thang_loc']) : date('m'); $nam_loc = isset($_GET['nam_loc']) ? sanitize_text_field($_GET['nam_loc']) : date('Y'); $search_bhxh = isset($_POST['s_bhxh']) ? sanitize_text_field($_POST['s_bhxh']) : ''; $where_clause = $wpdb->prepare("WHERE MONTH(ls.ngayLap) = %d AND YEAR(ls.ngayLap) = %d", $thang_loc, $nam_loc);
if (!empty($search_bhxh)) { $where_clause = $wpdb->prepare("WHERE x.maSoBhxh LIKE %s", '%'.$wpdb->esc_like($search_bhxh).'%'); }
if (isset($_POST['qlbh_xuat_excel'])) { ob_clean(); header('Content-Type: text/csv; charset=utf-8'); header('Content-Disposition: attachment; filename=bao-cao-thu-'.$thang_loc.'.csv'); $output = fopen('php://output', 'w'); fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF)); fputcsv($output, array('Ngày Đóng', 'Tên Khách Hàng', 'Nguồn Thu', 'Số Tiền Thu', 'Tiền Hoa Hồng', 'Người Thu')); $data_excel = $wpdb->get_results("SELECT ls.*, b.hoTen FROM $table_lich_su ls JOIN $table_bhyt b ON ls.khachHangId = b.id $where_clause ORDER BY ls.ngayLap DESC"); foreach ($data_excel as $row) { fputcsv($output, array(date('d/m/Y', strtotime($row->ngayLap)), $row->hoTen, $row->loaiGiaoDich, $row->tongTien, $row->tienHoaHong, $row->nguoiThu)); } fclose($output); exit; }

// THAY ĐỔI: Sử dụng b.ma_so_bhxh = x.ma_so_bhxh để nạp dữ liệu tra cứu lịch sử nhanh
$lich_su = $wpdb->get_results("SELECT ls.*, b.hoTen, b.soDienThoai, b.maSoBhxh FROM $table_lich_su ls JOIN $table_bhyt b ON ls.khachHangId = b.id LEFT JOIN $table_bhxh x ON b.maSoBhxh = x.maSoBhxh $where_clause ORDER BY ls.ngayLap DESC");
$khach_hangs = $wpdb->get_results("SELECT id, hoTen FROM $table_bhyt ORDER BY hoTen ASC");
$tong_doanh_thu = 0; $tong_hoa_hong = 0; foreach ($lich_su as $item) { $tong_doanh_thu += $item->tongTien; $tong_hoa_hong += $item->tienHoaHong; }

include QLBH_PATH . 'views/lich-su.php';
