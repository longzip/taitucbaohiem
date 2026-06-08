<?php
if (!defined('ABSPATH')) exit;

class QLBH_GraphQL_Collaborators {

    public function __construct() {
        add_action('graphql_register_types', [$this, 'register_types_and_queries']);
    }

    private function can_user_access_qlbh() {
        $current_user = wp_get_current_user();
        if (!$current_user || $current_user->ID === 0) return false;
        $allowed_roles = ['dai_ly_thu', 'cong_tac_vien', 'editor', 'administrator'];
        return !empty(array_intersect((array) $current_user->roles, $allowed_roles));
    }

    public function register_types_and_queries() {
        register_graphql_object_type('CongTacVien', [
            'description' => __('Đối tượng cộng tác viên', 'qlbh'),
            'fields' => [
                'id' => ['type' => 'ID'],
                'name' => ['type' => 'String'],
                'phone' => ['type' => 'String'],
                'birth_date' => ['type' => 'String'],
                'address' => ['type' => 'String'],
                'status' => ['type' => 'String'],
            ]
        ]);

        register_graphql_field('RootQuery', 'danhSachCtv', [
            'type' => ['list_of' => 'CongTacVien'],
            'description' => __('Lấy danh sách cộng tác viên.', 'qlbh'),
            'args' => [
                'searchKeyword' => ['type' => 'String'],
            ],
            'resolve' => function($root, $args) {
                if (!$this->can_user_access_qlbh()) {
                   return [];
                }

                global $wpdb;
                $table_name = $wpdb->prefix . 'collaborators';
                
                $query = "SELECT id, name, phone, birth_date, address, status FROM {$table_name} WHERE 1=1";
                $params = [];

                if (!empty($args['searchKeyword'])) {
                    $keyword = '%' . $wpdb->esc_like($args['searchKeyword']) . '%';
                    $query .= " AND (name LIKE %s OR phone LIKE %s)";
                    $params[] = $keyword;
                    $params[] = akeyword;
                }

                $results = $wpdb->get_results($wpdb->prepare($query, $params), ARRAY_A);
                return $results ?: [];
            }
        ]);
    }
}
