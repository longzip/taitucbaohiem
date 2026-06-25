<?php
if (! defined('ABSPATH')) {
    exit;
}

require_once plugin_dir_path(__FILE__) . 'class-qlbh-graphql-bhxh.php';
require_once plugin_dir_path(__FILE__) . 'class-qlbh-graphql-bhyt.php';
require_once plugin_dir_path(__FILE__) . 'class-qlbh-graphql-collaborators.php';
require_once plugin_dir_path(__FILE__) . 'class-qlbh-graphql-bien-lai.php';
require_once plugin_dir_path(__FILE__) . 'class-qlbh-graphql-sync-bhyt.php';

class QLBH_GraphQL
{
    public function __construct()
    {
        // These actions are now handled by the individual classes
        new QLBH_GraphQL_BHXH();
        new QLBH_GraphQL_BHYT();
        new QLBH_GraphQL_Collaborators();
        new QLBH_GraphQL_Bien_Lai();
        new QLBH_GraphQL_Sync_Customer();
    }
}
