<?php
/**
 * Plugin Name: Quản Lý Bảo Hiểm - Tiện Ích Mở Rộng MIC 169k
 * Description: Phân hệ mở rộng độc lập quản lý Giấy chứng nhận bảo hiểm con người thương mại MIC 169k qua WPGraphQL.
 * Version: 1.0.0
 * Author: Tuấn Anh
 * License: GPL2
 */

if (!defined('ABSPATH')) {
    exit; // Bảo mật
}

// Định nghĩa các hằng số đường dẫn
define('QLBH_MIC_PATH', plugin_dir_path(__FILE__));

// Kích hoạt CSDL khi Plugin được bấm "Activate"
require_once QLBH_MIC_PATH . 'includes/class-mic-db.php';
register_activation_hook(__FILE__, array('QLBH_MIC_DB', 'create_tables'));

// Kích hoạt mở rộng GraphQL khi hệ thống load xong các plugin
add_action('plugins_loaded', 'qlbh_mic_init_graphql_extension');

function qlbh_mic_init_graphql_extension() {
    // Kiểm tra xem WPGraphQL có đang bật không, nếu có mới chạy
    if (function_exists('register_graphql_mutation')) {
        require_once QLBH_MIC_PATH . 'includes/class-mic-graphql.php';
        QLBH_MIC_GraphQL::register_fields();
    }
}
