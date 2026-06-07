<?php
if (!defined('ABSPATH')) exit;

class QLBH_GraphQL {

    public function __construct() {
        add_action('graphql_register_types', [$this, 'register_graphql_types']);
        add_action('graphql_register_types', [$this, 'register_bhyt_query']);
        add_action('graphql_register_types', [$this, 'register_bhyt_mutations']);
        add_action('graphql_register_types', [$this, 'register_collaborators_query']);
    }

    private function can_user_access_qlbh() {
        $current_user = wp_get_current_user();
        if (!$current_user || $current_user->ID === 0) return false;
        $allowed_roles = ['dai_ly_thu', 'cong_tac_vien', 'editor', 'administrator'];
        return !empty(array_intersect((array) $current_user->roles, $allowed_roles));
    }

    public function register_collaborators_query() {
        register_graphql_object_type('Collaborator', [
            'description' => __('Một người dùng Đại lý hoặc CTV', 'qlbh'),
            'fields' => [
                'label'         => ['type' => 'String'],
                'value'         => ['type' => 'String'],
                'maNhanVienThu' => ['type' => 'String'],
                'userIdBhxh'    => ['type' => 'String'],
            ]
        ]);

        register_graphql_field('RootQuery', 'collaborators', [
            'type' => ['list_of' => 'Collaborator'],
            'description' => __('Lấy danh sách người dùng là Đại lý thu và Cộng tác viên.', 'qlbh'),
            'resolve' => function() {
                if (!$this->can_user_access_qlbh()) {
                    throw new \GraphQL\Error\UserError(__('Bạn không có quyền thực hiện hành động này.', 'qlbh'));
                }

                $users = get_users(['role__in' => ['dai_ly_thu', 'cong_tac_vien', 'editor', 'administrator'], 'orderby' => 'display_name']);
                if (empty($users)) return [];

                $collaborators = array_map(function($user) {
                    $maNhanVienThu = get_user_meta($user->ID, 'qlbh_ma_nhan_vien_thu', true) ?: '';
                    $userIdBhxh    = get_user_meta($user->ID, 'qlbh_userid_bhxh', true) ?: '';
                    return [
                        'label'         => $maNhanVienThu,
                        'value'         => $userIdBhxh,
                        'maNhanVienThu' => $maNhanVienThu,
                        'userIdBhxh'    => $userIdBhxh,
                    ];
                }, $users);

                $filtered = array_filter($collaborators, function($c) { return !empty($c['label']) && !empty($c['value']); });
                return array_values($filtered);
            }
        ]);
    }

    public function register_graphql_types() {
         register_graphql_object_type('Bhyt', [
            'description' => __('Đối tượng BHYT', 'qlbh'),
            'fields' => [
                'id' => ['type' => 'Int'], 'hoTen' => ['type' => 'String'], 'maSoBhxh' => ['type' => 'String'], 'soTheBhyt' => ['type' => 'String'], 'ngaySinhDt' => ['type' => 'String'], 'diaChiLh' => ['type' => 'String'], 'gioiTinh' => ['type' => 'String'], 'tenDvi' => ['type' => 'String'], 'maKCB' => ['type' => 'String'], 'ngay5Nam' => ['type' => 'String'], 'tuNgayDt' => ['type' => 'String'], 'denNgayDt' => ['type' => 'String'], 'coTheUuTienCaoHon' => ['type' => 'Boolean'], 'trangThaiTaiTuc' => ['type' => 'String'], 'completed' => ['type' => 'Boolean'], 'updated_at' => ['type' => 'String'], 'disabled' => ['type' => 'Boolean'], 'ghiChu' => ['type' => 'String'], 'soDienThoai' => ['type' => 'String'], 'soDienThoai2' => ['type' => 'String'], 'userName' => ['type' => 'String'],
            ],
        ]);
    }

