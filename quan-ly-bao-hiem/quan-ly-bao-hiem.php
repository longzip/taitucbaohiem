<?php
/*
Plugin Name: Quản Lý Bảo Hiểm Toàn Diện Pro
Description: Hệ thống tối ưu quản lý 3.000 khách hàng BHYT gốc & BHXH tự nguyện mở rộng. Cấu trúc chia nhỏ file thủ công.
Version: 5.5
Author: Cộng tác viên Bảo Hiểm
*/

if (!defined('ABSPATH')) exit;

define('QLBH_PATH', plugin_dir_path(__FILE__));

// Gọi 3 file xử lý logic lõi
require_once QLBH_PATH . 'includes/class-bhxh-db.php';
require_once QLBH_PATH . 'includes/class-bhxh-admin.php';
require_once QLBH_PATH . 'includes/class-bhxh-frontend.php';
// Chèn thêm dòng này vào file quan-ly-bao-hiem.php để kích hoạt tính năng
require_once QLBH_PATH . 'includes/class-bhxh-user.php';
require_once QLBH_PATH . 'includes/class-qlbh-graphql.php';


// Kích hoạt cơ sở dữ liệu khi bật plugin
register_activation_hook(__FILE__, array('QLBH_DB', 'tao_cac_bang_he_thong'));

// Khởi tạo GraphQL
add_action('init', function() {
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
function qlbh_on_activate_add_roles() {
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
function qlbh_on_deactivate_remove_roles() {
  // Xóa vai trò "Đại lý thu" nếu nó tồn tại
  if ( get_role('dai_ly_thu') ) {
      remove_role('dai_ly_thu');
  }
  // Xóa vai trò "Cộng tác viên" nếu nó tồn tại
  if ( get_role('cong_tac_vien') ) {
      remove_role('cong_tac_vien');
  }
}

// Đăng ký các hàm trên với WordPress hooks
// Chạy hàm 'qlbh_on_activate_add_roles' khi plugin được kích hoạt
register_activation_hook( __FILE__, 'qlbh_on_activate_add_roles' );

// Chạy hàm 'qlbh_on_deactivate_remove_roles' khi plugin bị vô hiệu hóa
register_deactivation_hook( __FILE__, 'qlbh_on_deactivate_remove_roles' );
