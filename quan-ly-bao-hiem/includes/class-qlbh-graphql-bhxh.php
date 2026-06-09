<?php
if (! defined('ABSPATH')) {
    exit;
}

class QLBH_GraphQL_BHXH
{

    public function __construct()
    {
        add_action('graphql_register_types', [$this, 'register_types_and_queries']);
        add_action('graphql_register_types', [$this, 'register_mutations']);
    }

    private function can_user_access_qlbh()
    {
        $current_user = wp_get_current_user();
        if (! $current_user || $current_user->ID === 0) {
            return false;
        }

        $allowed_roles = ['dai_ly_thu', 'cong_tac_vien', 'editor', 'administrator'];
        return ! empty(array_intersect((array) $current_user->roles, $allowed_roles));
    }

    public function register_types_and_queries()
    {
        register_graphql_object_type('Bhxh', [
            'description' => __('Đối tượng BHXH tự nguyện', 'qlbh'),
            'fields'      => [
                'id'                  => ['type' => 'ID'],
                'userId'              => ['type' => 'Int'],
                'hoTen'               => ['type' => 'String'],
                'maSoBhxh'            => ['type' => 'String'],
                'ngaySinh'            => ['type' => 'String'],
                'gioiTinh'            => ['type' => 'Int'],
                'cccd'                => ['type' => 'String'],
                'maHoGd'              => ['type' => 'String'],
                'sdt'                 => ['type' => 'String'],
                'soDienThoai2'        => ['type' => 'String'],
                'diaChi'              => ['type' => 'String'],
                'phuongThucDong'      => ['type' => 'String'],
                'soThangDong'         => ['type' => 'Int'],
                'soTien'              => ['type' => 'Float'],
                'mucTienDong'         => ['type' => 'Float'],
                'trangThai'           => ['type' => 'String'],
                'ngayHetHanBhxh'      => ['type' => 'String'],
                'lichSuDongDaThuTien' => [
                    'type'        => 'LichSuDong',
                    'description' => __('Lấy lịch sử đóng tiền gần nhất đã thu nhưng chưa có mã tra cứu.', 'qlbh'),
                    'resolve'     => function ($bhxh_participant) {
                        global $wpdb;
                        $table_lich_su     = $wpdb->prefix . 'qlbh_lich_su_dong_tien';
                        $id_nguoi_tham_gia = $bhxh_participant['id'];

                        if (empty($id_nguoi_tham_gia)) {
                            return null;
                        }

                        $query = "
                            SELECT *
                            FROM {$table_lich_su}
                            WHERE khachHangId = %d
                              AND loaiGiaoDich = 'BHXH'
                              AND (maTraCuu IS NULL OR maTraCuu = '')
                            ORDER BY ngayLap DESC
                            LIMIT 1
                        ";

                        $result = $wpdb->get_row($wpdb->prepare($query, $id_nguoi_tham_gia), ARRAY_A);
                        return $result ?: null;
                    },
                ],
            ],
        ]);

        register_graphql_object_type('LichSuDong', [
            'description' => 'Một bản ghi trong lịch sử đóng tiền',
            'fields'      => [
                'id'               => ['type' => 'ID'],
                'ngayLap'          => ['type' => 'String'],
                'tongTien'         => ['type' => 'Float'],
                'phanTramHoaHong'  => ['type' => 'Float'],
                'tienHoaHong'      => ['type' => 'Int'],
                'nguoiThu'         => ['type' => 'String'],
                'soBienLai'        => ['type' => 'String'],
                'maTraCuu'         => ['type' => 'String'],
                'ngayDuKienGiaHan' => ['type' => 'String'],
                'ghiChuDong'       => ['type' => 'String'],
                'trangThaiNhac'    => ['type' => 'String'],
                'hinhThucTt'       => ['type' => 'String'],
                'anhBienLai'       => ['type' => 'String'],
            ],
        ]);

        register_graphql_field('RootQuery', 'danhSachBhxh', [
            'type'        => ['list_of' => 'Bhxh'],
            'args'        => [
                'searchKeyword' => ['type' => 'String'],
                'userId'        => ['type' => 'Int'],
            ],
            'description' => __('Lấy danh sách người tham gia BHXH tự nguyện.', 'qlbh'),
            'resolve'     => function ($root, $args) {
                if (! $this->can_user_access_qlbh()) {
                    return [];
                }

                global $wpdb;
                $table_bhyt = $wpdb->prefix . 'bhyts';
                $table_bhxh = $wpdb->prefix . 'qlbh_bhxh_mo_rong';

                $query = "
                    SELECT
                        b.id,
                        h.userId,
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
                        h.trangThai,
                        h.ngayHetHanBhxh
                    FROM
                        {$table_bhxh} h
                    LEFT JOIN
                        {$table_bhyt} b ON h.maSoBhxh = b.maSoBhxh
                    WHERE 1=1
                ";
                $params = [];

                if (! empty($args['searchKeyword'])) {
                    $keyword   = '%' . $wpdb->esc_like($args['searchKeyword']) . '%';
                    $query    .= " AND (b.hoTen LIKE %s OR h.maSoBhxh LIKE %s)";
                    $params[]  = $keyword;
                    $params[]  = $keyword;
                }

                if (! empty($args['userId'])) {
                    $query    .= " AND h.userId = %d";
                    $params[]  = (int) $args['userId'];
                }

                $results  = $wpdb->get_results($wpdb->prepare($query, $params), ARRAY_A);

                if (empty($results)) {
                    return [];
                }

                return array_map(function ($item) {
                    $item['id']          = isset($item['id']) ? (int) $item['id'] : null;
                    $item['userId']      = isset($item['userId']) ? (int) $item['userId'] : null;
                    $item['gioiTinh']    = isset($item['gioiTinh']) ? (int) $item['gioiTinh'] : null;
                    $item['soThangDong'] = isset($item['soThangDong']) ? (int) $item['soThangDong'] : null;
                    $item['soTien']      = isset($item['soTien']) ? (float) $item['soTien'] : null;
                    $item['mucTienDong'] = isset($item['mucTienDong']) ? (float) $item['mucTienDong'] : null;
                    return $item;
                }, $results);
            },
        ]);

        register_graphql_field('RootQuery', 'lichSuDongBhxh', [
            'type'        => ['list_of' => 'LichSuDong'],
            'description' => __('Lấy lịch sử đóng BHXH tự nguyện của một người.', 'qlbh'),
            'args'        => [
                'idNguoiThamGia' => ['type' => ['non_null' => 'Int']],
            ],
            'resolve'     => function ($root, $args) {
                if (! $this->can_user_access_qlbh()) {
                    return [];
                }
                global $wpdb;
                $table_lich_su     = $wpdb->prefix . 'qlbh_lich_su_dong_tien';
                $id_nguoi_tham_gia = $args['idNguoiThamGia'];

                $query = "
                    SELECT *
                    FROM {$table_lich_su}
                    WHERE khachHangId = %d AND loaiGiaoDich = 'BHXH'
                    ORDER BY ngayLap DESC
                ";

                return $wpdb->get_results($wpdb->prepare($query, $id_nguoi_tham_gia), ARRAY_A) ?: [];
            },
        ]);
    }

