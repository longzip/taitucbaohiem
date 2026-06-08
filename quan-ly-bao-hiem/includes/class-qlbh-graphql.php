<?php
if (!defined('ABSPATH')) exit;

class QLBH_GraphQL {

    public function __construct() {
        add_action('graphql_register_types', [$this, 'register_graphql_types']);
        add_action('graphql_register_types', [$this, 'register_bhyt_query']);
        add_action('graphql_register_types', [$this, 'register_bhyt_mutations']);
        add_action('graphql_register_types', [$this, 'register_collaborators_query']);
        add_action('graphql_register_types', [$this, 'register_bhyt_stats_query']);
    }

    private function can_user_access_qlbh() {
        $current_user = wp_get_current_user();
        if (!$current_user || $current_user->ID === 0) return false;
        $allowed_roles = ['dai_ly_thu', 'cong_tac_vien', 'editor', 'administrator'];
        return !empty(array_intersect((array) $current_user->roles, $allowed_roles));
    }

    public function register_collaborators_query() {
        register_graphql_object_type('Collaborator', [
            'description' => __('Một người dùng có vai trò trong hệ thống', 'qlbh'),
            'fields' => [
                'label'         => ['type' => 'String'],
                'value'         => ['type' => 'String'],
                'maNhanVienThu' => ['type' => 'String'],
                'userIdBhxh'    => ['type' => 'String'],
                'vaiTro'        => ['type' => 'String'],
            ]
        ]);

        register_graphql_field('RootQuery', 'collaborators', [
            'type' => ['list_of' => 'Collaborator'],
            'description' => __('Lấy danh sách người dùng có vai trò đại lý, ctv, editor, admin.', 'qlbh'),
            'resolve' => function() {
                if (!$this->can_user_access_qlbh()) {
                   return [];
                }

                $users = get_users(['role__in' => ['dai_ly_thu', 'cong_tac_vien', 'editor', 'administrator'], 'orderby' => 'display_name']);
                if (empty($users)) return [];

                $collaborators = array_map(function($user) {
                    $maNhanVienThu = get_user_meta($user->ID, 'qlbh_ma_nhan_vien_thu', true);
                    $userIdBhxh = get_user_meta($user->ID, 'qlbh_userid_bhxh', true);
                    $label = !empty($maNhanVienThu) ? $maNhanVienThu : $user->display_name;
                    $value = !empty($userIdBhxh) ? $userIdBhxh : $user->user_login;

                    $vaiTro = !empty($user->roles[0]) ? $user->roles[0] : '';

                    return [
                        'label'         => $label,
                        'value'         => $value,
                        'maNhanVienThu' => $maNhanVienThu ?: '',
                        'userIdBhxh'    => $userIdBhxh ?: '',
                        'vaiTro'        => $vaiTro,
                    ];
                }, $users);

                $filtered = array_filter($collaborators, function($c) {
                    return !empty($c['label']) && !empty($c['value']);
                });

                return array_values($filtered);
            }
        ]);
    }

    public function register_graphql_types() {
        register_graphql_object_type('Bhyt', [
            'description' => __('Đối tượng BHYT', 'qlbh'),
            'fields' => [
                'id' => ['type' => 'ID'],
                'maSoBhxh' => ['type' => 'String'],
                'hoTen' => ['type' => 'String'],
                'ngaySinhDt' => ['type' => 'String'],
                'gioiTinh' => ['type' => 'Int'],
                'soCmnd' => ['type' => 'String'],
                'maHoGd' => ['type' => 'String'],
                'soDienThoai' => ['type' => 'String'],
                'soDienThoai2' => ['type' => 'String'],
                'email' => ['type' => 'String'],
                'facebook' => ['type' => 'String'],
                'diaChiLh' => ['type' => 'String'],
                'ghiChu' => ['type' => 'String'],
                'starRating' => ['type' => 'Int'],
                'trangThaiTaiTuc' => ['type' => 'String'],
                'soTheBhyt' => ['type' => 'String'],
                'tuNgayDt' => ['type' => 'String'],
                'denNgayDt' => ['type' => 'String'],
                'ngay5Nam' => ['type' => 'String'],
                'maKCB' => ['type' => 'String'],
                'tenDvi' => ['type' => 'String'],
                'maToKhaiRieng' => ['type' => 'String'],
                'tongTien' => ['type' => 'Float'],
                'ngayLap' => ['type' => 'String'],
                'maBienLai' => ['type' => 'String'],
                'maTraCuu' => ['type' => 'String'],
                'soThang' => ['type' => 'Int'],
                'nguoiThuMay' => ['type' => 'String'],
                'userName' => ['type' => 'String'],
                'completed' => ['type' => 'Boolean'],
                'thuTruoc' => ['type' => 'Boolean'],
                'ngayThuTruoc' => ['type' => 'String'],
                'soTienThuTruoc' => ['type' => 'Float'],
                'nhanVienThu' => ['type' => 'String'],
                'ngayTraCuu' => ['type' => 'String'],
                'createdAt' => ['type' => 'String'],
                'updatedAt' => ['type' => 'String'],
                // Fields for backwards compatibility
                'coTheUuTienCaoHon' => ['type' => 'Boolean'],
                'disabled' => ['type' => 'Boolean'],
                'updated_at' => ['type' => 'String'],
            ],
        ]);

        register_graphql_object_type('BhytStats', [
            'description' => __('Thống kê BHYT', 'qlbh'),
            'fields' => [
                'total' => ['type' => 'Int'],
                'active' => ['type' => 'Int'],
                'expired' => ['type' => 'Int'],
            ],
        ]);
    }

