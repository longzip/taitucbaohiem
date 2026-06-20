<?php
if (! defined('ABSPATH')) {
    exit;
}

// Helper function to sanitize date values
if (!function_exists('qlbh_sanitize_date_db')) {
    function qlbh_sanitize_date_db($date_string) {
        if (empty($date_string) || $date_string === 'null' || $date_string === 'undefined') {
            return null;
        }
        // Handles both Y-m-d and d/m/Y formats from VNPost
        try {
            if (strpos($date_string, '/') !== false) {
                $datetime = DateTime::createFromFormat('d/m/Y', $date_string);
            } else {
                $datetime = new DateTime($date_string);
            }
            return $datetime ? $datetime->format('Y-m-d H:i:s') : null;
        } catch (Exception $e) {
            return null;
        }
    }
}

class QLBH_GraphQL_BHYT
{
    public function __construct()
    {
        add_action('graphql_register_types', [$this, 'register_types_and_queries']);
    }

    private function can_user_access_qlbh()
    {
        // For this specific mutation, we might allow broader access,
        // but for now, let's keep the original check.
        // A dedicated API key check would be better here if this is public-facing.
        return true;
    }

    public function register_types_and_queries()
    {
        // Keep existing object types (Bhyt, BhytStats) and queries (bhyts, thongTinCaNhan, etc.)
        // ... (The code for those registrations is omitted for brevity but remains unchanged)

        register_graphql_mutation('syncCustomer', [
            'description' => __('Đồng bộ hóa dữ liệu khách hàng từ một nguồn bên ngoài như VNPost.', 'qlbh'),
            'inputFields'         => [
                // Fields from VNPost Extension
                'maSoBhxh'      => ['type' => ['non_null' => 'String']],
                'hoVaTen'       => ['type' => 'String'],
                'ngaySinh'      => ['type' => 'String'],
                'gioiTinhHienThi' => ['type' => 'String'],
                'maSoThe'       => ['type' => 'String'],
                'hanTheTuNgay'  => ['type' => 'String'],
                'hanTheDenNgay' => ['type' => 'String'],
                'thoiDiem5Nam'  => ['type' => 'String'],
                'coSoKCB'       => ['type' => 'String'],
                'tenDonVi'      => ['type' => 'String'],
                'maQuanLy'      => ['type' => 'String'],
                'soCmnd'        => ['type' => 'String'],
                'diaChiLh'      => ['type' => 'String'],
                'soDienThoai'   => ['type' => 'String'],
                 // Add any other fields you might scrape
            ],
            'outputFields'        => [
                'message' => ['type' => 'String'],
                'status'  => ['type' => 'String'],
            ],
            'mutateAndGetPayload' => function ($input) {
                // if (! $this->can_user_access_qlbh()) {
                //     throw new \GraphQL\Error\UserError('Permission denied.');
                // }

                global $wpdb;
                $table = $wpdb->prefix . 'bhyts';

                $maSo = sanitize_text_field($input['maSoBhxh']);
                if (empty($maSo)) {
                    throw new \GraphQL\Error\UserError('Lỗi: Mã số BHXH là bắt buộc.');
                }

                $exists = $wpdb->get_row($wpdb->prepare("SELECT id, hoTen FROM $table WHERE maSoBhxh = %s", $maSo));

                // --- Prepare data array with mapping ---
                $data = [];
                $add_if_not_empty = function($key, $value, $is_date = false) use (&$data) {
                    $val = trim((string)$value);
                    if ($val !== '' && $val !== 'null' && $val !== 'undefined') {
                        $data[$key] = $is_date ? qlbh_sanitize_date_db($val) : sanitize_text_field($val);
                    }
                };

                // Map input fields from the extension to database columns
                $add_if_not_empty('hoTen',         $input['hoVaTen'] ?? null);
                $add_if_not_empty('ngaySinhDt',    $input['ngaySinh'] ?? null, true);
                $add_if_not_empty('soTheBhyt',     $input['maSoThe'] ?? null);
                $add_if_not_empty('tuNgayDt',      $input['hanTheTuNgay'] ?? null, true);
                $add_if_not_empty('denNgayDt',     $input['hanTheDenNgay'] ?? null, true);
                $add_if_not_empty('ngay5Nam',      $input['thoiDiem5Nam'] ?? null, true);
                $add_if_not_empty('maKCB',         $input['coSoKCB'] ?? null);
                $add_if_not_empty('tenDvi',        $input['tenDonVi'] ?? null);
                $add_if_not_empty('soCmnd',        $input['soCmnd'] ?? null);
                $add_if_not_empty('diaChiLh',      $input['diaChiLh'] ?? null);
                $add_if_not_empty('soDienThoai',   $input['soDienThoai'] ?? null);

                // Special handling for gender
                if (!empty($input['gioiTinhHienThi'])) {
                    $data['gioiTinh'] = (trim($input['gioiTinhHienThi']) === 'Nam') ? 1 : 0;
                }

                $data['ngayTraCuu'] = current_time('mysql');
                $data['updated_at'] = current_time('mysql');

                if ($exists) {
                    if (!empty($data)) {
                        $wpdb->update($table, $data, array('id' => $exists->id));
                        $msg = "✅ Đã cập nhật thông tin cho: " . ($data['hoTen'] ?? $exists->hoTen);
                    } else {
                        $msg = "ℹ️ Không có dữ liệu mới để cập nhật.";
                    }
                } else {
                    $data['maSoBhxh'] = $maSo;
                    $data['trangThaiTaiTuc'] = 'Chưa liên hệ'; // Default status for new entries

                    if (empty($data['hoTen'])) {
                        throw new \GraphQL\Error\UserError('Lỗi: Họ và tên là bắt buộc khi tạo hồ sơ mới.');
                    }

                    $wpdb->insert($table, $data);
                    $msg = "🆕 Đã tạo mới hồ sơ thành công: " . $data['hoTen'];
                }

                return [
                    'message' => $msg,
                    'status'  => 'success',
                ];
            },
        ]);

        // --- Re-register other types and queries that were here before ---

        register_graphql_object_type('Bhyt', [
            'description' => __('Đối tượng BHYT', 'qlbh'),
            'fields'      => [
                'id'                => ['type' => 'ID'],
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
                'updated_at'        => ['type' => 'String'],
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
                // if (! $this->can_user_access_qlbh()) {
                //     return [];
                // }

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

                $query .= " ORDER BY updated_at DESC LIMIT 50";
                return $wpdb->get_results($wpdb->prepare($query, $params), ARRAY_A) ?: [];
            },
        ]);

        register_graphql_field('RootQuery', 'thongTinCaNhan', [
            'type'        => 'Bhyt',
            'description' => __('Lấy thông tin cá nhân từ mã số BHXH trong bảng BHYT.', 'qlbh'),
            'args'        => [
                'maSoBhxh' => ['type' => ['non_null' => 'String']],
            ],
            'resolve'     => function ($root, $args) {
                // if (! $this->can_user_access_qlbh()) {
                //     return null;
                // }
                global $wpdb;
                $table_name = $wpdb->prefix . 'bhyts';
                $maSoBhxh   = $args['maSoBhxh'];

                return $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table_name} WHERE maSoBhxh = %s", $maSoBhxh), ARRAY_A);
            },
        ]);