    public function register_mutations()
    {

        register_graphql_input_type('ThemDongBhxhInput', [
            'description' => 'Dữ liệu để thêm một lần đóng BHXH',
            'fields'      => [
                'id'             => ['type' => 'ID'],
                'maSoBhxh'       => ['type' => ['non_null' => 'String']],
                'ngayHetHanBhxh' => ['type' => ['non_null' => 'String']],
                'soThang'        => ['type' => 'Int'],
                'soTien'         => ['type' => 'Float'],
                'mucTienDong'    => ['type' => 'Float'],
                'phuongThuc'     => ['type' => 'String'],
                'maTraCuu'       => ['type' => 'String'],
                'tuThangNam'     => ['type' => 'String'],
            ],
        ]);

        register_graphql_input_type('ThemNguoiThamGiaBhxhInput', [
            'description' => 'Dữ liệu để thêm người tham gia BHXH mới',
            'fields'      => [
                'hoTen'          => ['type' => ['non_null' => 'String']],
                'maSoBhxh'       => ['type' => ['non_null' => 'String']],
                'ngaySinh'       => ['type' => 'String'],
                'cccd'           => ['type' => 'String'],
                'sdt'            => ['type' => 'String'],
                'diaChi'         => ['type' => 'String'],
                'phuongThucDong' => ['type' => 'String'],
                'soTien'         => ['type' => 'Float'],
                'mucTienDong'    => ['type' => 'Float'],
                'maTraCuu'       => ['type' => 'String'],
            ],
        ]);

        register_graphql_mutation('themDongBhxh', [
            'inputFields'         => ['input' => ['type' => 'ThemDongBhxhInput']],
            'outputFields'        => ['success' => ['type' => 'Boolean'], 'message' => ['type' => 'String']],
            'mutateAndGetPayload' => function ($input) {
                if (! $this->can_user_access_qlbh()) {
                    throw new \GraphQL\Error\UserError(__('Bạn không có quyền.', 'qlbh'));
                }

                global $wpdb;
                $table_bhyt = $wpdb->prefix . 'bhyts';
                $table_bhxh = $wpdb->prefix . 'qlbh_bhxh_mo_rong';

                $ma_so_bhxh        = $input['maSoBhxh'];
                $ngay_het_han_bhxh = $input['ngayHetHanBhxh'];
                $so_thang          = absint($input['soThang']);
                $so_tien           = floatval($input['soTien']);
                $muc_tien_dong     = floatval($input['mucTienDong']);
                $id_lich_su_dong   = isset($input['id']) ? (int) $input['id'] : 0;

                if (empty($ma_so_bhxh) || empty($ngay_het_han_bhxh)) {
                    throw new \GraphQL\Error\UserError(__('Mã số BHXH và Ngày hết hạn là bắt buộc.', 'qlbh'));
                }

                try {
                    new DateTime($ngay_het_han_bhxh);
                } catch (Exception $e) {
                    throw new \GraphQL\Error\UserError(__('Định dạng ngày hết hạn không hợp lệ.', 'qlbh'));
                }

                $id_nguoi_tham_gia = $wpdb->get_var($wpdb->prepare("SELECT id FROM {$table_bhyt} WHERE maSoBhxh = %s", $ma_so_bhxh));

                if (! $id_nguoi_tham_gia) {
                    throw new \GraphQL\Error\UserError(__('Không tìm thấy người tham gia với mã số BHXH cung cấp.', 'qlbh'));
                }

                $data = [
                    'ngayHetHanBhxh' => $ngay_het_han_bhxh,
                    'soTien'         => $so_tien,
                    'mucTienDong'    => $muc_tien_dong,
                    'phuongThucDong' => $so_thang . ' tháng',
                    'soThangDong'    => $so_thang,
                ];

                if (! empty($input['maTraCuu'])) {
                    $data['trangThai'] = 'DA_NOP';
                } else {
                    $data['trangThai'] = 'DA_THU_TIEN';
                }

                $bhxh_record_exists = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table_bhxh} WHERE maSoBhxh = %s", $ma_so_bhxh));

                if ($bhxh_record_exists) {
                    $result = $wpdb->update($table_bhxh, $data, ['maSoBhxh' => $ma_so_bhxh]);
                } else {
                    $data['maSoBhxh'] = $ma_so_bhxh;
                    $data['ngayDk']   = current_time('Y-m-d');
                    $result           = $wpdb->insert($table_bhxh, $data);
                }

                if ($result === false) {
                    return ['success' => false, 'message' => 'Lỗi khi cập nhật hoặc thêm mới vào cơ sở dữ liệu.'];
                }

                // Add payment to history
                $ghi_chu_dong = "Đóng BHXH Tự nguyện - {$so_thang} tháng";
                if (! empty($input['tuThangNam'])) {
                    $ghi_chu_dong = "Kỳ đóng: " . $input['tuThangNam'] . " - " . $ghi_chu_dong;
                }
                if (! empty($input['maTraCuu'])) {
                    $ghi_chu_dong .= " (Mã tra cứu: " . $input['maTraCuu'] . ")";
                }

                $current_user = wp_get_current_user();
                $nguoi_thu    = get_user_meta($current_user->ID, 'qlbh_ma_nhan_vien_thu', true);

                if (empty($nguoi_thu)) {
                    $nguoi_thu = $current_user->user_login;
                }

                $table_lich_su = $wpdb->prefix . 'qlbh_lich_su_dong_tien';
                $lich_su_data  = [
                    'khachHangId'  => $id_nguoi_tham_gia,
                    'loaiGiaoDich' => 'BHXH',
                    'ngayLap'      => current_time('mysql', 1),
                    'tongTien'     => $so_tien,
                    'hinhThucTt'   => $input['phuongThuc'] ?? 'Chưa rõ',
                    'maTraCuu'     => $input['maTraCuu'] ?? '',
                    'ghiChuDong'   => $ghi_chu_dong,
                    'nguoiThu'     => $nguoi_thu,
                ];
                if ($id_lich_su_dong > 0) {
                    $wpdb->update($table_lich_su, $lich_su_data, ['id' => $id_lich_su_dong]);
                } else {
                    $wpdb->insert($table_lich_su, $lich_su_data);
                }

                return ['success' => true, 'message' => 'Ghi nhận đóng BHXH thành công.'];
            },
        ]);

