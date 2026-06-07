<?php
if (!defined('ABSPATH')) exit;

class QLBH_User {
    public function __construct() {
        // Hiển thị các ô cấu hình trong trang cá nhân của Thành viên
        add_action('show_user_profile', array($this, 'hien_thi_o_cau_hinh_bhxh_full'));
        add_action('edit_user_profile', array($this, 'hien_thi_o_cau_hinh_bhxh_full'));

        // Lệnh lưu dữ liệu vào hệ thống khi bấm nút Cập nhật
        add_action('personal_options_update', array($this, 'luu_cau_hinh_bhxh_full'));
        add_action('edit_user_profile_update', array($this, 'luu_cau_hinh_bhxh_full'));
    }

    // 1. GIAO DIỆN HIỂN THỊ ĐẦY ĐỦ CÁC Ô CẤU HÌNH TRONG ADMIN USER
    public function hien_thi_o_cau_hinh_bhxh_full($user) {
        // Lấy toàn bộ dữ liệu cũ từ cơ sở dữ liệu WordPress
        $ma_nv         = get_user_meta($user->ID, 'qlbh_ma_nhan_vien_thu', true);
        $user_id_bhxh  = get_user_meta($user->ID, 'qlbh_userid_bhxh', true);
        $ma_xa         = get_user_meta($user->ID, 'qlbh_ma_xa_quan_ly', true);
        $ma_xa_moi     = get_user_meta($user->ID, 'qlbh_ma_xa_moi', true);
        $cccd_user     = get_user_meta($user->ID, 'qlbh_cccd_user', true);
        $sdt_user      = get_user_meta($user->ID, 'qlbh_sdt_user', true);
        $dai_ly_thu    = get_user_meta($user->ID, 'qlbh_dai_ly_thu', true);
        $dia_chi_dt    = get_user_meta($user->ID, 'qlbh_dia_chi_diem_thu', true); // Cột mới thêm
        ?>
        <h2>Cấu hình Hệ thống Đại lý / Nhân viên thu BHXH (Bản Đầy Đủ)</h2>
        <table class="form-table">
            <tr>
                <th><label for="qlbh_cccd_user">Số CCCD nhân viên</label></th>
                <td><input type="text" name="qlbh_cccd_user" id="qlbh_cccd_user" value="<?php echo esc_attr($cccd_user); ?>" class="regular-text" placeholder="Gồm 12 số" /></td>
            </tr>
            <tr>
                <th><label for="qlbh_sdt_user">Số điện thoại liên hệ</label></th>
                <td><input type="text" name="qlbh_sdt_user" id="qlbh_sdt_user" value="<?php echo esc_attr($sdt_user); ?>" class="regular-text" placeholder="Ví dụ: 0912345678" /></td>
            </tr>
            <tr>
                <th><label for="qlbh_dai_ly_thu">Tên đại lý thu bảo hiểm</label></th>
                <td><input type="text" name="qlbh_dai_ly_thu" id="qlbh_dai_ly_thu" value="<?php echo esc_attr($dai_ly_thu); ?>" class="regular-text" placeholder="Ví dụ: Bưu điện Việt Nam, Viettel..." /></td>
            </tr>
            <tr>
                <th><label for="qlbh_dia_chi_diem_thu">Địa chỉ điểm thu</label></th>
                <td>
                    <input type="text" name="qlbh_dia_chi_diem_thu" id="qlbh_dia_chi_diem_thu" value="<?php echo esc_attr($dia_chi_dt); ?>" class="regular-text" placeholder="Ví dụ: Số 12 Hùng Vương, Xã A, Huyện B" />
                    <p class="description">Địa chỉ vật lý của văn phòng hoặc điểm giao dịch thu hộ bảo hiểm.</p>
                </td>
            </tr>
            <tr>
                <th><label for="qlbh_ma_nhan_vien_thu">Mã nhân viên thu (Username nộp)</label></th>
                <td>
                    <input type="text" name="qlbh_ma_nhan_vien_thu" id="qlbh_ma_nhan_vien_thu" value="<?php echo esc_attr($ma_nv); ?>" class="regular-text" placeholder="Ví dụ: 142010_truongbc" />
                    <p class="description">Tên tài khoản đẩy hồ sơ (trường <code>nguoiNop</code> trong file JSON).</p>
                </td>
            </tr>
            <tr>
                <th><label for="qlbh_userid_bhxh">Số ID nhân viên (userId)</label></th>
                <td>
                    <input type="number" name="qlbh_userid_bhxh" id="qlbh_userid_bhxh" value="<?php echo esc_attr($user_id_bhxh); ?>" class="regular-text" placeholder="Ví dụ: 3154" />
                    <p class="description">Số ID định danh nhân viên trên cổng BHXH (trường <code>userId</code> trong file JSON).</p>
                </td>
            </tr>
            <tr>
                <th><label for="qlbh_ma_xa_quan_ly">Mã Xã / Phường cũ</label></th>
                <td><input type="text" name="qlbh_ma_xa_quan_ly" id="qlbh_ma_xa_quan_ly" value="<?php echo esc_attr($ma_xa); ?>" class="regular-text" /></td>
            </tr>
            <tr>
                <th><label for="qlbh_ma_xa_moi">Mã Xã / Phường mới</label></th>
                <td><input type="text" name="qlbh_ma_xa_moi" id="qlbh_ma_xa_moi" value="<?php echo esc_attr($ma_xa_moi); ?>" class="regular-text" placeholder="Nhập mã định danh xã mới cập nhật" /></td>
            </tr>
        </table>
        <?php
    }

    // 2. LOGIC LƯU TRỮ DỮ LIỆU VÀO DATABASE WORDPRESS
    public function luu_cau_hinh_bhxh_full($user_id) {
        if (!current_user_can('edit_user', $user_id)) {
            return false;
        }
        update_user_meta($user_id, 'qlbh_ma_nhan_vien_thu', sanitize_text_field($_POST['qlbh_ma_nhan_vien_thu']));
        update_user_meta($user_id, 'qlbh_userid_bhxh', sanitize_text_field($_POST['qlbh_userid_bhxh']));
        update_user_meta($user_id, 'qlbh_ma_xa_quan_ly', sanitize_text_field($_POST['qlbh_ma_xa_quan_ly']));
        update_user_meta($user_id, 'qlbh_ma_xa_moi', sanitize_text_field($_POST['qlbh_ma_xa_moi']));
        update_user_meta($user_id, 'qlbh_cccd_user', sanitize_text_field($_POST['qlbh_cccd_user']));
        update_user_meta($user_id, 'qlbh_sdt_user', sanitize_text_field($_POST['qlbh_sdt_user']));
        update_user_meta($user_id, 'qlbh_dai_ly_thu', sanitize_text_field($_POST['qlbh_dai_ly_thu']));
        update_user_meta($user_id, 'qlbh_dia_chi_diem_thu', sanitize_text_field($_POST['qlbh_dia_chi_diem_thu'])); // Lưu địa chỉ điểm thu
    }
}
new QLBH_User();