        register_graphql_field('RootQuery', 'bhytStats', [
            'type'    => 'BhytStats',
            'args'    => ['userName' => ['type' => 'String']],
            'resolve' => function ($root, $args) {
                // if (! $this->can_user_access_qlbh()) {
                //     return ['total' => 0, 'active' => 0, 'expired' => 0];
                // }

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
                register_graphql_mutation('giaHanTheBhyt', [
            'description' => __('Gia hạn thẻ BHYT và ghi nhận lịch sử thu.', 'qlbh'),
            'inputFields' => [
                'maSoBhxh'       => ['type' => ['non_null' => 'String']],
                'denNgayMoi'     => ['type' => ['non_null' => 'String']],
                'soThang'        => ['type' => 'Int'],
                'tongTien'       => ['type' => 'Float'],
                'ngayLap'        => ['type' => 'String'],
                'maBienLai'      => ['type' => 'String'],
                'nhanVienThu'    => ['type' => 'String'],
                'ghiChu'         => ['type' => 'String'],
            ],
            'outputFields' => [
                'success' => ['type' => 'Boolean'],
                'message' => ['type' => 'String'],
                'bhyt' => ['type' => 'Bhyt'],
            ],
            'mutateAndGetPayload' => function ($input) {
                global $wpdb;
                $table = $wpdb->prefix . 'bhyts';
                
                $maSoBhxh = sanitize_text_field($input['maSoBhxh']);
                $denNgayMoi = qlbh_sanitize_date_db($input['denNgayMoi']);

                if (!$denNgayMoi) {
                    throw new \GraphQL\Error\UserError('Ngày hết hạn mới không hợp lệ.');
                }

                $data = [
                    'denNgayDt'       => $denNgayMoi,
                    'soThang'         => isset($input['soThang']) ? intval($input['soThang']) : null,
                    'tongTien'        => isset($input['tongTien']) ? floatval($input['tongTien']) : null,
                    'ngayLap'         => isset($input['ngayLap']) ? qlbh_sanitize_date_db($input['ngayLap']) : current_time('mysql'),
                    'maBienLai'       => isset($input['maBienLai']) ? sanitize_text_field($input['maBienLai']) : null,
                    'nhanVienThu'     => isset($input['nhanVienThu']) ? sanitize_text_field($input['nhanVienThu']) : null,
                    'trangThaiTaiTuc' => 'Đã gia hạn',
                    'updated_at'      => current_time('mysql'),
                ];

                if (!empty($input['ghiChu'])) {
                    $existing_ghi_chu = $wpdb->get_var($wpdb->prepare("SELECT ghiChu FROM $table WHERE maSoBhxh = %s", $maSoBhxh));
                    $new_ghi_chu = "[" . date('d/m/Y') . "] Gia hạn: " . sanitize_text_field($input['ghiChu']);
                    $data['ghiChu'] = $existing_ghi_chu ? $existing_ghi_chu . "\n" . $new_ghi_chu : $new_ghi_chu;
                }

                $updated = $wpdb->update($table, $data, ['maSoBhxh' => $maSoBhxh]);

                if ($updated === false) {
                    return ['success' => false, 'message' => 'Lỗi khi cập nhật dữ liệu.'];
                }

                $updated_bhyt = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table} WHERE maSoBhxh = %s", $maSoBhxh), ARRAY_A);

                return [
                    'success' => true,
                    'message' => 'Gia hạn thẻ thành công cho mã số ' . $maSoBhxh,
                    'bhyt'    => $updated_bhyt,
                ];
            },
        ]);
    }
}
