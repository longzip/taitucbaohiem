<?php

if (!defined('ABSPATH')) {
    exit;
}

global $wpdb;
$khach_hang_table = $wpdb->prefix . 'qlbh_khach_hang';
$khach_id = isset($_GET['khach_id']) ? intval($_GET['khach_id']) : 0;

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_kich_hoat_bhxh'])) {
    if (!isset($_POST['qlbh_kich_hoat_nonce']) || !wp_verify_nonce($_POST['qlbh_kich_hoat_nonce'], 'qlbh_kich_hoat_bhxh_' . $khach_id)) {
        wp_die('Security check failed');
    }

    $ma_so_bhxh = sanitize_text_field($_POST['ma_so_bhxh']);
    
    $wpdb->update(
        $khach_hang_table,
        ['maSoBhxh' => $ma_so_bhxh],
        ['id' => $khach_id],
        ['%s'],
        ['%d']
    );

    echo '<div class="notice notice-success is-dismissible"><p>Đã cập nhật mã số BHXH thành công! <a href="' . admin_url('admin.php?page=qlbh_danh_sach') . '">Quay lại danh sách</a></p></div>';
}

// Fetch customer data for display
$khach_hang = $wpdb->get_row($wpdb->prepare("SELECT hoTen, maSoBhxh FROM {$khach_hang_table} WHERE id = %d", $khach_id));

if (!$khach_hang) {
    echo '<div class="wrap"><h1>Lỗi</h1><p>Không tìm thấy khách hàng.</p></div>';
    return;
}
?>
<div class="wrap">
    <h1>Kích hoạt BHXH Tự nguyện</h1>
    <p>Bạn đang thêm mã số BHXH cho khách hàng: <strong><?php echo esc_html($khach_hang->hoTen); ?></strong></p>

    <form method="post" action="">
        <table class="form-table">
            <tbody>
                <tr>
                    <th scope="row"><label for="ma_so_bhxh">Mã Số BHXH</label></th>
                    <td>
                        <input name="ma_so_bhxh" type="text" id="ma_so_bhxh" value="<?php echo esc_attr($khach_hang->maSoBhxh); ?>" class="regular-text" required>
                        <p class="description">Nhập mã số Bảo hiểm xã hội tự nguyện.</p>
                    </td>
                </tr>
            </tbody>
        </table>
        <?php wp_nonce_field('qlbh_kich_hoat_bhxh_' . $khach_id, 'qlbh_kich_hoat_nonce'); ?>
        <p class="submit">
            <input type="submit" name="submit_kich_hoat_bhxh" id="submit_kich_hoat_bhxh" class="button button-primary" value="Lưu Mã Số BHXH">
        </p>
    </form>
</div>