    public function register_bhyt_query() {
        register_graphql_field('RootQuery', 'bhyts', [
            'type' => ['list_of' => 'Bhyt'],
            'args' => [ 'name' => ['type' => 'String'], 'userName' => ['type' => 'String'], 'trangThai' => ['type' => 'String'], ],
            'resolve' => function ($root, $args) {
                if (!$this->can_user_access_qlbh()) {
                    return [];
                }

                global $wpdb;
                $table_name = $wpdb->prefix . 'bhyts';
                $query = "SELECT * FROM {$table_name} WHERE 1=1";
                $params = [];

                if (!empty($args['name'])) {
                    $name_search = '%' . $wpdb->esc_like($args['name']) . '%';
                    $query .= " AND (hoTen LIKE %s OR maSoBhxh LIKE %s OR soTheBhyt LIKE %s)";
                    array_push($params, $name_search, $name_search, $name_search);
                }

                if (!empty($args['userName'])) {
                    $query .= " AND userName = %s";
                    $params[] = $args['userName'];
                }

                if (!empty($args['trangThai'])) {
                    $query .= " AND trangThaiTaiTuc = %s";
                    $params[] = $args['trangThai'];
                }
                
                $query .= " ORDER BY updated_at DESC LIMIT 50";
                return $wpdb->get_results($wpdb->prepare($query, $params), ARRAY_A) ?: [];
            }
        ]);
    }

    public function register_bhyt_stats_query() {
        register_graphql_field('RootQuery', 'bhytStats', [
            'type' => 'BhytStats',
            'args' => [ 'userName' => ['type' => 'String'] ],
            'resolve' => function($root, $args) {
                if (!$this->can_user_access_qlbh()) {
                     return ['total' => 0, 'active' => 0, 'expired' => 0];
                }

                global $wpdb;
                $table_name = $wpdb->prefix . 'bhyts';
                $params = [];
                $where_clause = 'WHERE 1=1';

                if (!empty($args['userName'])) {
                    $where_clause .= " AND userName = %s";
                    $params[] = $args['userName'];
                }

                $total = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table_name} {$where_clause}", $params));
                $active = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table_name} {$where_clause} AND denNgayDt >= CURDATE()", $params));
                $expired = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table_name} {$where_clause} AND denNgayDt < CURDATE()", $params));

                return [
                    'total' => (int) $total,
                    'active' => (int) $active,
                    'expired' => (int) $expired,
                ];
            }
        ]);
    }

    public function register_bhyt_mutations() {
        $mutation_logic = function($action) {
            return function($input) use ($action) {
                if (!$this->can_user_access_qlbh()) { throw new \GraphQL\Error\UserError(__('Bạn không có quyền thay đổi dữ liệu.', 'qlbh')); }
                global $wpdb;
                $result = $wpdb->update($wpdb->prefix . 'bhyts', $action($input), ['maSoBhxh' => $input['maSoBhxh']]);
                return ['success' => $result !== false, 'message' => 'Thao tác thành công'];
            };
        };

        register_graphql_mutation('updateGhiChu',['inputFields' => ['maSoBhxh' => ['type' => ['non_null' => 'String']], 'ghiChu' => ['type' => ['non_null' => 'String']]], 'outputFields' => ['success' => ['type' => 'Boolean'], 'message' => ['type' => 'String']], 'mutateAndGetPayload' => $mutation_logic(function($i) { return ['ghiChu' => $i['ghiChu']]; })]);
        register_graphql_mutation('theoDoi', ['inputFields' => ['maSoBhxh' => ['type' => ['non_null' => 'String']], 'completed' => ['type' => ['non_null' => 'Boolean']]], 'outputFields' => ['success' => ['type' => 'Boolean'], 'message' => ['type' => 'String']], 'mutateAndGetPayload' => $mutation_logic(function($i) { return ['completed' => $i['completed'] ? 1 : 0]; })]);
        register_graphql_mutation('loaiBo', ['inputFields' => ['maSoBhxh' => ['type' => ['non_null' => 'String']], 'disabled' => ['type' => ['non_null' => 'Boolean']]], 'outputFields' => ['success' => ['type' => 'Boolean'], 'message' => ['type' => 'String']], 'mutateAndGetPayload' => $mutation_logic(function($i) { return ['disabled' => $i['disabled'] ? 1 : 0]; })]);
    }
}
