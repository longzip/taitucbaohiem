<?php
if (!current_user_can('manage_options')) wp_die('Chặn.');
global $wpdb;
$table_bhyt = $wpdb->prefix . 'bhyts';
$table_bhxh = $wpdb->prefix . 'qlbh_bhxh_mo_rong';
$table_lich_su = $wpdb->prefix . 'qlbh_lich_su_dong_tien';
$thong_bao = '';

if (isset($_GET['action']) && $_GET['action'] == 'da_nhan_zalo' && isset($_GET['ls_id'])) { $wpdb->update($table_lich_su, array('trangThaiNhac' => 'Đã nhắn Zalo'), array('id' => intval($_GET['ls_id']))); }

if (isset($_POST['qlbh_cap_nhat_thu_tien'])) {
    $ls_id = intval($_POST['ls_id']); $so_tien = intval($_POST['so_tien_dong_nhanh']); $hinh_thuc = sanitize_text_field($_POST['hinh_thuc_tt']);
    $dong_cu = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_lich_su WHERE id = %d", $ls_id));
    if ($dong_cu) { $wpdb->update($table_lich_su, array('tongTien'=>$so_tien, 'tienHoaHong'=>round(($so_tien*$dong_cu->phanTramHoaHong)/100), 'hinhThucTt'=>$hinh_thuc, 'trangThaiNhac'=>'Chờ kết quả BHXH', 'nguoiThu'=>'Bản thân ('.$hinh_thuc.')', 'ngayDuKienGiaHan'=>sanitize_text_field($_POST['ngay_het_han_moi_nhanh'])), array('id'=>$ls_id)); }
}

if (isset($_POST['qlbh_hoan_thanh_gia_han'])) {
    $ls_id = intval($_POST['ls_id_duyet']); $so_bl = sanitize_text_field($_POST['so_bien_lai']); $ma_tc = sanitize_text_field($_POST['ma_tra_cuu']); $url_anh = '';
    if (!empty($_FILES['file_anh_bien_lai']['name'])) { require_once(ABSPATH . 'wp-admin/includes/file.php'); $uploaded_file = wp_handle_upload($_FILES['file_anh_bien_lai'], array('test_form' => false)); if (isset($uploaded_file['url'])) $url_anh = $uploaded_file['url']; }

    $dong_cu = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_lich_su WHERE id = %d", $ls_id));
    if ($dong_cu) {
        $wpdb->update($table_lich_su, array('soBienLai'=>$so_bl, 'maTraCuu'=>$ma_tc, 'anhBienLai'=>$url_anh, 'trangThaiNhac'=>'Đã gia hạn'), array('id'=>$ls_id));
        if ($dong_cu->loaiGiaoDich === 'BHYT') {
            $wpdb->update($table_bhyt, array('denNgayDt'=>$dong_cu->ngayDuKienGiaHan), array('id'=>$dong_cu->khachHangId));
        } else {
            $ma_bhxh_gia_han = $wpdb->get_var($wpdb->prepare("SELECT maSoBhxh FROM $table_bhyt WHERE id = %d", $dong_cu->khachHangId));
            if (!empty($ma_bhxh_gia_han)) {
                $wpdb->update($table_bhxh, array('ngayHetHanBhxh'=>$dong_cu->ngayDuKienGiaHan), array('maSoBhxh'=>$ma_bhxh_gia_han));
            }
        }
    }
}

// Lấy mã nhân viên thu của người dùng hiện tại
$current_user_id = get_current_user_id();
$ma_nhan_vien_thu = get_user_meta($current_user_id, 'qlbh_ma_nhan_vien_thu', true);

// Mặc định lọc theo tháng hiện tại nếu không có lựa chọn
$thang_loc = isset($_GET['thang_loc']) ? sanitize_text_field($_GET['thang_loc']) : date('m');
$nam_loc = isset($_GET['nam_loc']) ? sanitize_text_field($_GET['nam_loc']) : date('Y');
$search_bhxh = isset($_POST['s_bhxh']) ? sanitize_text_field($_POST['s_bhxh']) : '';

$base_sql = "SELECT ls.*, b.hoTen, b.soDienThoai, b.maSoBhxh FROM {$table_lich_su} ls LEFT JOIN {$table_bhyt} b ON ls.khachHangId = b.id";
$where_clauses = array();
$params = array();

// Thêm điều kiện lọc theo mã nhân viên thu nếu có
if (!empty($ma_nhan_vien_thu)) {
    $where_clauses[] = "ls.nguoiThu = %s";
    $params[] = $ma_nhan_vien_thu;
}

// Bỏ qua điều kiện lọc tháng nếu chọn "Cả năm"
if (!empty($thang_loc)) {
    $where_clauses[] = "MONTH(ls.ngayLap) = %d";
    $params[] = $thang_loc;
}

$where_clauses[] = "YEAR(ls.ngayLap) = %d";
$params[] = $nam_loc;

if (!empty($search_bhxh)) {
    $where_clauses[] = "b.maSoBhxh LIKE %s";
    $params[] = '%' . $wpdb->esc_like($search_bhxh) . '%';
}

$sql = $base_sql . " WHERE " . implode(" AND ", $where_clauses) . " ORDER BY ls.ngayLap DESC";
$lich_su = $wpdb->get_results($wpdb->prepare($sql, $params));

$khach_hangs = $wpdb->get_results("SELECT id, hoTen FROM $table_bhyt ORDER BY hoTen ASC");
$tong_doanh_thu = 0; $tong_hoa_hong = 0;
foreach ($lich_su as $item) {
    $tong_doanh_thu += $item->tongTien;
    $tong_hoa_hong += $item->tienHoaHong;
}

include QLBH_PATH . 'views/lich-su.php';
