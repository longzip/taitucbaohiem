<?php
/**
 * Plugin Name: Quản Lý Bảo Hiểm Xã Hội
 * Description: Plugin quản lý dữ liệu đóng BHXH và ghi nhận thanh toán qua WPGraphQL.
 * Version: 1.0.0
 * Author: Gemini
 * License: GPL2
 */

if (!defined('ABSPATH')) {
    exit; // Security
}

// Define path constants
define('QLBHXH_PATH', plugin_dir_path(__FILE__));

// Activate database tables when the plugin is activated
require_once QLBHXH_PATH . 'includes/class-bhxh-db.php';
register_activation_hook(__FILE__, array('QLBHXH_DB', 'create_tables'));

// Initialize GraphQL extension when plugins are loaded
add_action('plugins_loaded', 'qlbhxh_init_graphql_extension');

function qlbhxh_init_graphql_extension() {
    // Check if WPGraphQL is active
    if (function_exists('register_graphql_mutation')) {
        require_once QLBHXH_PATH . 'includes/class-bhxh-graphql.php';
        QLBHXH_GraphQL::register_types_and_fields();
    }
}

// Include and instantiate the import class
if (is_admin()) {
    require_once QLBHXH_PATH . 'includes/class-bhxh-import.php';
    new QLBHXH_Import();
}
?>