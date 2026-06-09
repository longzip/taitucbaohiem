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

    /**
 * =========================================================================
 *  CRON JOB HÀNG THÁNG ĐỂ DI CHUYỂN DỮ LIỆU BHXH
 * =========================================================================
 */

    // 1. Thêm một lịch trình cron tùy chỉnh 'hàng tháng'
    function qlbh_add_monthly_cron_schedule($schedules)
    {
    $schedules['monthly'] = [
        'interval' => 2635200, // Số giây trong khoảng 30.5 ngày
        'display'  => esc_html__('Once a month'),
    ];
    return $schedules;
    }
    add_filter('cron_schedules', 'qlbh_add_monthly_cron_schedule');

    // 2. Lên lịch cho sự kiện di chuyển dữ liệu hàng tháng
    function qlbh_schedule_monthly_migration()
    {
    if (! wp_next_scheduled('qlbh_monthly_migration_event')) {
        // Lên lịch để chạy vào 1 giờ sáng ngày đầu tiên của tháng tới
        wp_schedule_event(strtotime('first day of next month 01:00'), 'monthly', 'qlbh_monthly_migration_event');
    }
    }
    add_action('wp', 'qlbh_schedule_monthly_migration');

    // 3. Hàm thực thi việc di chuyển dữ liệu khi sự kiện cron được kích hoạt
    function qlbh_execute_monthly_migration()
    {
    global $wpdb;
    $table_bhyts   = $wpdb->prefix . 'bhyts';
    $table_bhxh    = $wpdb->prefix . 'qlbh_bhxh_mo_rong';
    $table_lich_su = $wpdb->prefix . 'qlbh_lich_su_dong_tien';

    // Lấy ID khách hàng duy nhất có giao dịch 'bhxh'
    $customer_ids = $wpdb->get_col(
        $wpdb->prepare(
            "SELECT DISTINCT khachHangId FROM $table_lich_su WHERE loaiGiaoDich = %s",
            'bhxh'
        )
    );

    foreach ($customer_ids as $customer_id) {
        // Lấy giao dịch 'bhxh' gần đây nhất của khách hàng này
        $giao_dich = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM $table_lich_su WHERE khachHangId = %d AND loaiGiaoDich = %s ORDER BY ngayLap DESC LIMIT 1",
                $customer_id,
                'bhxh'
            )
        );

        if (! $giao_dich) {
            continue;
        }

        // Lấy mã số BHXH từ bảng bhyts
        $ma_so_bhxh = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT maSoBhxh FROM $table_bhyts WHERE id = %d",
                $giao_dich->khachHangId
            )
        );

        if ($ma_so_bhxh) {
            // Kiểm tra xem mã số BHXH này đã tồn tại trong bảng đích chưa
            $exists = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT maSoBhxh FROM $table_bhxh WHERE maSoBhxh = %s",
                    $ma_so_bhxh
                )
            );

            // Nếu chưa tồn tại, hãy chèn nó
            if (! $exists) {
                $wpdb->insert(
                    $table_bhxh,
                    [
                        'maSoBhxh'       => $ma_so_bhxh,
                        'ngayHetHanBhxh' => $giao_dich->ngayDuKienGiaHan,
                        'ghiChuBhxh'     => $giao_dich->ghiChuDong,
                        'ngayDk'         => $giao_dich->ngayLap,
                        'mucTienDong'    => $giao_dich->tongTien,
                        'phuongThucDong' => $giao_dich->hinhThucTt,
                    ],
                    [
                        '%s',
                        '%s',
                        '%s',
                        '%s',
                        '%f',
                        '%s',
                    ]
                );
            }
        }
    }
    }
    add_action('qlbh_monthly_migration_event', 'qlbh_execute_monthly_migration');

    /**
 * =========================================================================
 *  TRANG QUẢN TRỊ ĐỂ CHẠY DI CHUYỂN DỮ LIỆU THỦ CÔNG
 * =========================================================================
 */

    // 1. Thêm mục menu vào trang quản trị
    function qlbh_add_admin_menu()
    {
    add_menu_page(
        'Quản Lý Bảo Hiểm',
        'QL Bảo Hiểm',
        'manage_options', // Capability
        'qlbh-main-menu',
        null, // No content for the main page itself
        'dashicons-shield-alt',
        25// Position
    );

    add_submenu_page(
        'qlbh-main-menu',               // Parent slug
        'Di chuyển dữ liệu BHXH', // Page title
        'Di chuyển BHXH',             // Menu title
        'manage_options',               // Capability
        'qlbh-bhxh-migration',          // Menu slug
        'qlbh_render_migration_page'    // Function to display page content
    );
    }
    add_action('admin_menu', 'qlbh_add_admin_menu');

    // 2. Hàm xử lý khi form được gửi đi
    function qlbh_handle_manual_migration()
    {
    // Kiểm tra xem đây có phải là trang của chúng ta và form đã được gửi đi chưa
    if (isset($_POST['qlbh_run_migration_nonce']) && wp_verify_nonce($_POST['qlbh_run_migration_nonce'], 'qlbh_run_migration_action')) {
        // Chạy hàm di chuyển dữ liệu
        qlbh_execute_monthly_migration();

        // Thêm một thông báo thành công
        add_action('admin_notices', function () {
            echo '<div class="notice notice-success is-dismissible"><p>Tác vụ di chuyển dữ liệu BHXH đã được thực thi thành công.</p></div>';
        });
    }
    }
    add_action('admin_init', 'qlbh_handle_manual_migration');

    // 3. Hàm hiển thị nội dung trang
    function qlbh_render_migration_page()
    {
    ?>
    <div class="wrap">
        <h1>Chạy di chuyển dữ liệu BHXH thủ công</h1>
        <p>
            Nhấp vào nút bên dưới để chạy ngay lập tức tác vụ di chuyển dữ liệu từ bảng lịch sử giao dịch sang bảng BHXH mở rộng.
        </p>
        <p>
            Thao tác này sẽ chỉ xử lý các giao dịch "bhxh" gần đây nhất cho mỗi khách hàng và sẽ không tạo bản ghi trùng lặp nếu khách hàng đã tồn tại trong bảng đích.
        </p>

        <form method="post" action="">
            <?php wp_nonce_field('qlbh_run_migration_action', 'qlbh_run_migration_nonce'); ?>
            <p>
                <?php submit_button('Chạy di chuyển dữ liệu ngay', 'primary', 'run_migration_submit', false); ?>
            </p>
        </form>
    </div>
    <?php
    }
