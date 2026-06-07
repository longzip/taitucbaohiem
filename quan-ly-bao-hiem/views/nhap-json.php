<?php
ini_set('memory_limit', '1024M'); // Tăng giới hạn bộ nhớ lên 1024MB

if (!current_user_can('manage_options')) wp_die('Chặn truy cập.');
global $wpdb;
$t_bhyt = $wpdb->prefix . 'bhyts';
$t_bhxh = $wpdb->prefix . 'qlbh_bhxh_mo_rong';
$t_lich_su = $wpdb->prefix . 'qlbh_lich_su_dong_tien';
$thong_bao = '';

if (isset($_POST['qlbh_sub_json']) && check_admin_referer('qlbh_j_nonce')) {
    $json_data = stripcslashes(trim($_POST['json_text']));
    $data_goc = json_decode($json_data, true);

    if (is_array($data_goc) && isset($data_goc['items'])) {
        $rows = $data_goc['items'];
        $count_bo_qua = 0; $count_them_moi = 0; $count_cap_nhat = 0; $count_lich_su = 0;

        foreach ($rows as $row) {
            $so_bl = !empty($row['bienLaiId']) ? sanitize_text_field($row['bienLaiId']) : '';
            $ma_bhxh = !empty($row['maSoBhxh']) ? sanitize_text_field($row['maSoBhxh']) : '';
            $ten_thu_tuc = !empty($row['tenThuTuc']) ? trim($row['tenThuTuc']) : '';

            $json_user_id = !empty($row['userId']) ? intval($row['userId']) : 0;
            $json_nguoi_nop = !empty($row['nguoiNop']) ? sanitize_text_field($row['nguoiNop']) : '';
            $trang_thai_ho_so = isset($row['trangThaiHoSo']) ? intval($row['trangThaiHoSo']) : 0;

            // 1. ĐỐI SOÁT TRÙNG BIÊN LAI
            if (!empty($so_bl)) {
                $check_bl = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $t_lich_su WHERE soBienLai = %s", $so_bl));
                if ($check_bl > 0) { $count_bo_qua++; continue; }
            }

            if (empty($row['hoTen']) || empty($ma_bhxh)) { continue; }

            // LÙNG SỤC TÀI KHOẢN CTV VÀ SỬA LỖI ĐỌC MẢNG ID
            $ten_nhan_vien_thu = $json_nguoi_nop;
            $thong_tin_mo_rong_ctv = '';

            $args = array(
                'meta_query' => array(
                    'relation' => 'OR',
                    array('key' => 'qlbh_userid_bhxh', 'value' => $json_user_id, 'compare' => '='),
                    array('key' => 'qlbh_ma_nhan_vien_thu', 'value' => $json_nguoi_nop, 'compare' => '=')
                ),
                'number' => 1
            );
            $user_query = new WP_User_Query($args);
            $users = $user_query->get_results();

            // SỬA LỖI TẠI ĐÂY: Kiểm tra mảng và lấy phần tử đầu tiên [0]
            if (!empty($users) && is_array($users)) {
                $user_found = $users[0]; // Lấy đúng đối tượng User đầu tiên trong mảng
                $ten_nhan_vien_thu = get_user_meta($user_found->ID, 'qlbh_ma_nhan_vien_thu', true) || $user_found->display_name;

                // Bây giờ ID đã tồn tại và không còn báo lỗi
                $ctv_dai_ly  = get_user_meta($user_found->ID, 'qlbh_dai_ly_thu', true);
                $ctv_ma_xa   = get_user_meta($user_found->ID, 'qlbh_ma_xa_moi', true);
                $ctv_dia_chi = get_user_meta($user_found->ID, 'qlbh_dia_chi_diem_thu', true);

                $thong_tin_mo_rong_ctv = " [Đại lý: " . $ctv_dai_ly . " - Mã xã mới: " . $ctv_ma_xa . " - ĐC: " . $ctv_dia_chi . "]";
            }

            // 2. CHUYỂN ĐỔI ĐỊNH DẠNG NGÀY SINH
            $ngay_sinh_chuan = '1900-01-01';
            if (!empty($row['ngaySinh'])) {
                $parts = explode('/', $row['ngaySinh']);
                if (count($parts) == 3) { $ngay_sinh_chuan = $parts[2] . '-' . $parts[1] . '-' . $parts[0]; }
            }

            // 3. LẤY NGÀY LẬP VÀ PHÂN LOẠI TRẠNG THÁI
            $ngay_lap_goc = !empty($row['ngayLap']) ? substr($row['ngayLap'], 0, 10) : current_time('Y-m-d');
            $ngay_het_han_chuan = '1900-01-01'; // Luôn để trống theo yêu cầu

            if ($trang_thai_ho_so >= 8) {
                $trang_thai_nhac_chuan = 'Đã gia hạn';
            } else {
                $trang_thai_nhac_chuan = 'Đã xuất biên lai';
            }

            // 4. TRA CỨU DANH BẠ GỐC THEO MÃ SỐ BHXH
            $khach_hang_cu = $wpdb->get_row($wpdb->prepare("SELECT id FROM $t_bhyt WHERE maSoBhxh = %s", $ma_bhxh));
            $khach_hang_id = 0;
            $so_tien = !empty($row['tongTien']) ? intval($row['tongTien']) : 0;

            if ($khach_hang_cu) {
                $khach_hang_id = $khach_hang_cu->id;
                $count_cap_nhat++;
            } else {
                $wpdb->insert($t_bhyt, array(
                    'hoTen'            => sanitize_text_field($row['hoTen']),
                    'ngaySinh'         => $ngay_sinh_chuan,
                    'soCmnd'           => !empty($row['cmnd']) ? sanitize_text_field($row['cmnd']) : '',
                    'soDienThoai'     => '0',
                    'soTheBhyt'        => '',
                    'maSoBhxh'        => $ma_bhxh,
                    'maTk'        => !empty($row['soHoSo']) ? sanitize_text_field($row['soHoSo']) : '',
                    'diaBan'           => !empty($row['tenDonViXuLyTruoc']) ? sanitize_text_field($row['tenDonViXuLyTruoc']) : '',
                    'denNgay' => $ngay_het_han_chuan,
                    'ghiChu'      => 'Import tự động từ file JSON'
                ));
                $khach_hang_id = $wpdb->insert_id;
                $count_them_moi++;
            }

            // 5. XỬ LÝ GÓI BHXH MỞ RỘNG (THỦ TỤC 602)
            if ($ten_thu_tuc == '602') {
                $check_bhxh_cu = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $t_bhxh WHERE maSoBhxh = %s", $ma_bhxh));
                if ($check_bhxh_cu == 0) {
                    $wpdb->insert($t_bhxh, array(
                        'maSoBhxh'        => $ma_bhxh,
                        'ngayHetHanBhxh' => $ngay_het_han_chuan,
                        'ghiChuBhxh'      => 'Chờ cập nhật ngày thủ công'
                    ));
                }
                $wpdb->update($t_bhyt, array('maSoBhxh' => $ma_bhxh), array('id' => $khach_hang_id));
                $count_cap_nhat++;
            }

            // 6. GHI SỔ NHẬT KÝ LỊCH SỬ DÒNG TIỀN
            $loai_gd = ($ten_thu_tuc == '602') ? 'BHXH' : 'BHYT';
            $phan_tram = ($loai_gd == 'BHXH') ? 5.0 : 3.5;
            $tien_hoa_hong = round(($so_tien * $phan_tram) / 100);

            $wpdb->insert($t_lich_su, array(
                'khachHangId'        => $khach_hang_id,
                'loaiGiaoDich'       => $loai_gd,
                'ngayLap'            => $ngay_lap_goc,
                'tongTien'         => $so_tien,
                'phanTramHoaHong'   => $phan_tram,
                'tienHoaHong'        => $tien_hoa_hong,
                'nguoiThu'            => $ten_nhan_vien_thu,
                'soBienLai'          => $so_bl,
                'maTraCuu'           => '',
                'ngayDuKienGiaHan' => NULL,
                'ghiChu'         => 'Thủ tục ' . $ten_thu_tuc . ' - Trạng thái gốc: ' . sanitize_text_field($row['trangThaiHoSoName']) . $thong_tin_mo_rong_ctv,
                'trangThai'      => $trang_thai_nhac_chuan,
                'hinhThucThanhToan'         => 'Chuyển khoản'
            ));
            $count_lich_su++;
        }

        $thong_bao = '<div class="notice notice-success is-dismissible">';
        $thong_bao .= '<h3>✔️ ĐỒNG BỘ ĐỐI SOÁT FILE JSON THÀNH CÔNG</h3>';
        $thong_bao .= '<ul>';
        $thong_bao .= '<li>🚫 Số biên lai trùng (Bỏ qua): <strong>' . $count_bo_qua . '</strong> hồ sơ.</li>';
        $thong_bao .= '<li>👤 Người mới thêm vào hệ thống: <strong>' . $count_them_moi . '</strong> người.</li>';
        $thong_bao .= '<li>📈 Biên lai dòng tiền đã xử lý: <strong>' . $count_lich_su . '</strong> giao dịch.</li>';
        $thong_bao .= '</ul></div>';
    } else {
        $thong_bao = '<div class="notice notice-error"><p><strong>Lỗi:</strong> File dữ liệu JSON thiếu mảng mấu chốt <code>items</code>.</p></div>';
    }
}
?>
<div class="wrap">
    <h1>Nhập Dữ Liệu từ File JSON</h1>
    <?php echo $thong_bao; ?>
    <p>Dán nội dung từ file JSON đã xuất vào ô bên dưới:</p>
    <form method="post" action="">
        <textarea name="json_text" rows="20" class="widefat"></textarea>
        <?php wp_nonce_field('qlbh_j_nonce'); ?>
        <p class="submit">
            <input type="submit" name="qlbh_sub_json" class="button button-primary" value="Đồng Bộ & Đối Soát Ngay">
        </p>
    </form>
</div>
