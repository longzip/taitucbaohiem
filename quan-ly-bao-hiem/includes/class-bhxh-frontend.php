<?php
if (!defined('ABSPATH')) exit;

class QLBH_Frontend {
    public function __construct() {
        add_shortcode('TRA_CUU_BAO_HIEM', array($this, 'hien_thi_o_tra_cuu'));
    }

    public function hien_thi_o_tra_cuu() {
        global $wpdb;
        $t_bhyt = $wpdb->prefix . 'qlbh_bhyt';
        $t_bhxh = $wpdb->prefix . 'qlbh_bhxh_mo_rong';
        $t_lich_su = $wpdb->prefix . 'qlbh_lich_su_dong_tien';

        $ho_ten = isset($_POST['tc_ho_ten']) ? sanitize_text_field(trim($_POST['tc_ho_ten'])) : '';
        $ngay_sinh = isset($_POST['tc_ngay_sinh']) ? sanitize_text_field($_POST['tc_ngay_sinh']) : '';
        $ma_dinh_danh = isset($_POST['tc_ma_dinh_danh']) ? sanitize_text_field(trim($_POST['tc_ma_dinh_danh'])) : '';
        $html = '';

        // Nạp file giao diện form nhập dữ liệu tra cứu ngoài trang chủ
        ob_start();
        include QLBH_PATH . 'views/tra-cuu-form.php';
        $html .= ob_get_clean();

        // Xử lý đối chiếu khớp thông tin
        if (!empty($ho_ten) && !empty($ngay_sinh) && !empty($ma_dinh_danh)) {
            $khach = $wpdb->get_row($wpdb->prepare(
                "SELECT b.*, x.maSoBhxh, x.ngayHetHanBhxh FROM $t_bhyt b
                 LEFT JOIN $t_bhxh x ON b.id = x.khach_hang_id
                 WHERE LOWER(b.hoTen) = LOWER(%s) AND b.ngaySinhDt = %s AND (b.soCmnd = %s OR x.maSoBhxh = %s)",
                $ho_ten, $ngay_sinh, $ma_dinh_danh, $ma_dinh_danh
            ));

            ob_start();
            if ($khach) {
                $hom_nay = current_time('Y-m-d');
                $ls_dong = $wpdb->get_results($wpdb->prepare("SELECT * FROM $t_lich_su WHERE khachHangId = %d AND (trangThaiNhac = 'Đã gia hạn' OR trangThaiNhac = 'Đã thu tiền') ORDER BY ngayLap DESC", $khach->id));
                include QLBH_PATH . 'views/tra-cuu-ket-qua.php';
            } else {
                echo '<div style="color:red; text-align:center; margin-top:15px; font-weight:bold;">❌ Thông tin xác minh không khớp hoặc không tồn tại!</div>';
            }
            $html .= ob_get_clean();
        }
        return $html;
    }
}
new QLBH_Frontend();
