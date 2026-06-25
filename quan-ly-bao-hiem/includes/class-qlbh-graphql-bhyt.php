<?php
if (! defined('ABSPATH')) {
    exit;
}

class QLBH_GraphQL_BHYT
{
    public function __construct()
    {
        add_action('graphql_register_types', [$this, 'register_types_and_queries']);
    }

    public function register_types_and_queries()
    {
        register_graphql_object_type('Bhyt', [
            'description' => __('Đối tượng BHYT', 'qlbh'),
            'fields'      => [
                'id'                => ['type' => 'ID'],
                'userId'            => ['type' => 'Int'],
                'maSoBhxh'          => ['type' => 'String'],
                'hoTen'             => ['type' => 'String'],
                'ngaySinhDt'        => ['type' => 'String'],
                'gioiTinh'          => ['type' => 'Int'],
                'soCmnd'            => ['type' => 'String'],
                'maHoGd'            => ['type' => 'String'],
                'soDienThoai'       => ['type' => 'String'],
                'soDienThoai2'      => ['type' => 'String'],
                'email'             => ['type' => 'String'],
                'facebook'          => ['type' => 'String'],
                'diaChiLh'          => ['type' => 'String'],
                'ghiChu'            => ['type' => 'String'],
                'starRating'        => ['type' => 'Int'],
                'trangThaiTaiTuc'   => ['type' => 'String'],
                'soTheBhyt'         => ['type' => 'String'],
                'tuNgayDt'          => ['type' => 'String'],
                'denNgayDt'         => ['type' => 'String'],
                'ngay5Nam'          => ['type' => 'String'],
                'maKCB'             => ['type' => 'String'],
                'tenDvi'            => ['type' => 'String'],
                'maToKhaiRieng'     => ['type' => 'String'],
                'tongTien'          => ['type' => 'Float'],
                'ngayLap'           => ['type' => 'String'],
                'maBienLai'         => ['type' => 'String'],
                'maTraCuu'          => ['type' => 'String'],
                'soThang'           => ['type' => 'Int'],
                'nguoiThuMay'       => ['type' => 'String'],
                'userName'          => ['type' => 'String'],
                'completed'         => ['type' => 'Boolean'],
                'thuTruoc'          => ['type' => 'Boolean'],
                'ngayThuTruoc'      => ['type' => 'String'],
                'soTienThuTruoc'    => ['type' => 'Float'],
                'nhanVienThu'       => ['type' => 'String'],
                'ngayTraCuu'        => ['type' => 'String'],
                'createdAt'         => ['type' => 'String'],
                'updatedAt'         => ['type' => 'String'],
                'coTheUuTienCaoHon' => ['type' => 'Boolean'],
                'disabled'          => ['type' => 'Boolean'],
            ],
        ]);

        register_graphql_object_type('BhytStats', [
            'description' => __('Thống kê BHYT', 'qlbh'),
            'fields'      => [
                'total'   => ['type' => 'Int'],
                'active'  => ['type' => 'Int'],
                'expired' => ['type' => 'Int'],
            ],
        ]);

        register_graphql_field('RootQuery', 'bhyts', [
            'type'    => ['list_of' => 'Bhyt'],
            'args'    => ['name' => ['type' => 'String'], 'userName' => ['type' => 'String'], 'trangThai' => ['type' => 'String']],
            'resolve' => function ($root, $args) {
                global $wpdb;
                $table_name = $wpdb->prefix . 'bhyts';
                $query      = "SELECT * FROM {$table_name} WHERE 1=1";
                $params     = [];

                if (! empty($args['name'])) {
                    $name_search  = '%' . $wpdb->esc_like($args['name']) . '%';
                    $query       .= " AND (hoTen LIKE %s OR maSoBhxh LIKE %s OR soTheBhyt LIKE %s)";
                    array_push($params, $name_search, $name_search, $name_search);
                }

                if (! empty($args['userName'])) {
                    $query    .= " AND userName = %s";
                    $params[]  = $args['userName'];
                }

                if (! empty($args['trangThai'])) {
                    $query    .= " AND trangThaiTaiTuc = %s";
                    $params[]  = $args['trangThai'];
                }

                $query .= " ORDER BY updatedAt DESC LIMIT 50";
                return $wpdb->get_results($wpdb->prepare($query, $params), ARRAY_A) ?: [];
            },
        ]);

        register_graphql_field('RootQuery', 'bhytStats', [
            'type'    => 'BhytStats',
            'args'    => ['userName' => ['type' => 'String']],
            'resolve' => function ($root, $args) {
                global $wpdb;
                $table_name   = $wpdb->prefix . 'bhyts';
                $params       = [];
                $where_clause = 'WHERE 1=1';

                if (! empty($args['userName'])) {
                    $where_clause .= " AND userName = %s";
                    $params[]      = $args['userName'];
                }

                $total   = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table_name} {$where_clause}", $params));
                $active  = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table_name} {$where_clause} AND denNgayDt >= CURDATE()", $params));
                $expired = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table_name} {$where_clause} AND denNgayDt < CURDATE()", $params));

                return [
                    'total'   => (int) $total,
                    'active'  => (int) $active,
                    'expired' => (int) $expired,
                ];
            }
        ]);
    }
}