        register_graphql_mutation('themNguoiThamGiaBhxh', [
            'inputFields'         => ['input' => ['type' => 'ThemNguoiThamGiaBhxhInput']],
            'outputFields'        => ['success' => ['type' => 'Boolean'], 'message' => ['type' => 'String']],
            'mutateAndGetPayload' => function ($input) {
                if (! $this->can_user_access_qlbh()) {
                    throw new \GraphQL\Error\UserError(__('Bạn không có quyền.', 'qlbh'));
                }

                global $wpdb;
                $table_bhyt = $wpdb->prefix . 'bhyts';
                $table_bhxh = $wpdb->prefix . 'qlbh_bhxh_mo_rong';

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
                        'hoTen'       => $input['hoTen'],
                        'maSoBhxh'    => $input['maSoBhxh'],
                        'soCmnd'      => $input['cccd'] ?? null,
                        'soDienThoai' => $input['sdt'] ?? null,
                        'diaChiLh'    => $input['diaChi'] ?? null,
                        'ngaySinhDt'  => $input['ngaySinh'] ?? null,
                        'userName'    => wp_get_current_user()->user_login,
                        'created_at'  => current_time('mysql', 1),
                        'updated_at'  => current_time('mysql', 1),
                    ];
                    $result_bhyt = $wpdb->insert($table_bhyt, $bhyt_data);

                    if ($result_bhyt === false) {
                        return ['success' => false, 'message' => 'Lỗi khi thêm thông tin người tham gia vào bảng chính.'];
                    }
                }

                // Common logic to add to the BHXH extension table
                $so_thang = 0;
                if (! empty($input['phuongThucDong'])) {
                    preg_match('/\\d+/', $input['phuongThucDong'], $matches);
                    if (isset($matches[0])) {
                        $so_thang = (int) $matches[0];
                    }
                }

                $ngay_het_han = null;
                $trang_thai   = 'TAM_DUNG';
                if ($so_thang > 0) {
                    $ngay_het_han_dt = new DateTime();
                    $ngay_het_han_dt->add(new DateInterval("P{$so_thang}M"));
                    $ngay_het_han = $ngay_het_han_dt->format('Y-m-d');
                    $trang_thai   = 'DANG_THAM_GIA';
                }

                $bhxh_data = [
                    'maSoBhxh'       => $input['maSoBhxh'],
                    'soTien'         => $input['soTien'] ?? null,
                    'mucTienDong'    => $input['mucTienDong'] ?? null,
                    'phuongThucDong' => $input['phuongThucDong'] ?? null,
                    'soThangDong'    => $so_thang,
                    'ngayHetHanBhxh' => $ngay_het_han,
                    'trangThai'      => $trang_thai,
                    'ngayDk'         => current_time('Y-m-d'),
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
            },
        ]);

        register_graphql_mutation('xoaLichSuDongBhxh', [
            'inputFields'         => [
                'id' => ['type' => ['non_null' => 'ID'], 'description' => 'ID của lịch sử đóng cần xóa'],
            ],
            'outputFields'        => [
                'success' => ['type' => 'Boolean'],
                'message' => ['type' => 'String'],
            ],
            'mutateAndGetPayload' => function ($input) {
                if (! $this->can_user_access_qlbh()) {
                    throw new \GraphQL\Error\UserError(__('Bạn không có quyền thực hiện hành động này.', 'qlbh'));
                }

                global $wpdb;
                $table_lich_su = $wpdb->prefix . 'qlbh_lich_su_dong_tien';
                $table_bhxh    = $wpdb->prefix . 'qlbh_bhxh_mo_rong';
                $table_bhyt    = $wpdb->prefix . 'bhyts';
                $id            = (int) $input['id'];

                if (empty($id)) {
                    throw new \GraphQL\Error\UserError(__('ID lịch sử đóng không hợp lệ.', 'qlbh'));
                }

                $khach_hang_id = $wpdb->get_var($wpdb->prepare("SELECT khachHangId FROM {$table_lich_su} WHERE id = %d", $id));

                if (empty($khach_hang_id)) {
                    return ['success' => false, 'message' => 'Không tìm thấy lịch sử đóng tương ứng.'];
                }

                $ma_so_bhxh = $wpdb->get_var($wpdb->prepare("SELECT maSoBhxh FROM {$table_bhyt} WHERE id = %d", $khach_hang_id));

                $delete_result = $wpdb->delete($table_lich_su, ['id' => $id], ['%d']);

                if ($delete_result === false) {
                    return ['success' => false, 'message' => 'Lỗi khi xóa lịch sử đóng.'];
                }

                if ($delete_result === 0) {
                    return ['success' => false, 'message' => 'Không tìm thấy lịch sử đóng để xóa.'];
                }

                if ($ma_so_bhxh) {
                    $update_result = $wpdb->update(
                        $table_bhxh,
                        ['trangThai' => 'HUY_THU'],
                        ['maSoBhxh' => $ma_so_bhxh]
                    );

                    if ($update_result === false) {
                        return ['success' => false, 'message' => 'Lỗi khi cập nhật trạng thái Hủy thu.'];
                    }
                }

                return ['success' => true, 'message' => 'Đã xóa thành công lịch sử đóng.'];
            },
        ]);

    }
}
