<?php
if (!defined('ABSPATH')) exit;

class QLBH_GraphQL_BHYT {
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
        register_graphql_object_type('Bhyt', [
            'description' => __('Đối tượng BHYT', 'qlbh'),
            'fields' => [
                'id' => ['type' => 'ID'],
                'hoTen' => ['type' => 'String'],
                'maSoBhxh' => ['type' => 'String'],
                'soBhyt' => ['type' => 'String'],
                'ngaySinh' => ['type' => 'String'],
                'diaChi' => ['type' => 'String'],
                'soThang' => ['type' => 'Int'],
                'soTien' => ['type' => 'Float'],
                'ngayBatDau' => ['type' => 'String'],
                'ngayHetHan' => ['type' => 'String'],
                'ghiChu' => ['type' => 'String'],
                'maDaiLy' => ['type' => 'String'],
            ]
        ]);

        register_graphql_field('RootQuery', 'danhSachBhyt', [
            'type' => ['list_of' => 'Bhyt'],
            'description' => __('Lấy danh sách người tham gia BHYT.', 'qlbh'),
            'args' => [
                'searchKeyword' => ['type' => 'String'],
            ],
            'resolve' => function($root, $args) {
                if (!$this->can_user_access_qlbh()) {
                    return [];
                }

                global $wpdb;
                $table_name = $wpdb->prefix . 'bhyts';
                
                $query = "SELECT id, hoTen, maSoBhxh, soBhyt, ngaySinhDt as ngaySinh, diaChiLh as diaChi, soThang, soTien, ngayBatDau, ngayHetHan, ghiChu, maDaiLy FROM {$table_name} WHERE 1=1";
                $params = [];

                if (!empty($args['searchKeyword'])) {
                    $keyword = '%' . $wpdb->esc_like($args['searchKeyword']) . '%';
                    $query .= " AND (hoTen LIKE %s OR maSoBhxh LIKE %s OR soBhyt LIKE %s)";
                    $params[] = $keyword;
                    $params[] = $keyword;
                    $params[] = $keyword;
                }

                $results = $wpdb->get_results($wpdb->prepare($query, $params), ARRAY_A);

                return $results ?: [];
            }
        ]);
    }
}
