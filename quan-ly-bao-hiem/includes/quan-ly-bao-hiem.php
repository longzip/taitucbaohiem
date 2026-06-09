<?php
/*
Plugin Name: Quản Lý Bảo Hiểm Toàn Diện Pro
Description: Hệ thống tối ưu quản lý 3.000 khách hàng BHYT gốc & BHXH tự nguyện mở rộng. Cấu trúc chia nhỏ file thủ công.
Version: 5.5
Author: Cộng tác viên Bảo Hiểm
*/

if (! defined('ABSPATH')) {
    exit;
}

define('QLBH_PATH', plugin_dir_path(__FILE__));

// Gọi 3 file xử lý logic lõi
require_once QLBH_PATH . 'includes/class-bhxh-db.php';
require_once QLBH_PATH . 'includes/class-bhxh-admin.php';
require_once QLBH_PATH . 'includes/class-bhxh-frontend.php';
// Chèn thêm dòng này vào file quan-ly-bao-hiem.php để kích hoạt tính năng
require_once QLBH_PATH . 'includes/class-bhxh-user.php';
require_once QLBH_PATH . 'includes/class-qlbh-graphql.php';

// Kích hoạt cơ sở dữ liệu khi bật plugin
register_activation_hook(__FILE__, ['QLBH_DB', 'tao_cac_bang_he_thong']);

// Khởi tạo GraphQL
add_action('init', function () {
    if (class_exists('QLBH_GraphQL')) {
        new QLBH_GraphQL();
    }
});

/**
 * =========================================================================
 *  QUẢN LÝ VAI TRÒ NGƯỜI DÙNG KHI KÍCH HOẠT/VÔ HIỆU HÓA PLUGIN
 * =========================================================================
 */

/**
 * Hàm được gọi khi plugin được kích hoạt.
 *
 * Chịu trách nhiệm tạo ra các vai trò tùy chỉnh cần thiết cho plugin.
 */
function qlbh_on_activate_add_roles()
{
    // Lấy quyền hạn cơ bản của vai trò "Subscriber" để làm mẫu
    // Họ chỉ có quyền 'read' - rất an toàn để bắt đầu.
    $subscriber_caps = get_role('subscriber')->capabilities;

    // Thêm vai trò "Đại lý thu"
    // ID: dai_ly_thu
    add_role(
        'dai_ly_thu',
        'Đại lý thu',
        $subscriber_caps
    );

    // Thêm vai trò "Cộng tác viên"
    // ID: cong_tac_vien
    add_role(
        'cong_tac_vien',
        'Cộng tác viên (QLBH)',
        $subscriber_caps
    );
}

/**
 * Hàm được gọi khi plugin bị vô hiệu hóa.
 *
 * Chịu trách nhiệm xóa các vai trò đã tạo để dọn dẹp hệ thống.
 */
function qlbh_on_deactivate_remove_roles()
{
    // Xóa vai trò "Đại lý thu" nếu nó tồn tại
    if (get_role('dai_ly_thu')) {
        remove_role('dai_ly_thu');
    }
    // Xóa vai trò "Cộng tác viên" nếu nó tồn tại
    if (get_role('cong_tac_vien')) {
        remove_role('cong_tac_vien');
    }
}

// Đăng ký các hàm trên với WordPress hooks
// Chạy hàm 'qlbh_on_activate_add_roles' khi plugin được kích hoạt
register_activation_hook(__FILE__, 'qlbh_on_activate_add_roles');

// Chạy hàm 'qlbh_on_deactivate_remove_roles' khi plugin bị vô hiệu hóa
register_deactivation_hook(__FILE__, 'qlbh_on_deactivate_remove_roles');

function custom_jwt_expiration($expiration)
{
    return 604800; // 1 week in seconds (7 days x 24 hours x 60 minutes x 60 seconds)
}
add_filter('graphql_jwt_auth_expire', 'custom_jwt_expiration', 10, 1);

/**
 * Lên lịch chạy WP-Cron hàng ngày để cập nhật trạng thái thẻ BHYT
 */
add_action('wp', 'bhyts_register_daily_cron');
function bhyts_register_daily_cron()
{
    if (! wp_next_scheduled('bhyts_update_status_event')) {
        wp_schedule_event(time(), 'daily', 'bhyts_update_status_event');
    }
}

add_action('bhyts_update_status_event', 'bhyts_execute_update_status');
function bhyts_execute_update_status()
{
    global $wpdb;

    $table_name = $wpdb->prefix . 'bhyts';

    if ($wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table_name)) !== $table_name) {
        return;
    }

    // Các trạng thái nhập tay hoặc đã xử lý xong thì bỏ qua
    $ignored_statuses = ['Bị trùng thẻ', 'Ngừng tham gia', 'Đã gia hạn thành công', 'Đang nộp hồ sơ gia hạn'];
    $not_in_clause    = "'" . implode("','", array_map('esc_sql', $ignored_statuses)) . "'";

    // Chuỗi điều kiện loại trừ ngày cuối cùng của năm (31/12)
    $exclude_year_end_clause = "NOT (MONTH(ngay_het_han) = 12 AND DAY(ngay_het_han) = 31)";

    /**
     * TRẠNG THÁI 1: CẦN GIA HẠN (Được phép gia hạn)
     */
    $wpdb->query("
        UPDATE $table_name
        SET trang_thai = 'Cần gia hạn'
        WHERE EXTRACT(YEAR_MONTH FROM CURRENT_DATE()) >= EXTRACT(YEAR_MONTH FROM DATE_SUB(DATE_ADD(ngay_het_han, INTERVAL 1 DAY), INTERVAL 1 MONTH))
        AND CURRENT_DATE() <= ngay_het_han
        AND trang_thai NOT IN ($not_in_clause)
        AND $exclude_year_end_clause
    ");

    /**
     * TRẠNG THÁI 2: CÒN HẠN (Chưa được phép gia hạn)
     */
    $wpdb->query("
        UPDATE $table_name
        SET trang_thai = 'Còn hạn'
        WHERE EXTRACT(YEAR_MONTH FROM CURRENT_DATE()) < EXTRACT(YEAR_MONTH FROM DATE_SUB(DATE_ADD(ngay_het_han, INTERVAL 1 DAY), INTERVAL 1 MONTH))
        AND trang_thai NOT IN ($not_in_clause)
        AND $exclude_year_end_clause
    ");

    /**
     * TRẠNG THÁI 3: ĐÃ HẾT HẠN (Trong hạn 3 tháng lịch tính từ ngày hết hiệu lực)
     */
    $wpdb->query("
        UPDATE $table_name
        SET trang_thai = 'Đã hết hạn'
        WHERE CURRENT_DATE() > ngay_het_han
        AND CURRENT_DATE() <= DATE_ADD(ngay_het_han, INTERVAL 3 MONTH)
        AND trang_thai NOT IN ($not_in_clause)
        AND $exclude_year_end_clause
    ");

    /**
     * TRẠNG THÁI 4: ĐÃ QUÁ HẠN (Quá hạn trên 3 tháng lịch)
     */
    $wpdb->query("
        UPDATE $table_name
        SET trang_thai = 'Đã quá hạn'
        WHERE CURRENT_DATE() > DATE_ADD(ngay_het_han, INTERVAL 3 MONTH)
        AND trang_thai NOT IN ($not_in_clause)
        AND $exclude_year_end_clause
    ");
}
