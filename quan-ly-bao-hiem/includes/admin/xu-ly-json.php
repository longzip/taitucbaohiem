<?php
if (!current_user_can('manage_options')) wp_die('Chặn truy cập.');
global $wpdb;
$t_bhyt = $wpdb->prefix . 'qlbh_bhyt';
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
            $ma_bhxh = !empty($row['maSoBHXH']) ? sanitize_text_field($row['maSoBHXH']) : '';
            $ten_thu_tuc = !empty($row['tenThuTuc']) ? trim($row['tenThuTuc']) : '';

            // THAY ĐỔI: Đọc tài khoản người nộp hồ sơ từ file JSON
            $nguoi_nop_he_thong = !empty($row['nguoiNop']) ? sanitize_text_field($row['nguoiNop']) : 'Đại lý tổng';

            // 1. ĐỐI SOÁT TRÙNG BIÊN LAI
            if (!empty($so_bl)) {
                $check_bl = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $t_lich_su WHERE soBienLai = %s", $so_bl));
                if ($check_bl > 0) {
                    $count_bo_qua++;
                    continue;
                }
            }

            if (empty($row['hoTen']) || empty($ma_bhxh)) {
                continue;
            }

            // 2. CHUYỂN ĐỔI ĐỊNH DẠNG NGÀY SINH (DD/MM/YYYY -> YYYY-MM-DD)
            $ngay_sinh_chuan = '1900-01-01';
            if (!empty($row['ngaySinh'])) {
                $parts = explode('/', $row['ngaySinh']);
                if (count($parts) == 3) {
                    $ngay_sinh_chuan = $parts[2] . '-' . $parts[1] . '-' . $parts[0];
                }
            }

            // 3. LẤY THEO NGÀY LẬP TRONG FILE JSON
            $ngay_lap_goc = !empty($row['ngayLap']) ? (new DateTime($row['ngayLap']))->format('Y-m-d H:i:s') : current_time('Y-m-d H:i:s');
            $ngay_het_mac_dinh = '1900-01-01';

            // 4. TRA CỨU THEO MÃ SỐ BHXH ĐỂ CẬP NHẬT HOẶC THÊM MỚI DANH BẠ
            $khach_hang_cu = $wpdb->get_row($wpdb->prepare("SELECT id FROM $t_bhyt WHERE maSoBhxh = %s", $ma_bhxh));
            $khach_hang_id = 0;
            $so_tien = !empty($row['tongTien']) ? intval($row['tongTien']) : 0;

            if ($khach_hang_cu) {
                $khach_hang_id = $khach_hang_cu->id;
                $count_cap_nhat++;
            } else {
                $wpdb->insert($t_bhyt, array(
                    'hoTen'            => sanitize_text_field($row['hoTen']),
                    'ngaySinhDt'         => $ngay_sinh_chuan,
                    'soCmnd'           => !empty($row['cmnd']) ? sanitize_text_field($row['cmnd']) : '',
                    'soDienThoai'     => '0',
                    'soTheBhyt'        => '',
                    'maSoBhxh'        => $ma_bhxh,
                    'maToKhaiRieng'        => !empty($row['soHoSo']) ? sanitize_text_field($row['soHoSo']) : '',
                    'diaChiLh'           => !empty($row['tenDonViXuLyTruoc']) ? sanitize_text_field($row['tenDonViXuLyTruoc']) : '',
                    'denNgayDt' => $ngay_het_mac_dinh,
                    'ghiChu'      => 'Nạp tự động từ lịch sử JSON'
                ));
                $khach_hang_id = $wpdb->insert_id;
                $count_them_moi++;
            }

            // 5. XỬ LÝ RIÊNG GÓI BHXH MỞ RỘNG (THỦ TỤC 602)
            if ($ten_thu_tuc == '602') {
                $wpdb->replace($t_bhxh, array(
                    'maSoBhxh'        => $ma_bhxh,
                    'ngayHetHanBhxh' => $ngay_het_mac_dinh,
                    'ghiChuBhxh'      => 'Chờ cập nhật ngày'
                ));
                $wpdb->update($t_bhyt, array('maSoBhxh' => $ma_bhxh), array('id' => $khach_hang_id));
                $count_cap_nhat++;
            }

            // 6. GHI SỔ NHẬT KÝ VÀ TỰ ĐỘNG GÁN NGƯỜI THU THEO TRƯỜNG "NGƯỜI NỘP" HỒ SƠ
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
                'nguoiThu'            => $nguoi_nop_he_thong, // Đồng bộ cột người thu chính là tên tài khoản người nộp
                'soBienLai'          => $so_bl,
                'maTraCuu'           => !empty($row['soHoSo']) ? sanitize_text_field($row['soHoSo']) : '',
                'ngayDuKienGiaHan' => NULL,
                'ghiChuDong'         => 'Nạp tự động thủ tục ' . $ten_thu_tuc . ' - Kỳ: ' . sanitize_text_field($row['ky']),
                'trangThaiNhac'      => 'Chờ kết quả BHXH',
                'hinhThucTt'         => 'Chuyển khoản'
            ));
            $count_lich_su++;
        }

        $thong_bao = '<div class="notice notice-success is-dismissible">';
        $thong_bao .= '<h3>✔️ ĐỒNG BỘ THEO TÀI KHOẢN NGƯỜI NỘP HOÀN TẤT</h3>';
        $thong_bao .= '<ul>';
        $thong_bao .= '<li>🚫 Số biên lai trùng lặp (Bỏ qua): <strong>' . $count_bo_qua . '</strong> hồ sơ.</li>';
        $thong_bao .= '<li>👤 Khách hàng mới thêm vào hệ thống: <strong>' . $count_them_moi . '</strong> người.</li>';
        $thong_bao .= '<li>📈 Giao dịch đã đồng bộ sang ví CTV: <strong>' . $count_lich_su . '</strong> biên lai.</li>';
        $thong_bao .= '</ul>';
        $thong_bao .= '<p style="color:#2b8a3e; font-weight:bold;">* Mẹo quản lý: Hệ thống đã tự động ghi nhận doanh số tháng này cho tài khoản CTV xử lý hồ sơ. Bạn có thể vào mục "Doanh Số CTV" để xem bảng tổng kết thu nhập chiết khấu của từng người.</p></div>';
    } else {
        $thong_bao = '<div class="notice notice-error"><p><strong>Lỗi:</strong> Định dạng file dán vào không tìm thấy từ khóa dữ liệu <code>items</code>.</p></div>';
    }
}

include QLBH_PATH . 'views/nhap-json.php';
