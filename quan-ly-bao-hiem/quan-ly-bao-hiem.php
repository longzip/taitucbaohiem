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
