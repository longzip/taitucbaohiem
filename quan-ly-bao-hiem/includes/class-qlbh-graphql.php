<?php
if (!defined('ABSPATH')) exit;

class QLBH_GraphQL {

    public function __construct() {
        add_action('graphql_register_types', [$this, 'register_graphql_types']);
        add_action('graphql_register_types', [$this, 'register_bhyt_query']);
        add_action('graphql_register_types', [$this, 'register_bhyt_mutations']);
        add_action('graphql_register_types', [$this, 'register_collaborators_query']);
        add_action('graphql_register_types', [$this, 'register_bhyt_stats_query']);
        add_action('graphql_register_types', [$this, 'register_bhxh_query']);
        add_action('graphql_register_types', [$this, 'register_bhxh_mutations']);
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

        register_graphql_field('RootQuery', 'thongTinCaNhan', [
            'type' => 'Bhyt',
            'description' => __('Lấy thông tin cá nhân từ mã số BHXH trong bảng BHYT.', 'qlbh'),
            'args' => [
                'maSoBhxh' => ['type' => ['non_null' => 'String']],
            ],
            'resolve' => function ($root, $args) {
                 if (!$this->can_user_access_qlbh()) {
                    return null;
                }
                global $wpdb;
                $table_name = $wpdb->prefix . 'bhyts';
                $maSoBhxh = $args['maSoBhxh'];

                return $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table_name} WHERE maSoBhxh = %s", $maSoBhxh), ARRAY_A);
            }
        ]);
    }
    
    public function register_bhxh_query() {
        register_graphql_object_type('Bhxh', [
            'description' => __('Đối tượng BHXH tự nguyện', 'qlbh'),
            'fields' => [
                'id' => ['type' => 'ID'],
                'hoTen' => ['type' => 'String'],
                'maSoBhxh' => ['type' => 'String'],
                'ngaySinh' => ['type' => 'String'],
                 'gioiTinh' => ['type' => 'Int'],
                'cccd' => ['type' => 'String'],
                 'maHoGd' => ['type' => 'String'],
                'sdt' => ['type' => 'String'],
                'soDienThoai2' => ['type' => 'String'],
                'diaChi' => ['type' => 'String'],
                'phuongThucDong' => ['type' => 'String'],
                'soThangDong' => ['type' => 'Int'],
                'soTien' => ['type' => 'Float'],
                'mucTienDong' => ['type' => 'Float'],
                'trangThai' => ['type' => 'String'],
            ]
        ]);
    
        register_graphql_field('RootQuery', 'danhSachBhxh', [
            'type' => ['list_of' => 'Bhxh'],
            'args' => [
                'searchKeyword' => ['type' => 'String'],
            ],
            'description' => __('Lấy danh sách người tham gia BHXH tự nguyện.', 'qlbh'),
            'resolve' => function($root, $args) {
                if (!$this->can_user_access_qlbh()) {
                   return [];
                }
    
                global $wpdb;
                $table_bhyt = $wpdb->prefix . 'bhyts';
                $table_bhxh = $wpdb->prefix . 'qlbh_bhxh_mo_rong';

                $query = "
                    SELECT
                        b.id,
                        b.hoTen,
                        b.maSoBhxh,
                        b.ngaySinhDt as ngaySinh,
                        b.gioiTinh,
                        b.soCmnd as cccd,
                        b.maHoGd,
                        b.soDienThoai as sdt,
                        b.soDienThoai2,
                        b.diaChiLh as diaChi,
                        h.phuongThucDong,
                        h.soThangDong,
                        h.soTien,
                        h.mucTienDong,
                        h.trangThai
                    FROM
                        {$table_bhyt} b
                    INNER JOIN
                        {$table_bhxh} h ON b.maSoBhxh = h.maSoBhxh
                    WHERE 1=1
                ";
                $params = [];

                if (!empty($args['searchKeyword'])) {
                    $keyword = '%' . $wpdb->esc_like($args['searchKeyword']) . '%';
                    $query .= " AND (b.hoTen LIKE %s OR b.maSoBhxh LIKE %s)";
                    $params[] = $keyword;
                    $params[] = $keyword;
                }

                $results = $wpdb->get_results($wpdb->prepare($query, $params), ARRAY_A);

                return $results ?: [];
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

    public function register_bhxh_mutations() {

        register_graphql_input_type('ThemDongBhxhInput', [
            'description' => 'Dữ liệu để thêm một lần đóng BHXH',
            'fields' => [
                'idNguoiThamGia' => ['type' => ['non_null' => 'Int']],
                'soThang' => ['type' => 'Int'],
                'soTien' => ['type' => 'Float'],
                'phuongThuc' => ['type' => 'String'],
            ]
        ]);

        register_graphql_input_type('ThemNguoiThamGiaBhxhInput', [
            'description' => 'Dữ liệu để thêm người tham gia BHXH mới',
            'fields' => [
                'hoTen' => ['type' => ['non_null' => 'String']],
                'maSoBhxh' => ['type' => ['non_null' => 'String']],
                'ngaySinh' => ['type' => 'String'],
                'cccd' => ['type' => 'String'],
                'sdt' => ['type' => 'String'],
                'diaChi' => ['type' => 'String'],
                'phuongThucDong' => ['type' => 'String'],
                'soTien' => ['type' => 'Float'],
                'mucTienDong' => ['type' => 'Float'],
            ]
        ]);

        register_graphql_mutation('themDongBhxh', [
            'inputFields' => ['input' => ['type' => 'ThemDongBhxhInput']],
            'outputFields' => ['success' => ['type' => 'Boolean'], 'message' => ['type' => 'String']],
            'mutateAndGetPayload' => function($root, $args) {
                if (!$this->can_user_access_qlbh()) {
                    throw new \GraphQL\Error\UserError(__('Bạn không có quyền.', 'qlbh'));
                }

                global $wpdb;
                $table_bhyt = $wpdb->prefix . 'bhyts';
                $table_bhxh = $wpdb->prefix . 'qlbh_bhxh_mo_rong';

                $input = $args['input'];
                $id_nguoi_tham_gia = absint($input['idNguoiThamGia']);
                $so_thang = absint($input['soThang']);
                $so_tien = floatval($input['soTien']);

                if ($id_nguoi_tham_gia <= 0 || $so_thang <= 0) {
                    throw new \GraphQL\Error\UserError(__('Dữ liệu không hợp lệ.', 'qlbh'));
                }

                $ma_so_bhxh = $wpdb->get_var($wpdb->prepare(
                    "SELECT maSoBhxh FROM {$table_bhyt} WHERE id = %d",
                    $id_nguoi_tham_gia
                ));

                if (!$ma_so_bhxh) {
                    throw new \GraphQL\Error\UserError(__('Không tìm thấy người tham gia.', 'qlbh'));
                }

                $current_bhxh = $wpdb->get_row($wpdb->prepare(
                    "SELECT ngayHetHanBhxh FROM {$table_bhxh} WHERE maSoBhxh = %s",
                    $ma_so_bhxh
                ));

                $ngay_hien_tai = new DateTime();
                $ngay_het_han_cu = null;
                if ($current_bhxh && !empty($current_bhxh->ngayHetHanBhxh)) {
                    try {
                        $ngay_het_han_cu = new DateTime($current_bhxh->ngayHetHanBhxh);
                    } catch(Exception $e) { $ngay_het_han_cu = null; }
                }

                $ngay_bat_dau_tinh = ($ngay_het_han_cu && $ngay_het_han_cu > $ngay_hien_tai) ? $ngay_het_han_cu : $ngay_hien_tai;
                $ngay_het_han_moi = clone $ngay_bat_dau_tinh;
                $ngay_het_han_moi->add(new DateInterval("P{$so_thang}M"));

                $data_to_update = [
                    'ngayHetHanBhxh' => $ngay_het_han_moi->format('Y-m-d'),
                    'soTien' => $so_tien,
                    'phuongThucDong' => $so_thang . ' tháng',
                    'soThangDong' => $so_thang,
                    'trangThai' => 'DANG_THAM_GIA',
                ];

                $result = $wpdb->update($table_bhxh, $data_to_update, ['maSoBhxh' => $ma_so_bhxh]);

                if ($result === false) {
                    return ['success' => false, 'message' => 'Lỗi khi cập nhật cơ sở dữ liệu.'];
                }

                return ['success' => true, 'message' => 'Ghi nhận đóng BHXH thành công.'];
            }
        ]);

        register_graphql_mutation('themNguoiThamGiaBhxh', [
            'inputFields' => ['input' => ['type' => 'ThemNguoiThamGiaBhxhInput']],
            'outputFields' => ['success' => ['type' => 'Boolean'], 'message' => ['type' => 'String']],
            'mutateAndGetPayload' => function($root, $args) {
                if (!$this->can_user_access_qlbh()) {
                    throw new \GraphQL\Error\UserError(__('Bạn không có quyền.', 'qlbh'));
                }

                global $wpdb;
                $table_bhyt = $wpdb->prefix . 'bhyts';
                $table_bhxh = $wpdb->prefix . 'qlbh_bhxh_mo_rong';
                $input = $args['input'];

                if (empty($input['hoTen']) || empty($input['maSoBhxh'])) {
                    throw new \GraphQL\Error\UserError(__('Họ tên và Mã số BHXH là bắt buộc.', 'qlbh'));
                }

                // Check if user is already in the BHXH extension table
                $exists_in_bhxh_extension = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table_bhxh} WHERE maSoBhxh = %s", $input['maSoBhxh']));
                if ($exists_in_bhxh_extension > 0) {
                    throw new \GraphQL\Error\UserError(__('Người này đã tham gia BHXH tự nguyện rồi.', 'qlbh'));
                }

                // Check if user exists in the main BHYT table
                $exists_in_bhyt = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table_bhyt} WHERE maSoBhxh = %s", $input['maSoBhxh']));

                // If the user does not exist in the BHYT table, create them.
                if ($exists_in_bhyt == 0) {
                     $bhyt_data = [
                        'hoTen' => $input['hoTen'],
                        'maSoBhxh' => $input['maSoBhxh'],
                        'soCmnd' => $input['cccd'] ?? null,
                        'soDienThoai' => $input['sdt'] ?? null,
                        'diaChiLh' => $input['diaChi'] ?? null,
                        'ngaySinhDt' => $input['ngaySinh'] ?? null,
                        'userName' => wp_get_current_user()->user_login,
                        'created_at' => current_time('mysql', 1),
                        'updated_at' => current_time('mysql', 1),
                    ];
                    $result_bhyt = $wpdb->insert($table_bhyt, $bhyt_data);

                    if ($result_bhyt === false) {
                        return ['success' => false, 'message' => 'Lỗi khi thêm thông tin người tham gia vào bảng chính.'];
                    }
                }

                // Common logic to add to the BHXH extension table
                $so_thang = 0;
                if (!empty($input['phuongThucDong'])) {
                    preg_match('/\d+/', $input['phuongThucDong'], $matches);
                    if (isset($matches[0])) {
                        $so_thang = (int) $matches[0];
                    }
                }

                $ngay_het_han = null;
                $trang_thai = 'TAM_DUNG';
                if ($so_thang > 0) {
                    $ngay_het_han_dt = new DateTime();
                    $ngay_het_han_dt->add(new DateInterval("P{$so_thang}M"));
                    $ngay_het_han = $ngay_het_han_dt->format('Y-m-d');
                    $trang_thai = 'DANG_THAM_GIA';
                }

                $bhxh_data = [
                    'maSoBhxh' => $input['maSoBhxh'],
                    'soTien' => $input['soTien'] ?? null,
                     'mucTienDong' => $input['mucTienDong'] ?? null,
                    'phuongThucDong' => $input['phuongThucDong'] ?? null,
                    'soThangDong' => $so_thang,
                    'ngayHetHanBhxh' => $ngay_het_han,
                    'trangThai' => $trang_thai,
                    'ngayDk' => current_time('Y-m-d'),
                ];
                $result_bhxh = $wpdb->insert($table_bhxh, $bhxh_data);
                
                if ($result_bhxh === false) {
                    // If the user was newly added to BHYT table, roll back the insert.
                    if ($exists_in_bhyt == 0) {
                        $wpdb->delete($table_bhyt, ['maSoBhxh' => $input['maSoBhxh']]);
                    }
                    return ['success' => false, 'message' => 'Lỗi khi thêm thông tin đóng BHXH.'];
                }
                
                return ['success' => true, 'message' => 'Thêm người tham gia BHXH thành công.'];
            }
        ]);
    }
}