    public function register_bhyt_query() {
        register_graphql_field('RootQuery', 'bhyts', [
            'type' => ['list_of' => 'Bhyt'],
            'args' => [ 'name' => ['type' => 'String'], 'userName' => ['type' => 'String'], 'trangThai' => ['type' => 'String'], ],
            'resolve' => function ($root, $args) {
                if (!$this->can_user_access_qlbh()) {
                    throw new \GraphQL\Error\UserError(__('Bạn không có quyền truy vấn dữ liệu BHYT.', 'qlbh'));
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
                    $user_query = new WP_User_Query(['meta_key' => 'qlbh_userid_bhxh', 'meta_value' => $args['userName'], 'number' => 1, 'fields' => 'user_login']);
                    $found_users = $user_query->get_results();
                    if (!empty($found_users)) {
                        $query .= " AND userName = %s";
                        $params[] = $found_users[0];
                    } else { return []; }
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

        register_graphql_mutation('giaHanBHYT', [
            'inputFields' => [
                'maSoBhxh' => ['type' => ['non_null' => 'String'], 'description' => 'Mã số BHXH của đối tượng cần gia hạn.'],
                'soThang' => ['type' => ['non_null' => 'Int'], 'description' => 'Số tháng muốn gia hạn.'],
                'ghiChu' => ['type' => 'String', 'description' => 'Ghi chú cho lần gia hạn này.'],
            ],
            'outputFields' => ['success' => ['type' => 'Boolean'], 'message' => ['type' => 'String']],
            'mutateAndGetPayload' => function($input) {
                if (!$this->can_user_access_qlbh()) {
                    throw new \GraphQL\Error\UserError(__('Bạn không có quyền thực hiện hành động này.', 'qlbh'));
                }

                global $wpdb;
                $table_name = $wpdb->prefix . 'bhyts';
                $soThang = intval($input['soThang']);

                if ($soThang <= 0) {
                     throw new \GraphQL\Error\UserError(__('Số tháng gia hạn phải là một số nguyên dương.', 'qlbh'));
                }

                $bhyt = $wpdb->get_row($wpdb->prepare("SELECT denNgayDt, ghiChu FROM {$table_name} WHERE maSoBhxh = %s", $input['maSoBhxh']));
                if (!$bhyt) {
                    throw new \GraphQL\Error\UserError(__('Không tìm thấy đối tượng BHYT với mã số cung cấp.', 'qlbh'));
                }

                try {
                    $expiry_date = new DateTime($bhyt->denNgayDt);
                    $new_tuNgayDt = (clone $expiry_date)->modify('+1 day');
                    $new_denNgayDt = (clone $new_tuNgayDt)->modify('+' . $soThang . ' months - 1 day');
                } catch (Exception $e) {
                    throw new \GraphQL\Error\UserError(__('Định dạng ngày tháng trong database không hợp lệ.', 'qlbh'));
                }

                $update_data = [
                    'tuNgayDt'        => $new_tuNgayDt->format('Y-m-d'),
                    'denNgayDt'       => $new_denNgayDt->format('Y-m-d'),
                    'updated_at'      => current_time('mysql'),
                    'trangThaiTaiTuc' => 'Đã tái tục',
                ];

                if (!empty($input['ghiChu'])) {
                    $new_note = "[" . current_time('d/m/Y') . " - Gia hạn " . $soThang . " tháng]: " . $input['ghiChu'];
                    $update_data['ghiChu'] = !empty($bhyt->ghiChu) ? $bhyt->ghiChu . "\n" . $new_note : $new_note;
                }

                $result = $wpdb->update($table_name, $update_data, ['maSoBhxh' => $input['maSoBhxh']]);

                if ($result === false) {
                     return ['success' => false, 'message' => 'Gia hạn thất bại do lỗi database.'];
                }

                return ['success' => true, 'message' => 'Gia hạn BHYT thành công cho ' . $soThang . ' tháng!'];
            },
        ]);
    }
}
