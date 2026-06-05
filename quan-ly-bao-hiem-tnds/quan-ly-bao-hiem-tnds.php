<?php
/**
 * Plugin Name: Quản lý bảo hiểm TNDS
 * Description: Plugin quản lý thông tin bảo hiểm TNDS bắt buộc cho ô tô và xe máy.
 * Version: 1.0.0
 * Author: Tuấn Anh (Phát triển bởi Gemini)
 * License: GPL2
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Define plugin constants
define('QLBH_TNDS_PATH', plugin_dir_path(__FILE__));

// Include database class and register activation hook
require_once QLBH_TNDS_PATH . 'includes/class-tnds-db.php';
register_activation_hook(__FILE__, array('QLBH_TNDS_DB', 'create_tables'));

// Initialize GraphQL extensions
add_action('plugins_loaded', 'qlbh_tnds_init_graphql_extension');

function qlbh_tnds_init_graphql_extension() {
    if (function_exists('register_graphql_mutation')) {
        require_once QLBH_TNDS_PATH . 'includes/class-tnds-graphql.php';
        QLBH_TNDS_GraphQL::register();
    }
}
