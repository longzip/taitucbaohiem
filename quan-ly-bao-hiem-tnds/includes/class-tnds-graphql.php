<?php
if (!defined('ABSPATH')) {
    exit;
}

class QLBH_TNDS_GraphQL {

    // Phân quyền yêu cầu để thao tác (Kiểm tra quyền Administrator)
    private static $required_capability = 'manage_options';

    /**
     * Khởi chạy việc đăng ký vào WPGraphQL thông qua hook chuẩn
     */
    public static function register() {
        add_action('graphql_register_types', [__CLASS__, 'register_types_and_fields']);
    }

    /**
     * Gom tất cả việc đăng ký Schema vào một hàm xử lý của hook
     */
    public static function register_types_and_fields() {
        self::register_tnds_type();
        self::register_tnds_query();
        self::register_create_tnds_mutation();
        self::register_update_tnds_mutation();
        self::register_delete_tnds_mutation();
    }

    /**
     * Danh sách các trường đầu vào hỗ trợ
     */
    private static function get_tnds_input_fields() {
        return [
            'userId' => ['type' => 'Int'],
            'chuXeHoTen' => ['type' => 'String'],
            'soDienThoai' => ['type' => 'String'],
            'email' => ['type' => 'String'],
            'diaChi' => ['type' => 'String'],
            'nmbhHoTen' => ['type' => 'String'],
            'nmbhSdt' => ['type' => 'String'],
            'bienSoXe' => ['type' => 'String'],
            'loaiXe' => ['type' => 'String'],
            'hangXe' => ['type' => 'String'],
            'phienBan' => ['type' => 'String'],
            'soKhung' => ['type' => 'String'],
            'soMay' => ['type' => 'String'],
            'namSanXuat' => ['type' => 'Int'],
            'soCho' => ['type' => 'Int'],
            'trongTai' => ['type' => 'Float'],
            'mucDichSuDung' => ['type' => 'String'],
            'ngayDangKy' => ['type' => 'String'],
            'soGcn' => ['type' => 'String'],
            'ngayBatDau' => ['type' => 'String'],
            'ngayHetHan' => ['type' => 'String'],
            'phiBaoHiem' => ['type' => 'Float'],
            'trangThai' => ['type' => 'String'],
            'ghiChu' => ['type' => 'String'],
        ];
    }

    /**
     * Làm sạch dữ liệu và bảo lưu giá trị NULL khi muốn xóa trắng trường thông tin trong DB
     */
    private static function sanitize_input_data($input) {
        $sanitized = [];
        $fields = self::get_tnds_input_fields();

        foreach ($fields as $field_name => $field_def) {
            if (!array_key_exists($field_name, $input)) {
                continue;
            }

            $value = $input[$field_name];

            // Nếu client truyền null, giữ nguyên null để hệ thống hỗ trợ xóa dữ liệu cũ
            if ($value === null) {
                $sanitized[$field_name] = null;
                continue;
            }

            $type = $field_def['type'];

            if ($type === 'Int') {
                $sanitized[$field_name] = intval($value);
            } elseif ($type === 'Float') {
                $sanitized[$field_name] = floatval($value); // Đã sửa lỗi biến $value thành $field_name ở phiên bản trước
            } elseif ($field_name === 'email') {
                $sanitized[$field_name] = sanitize_email($value);
            } else {
                $sanitized[$field_name] = sanitize_text_field($value);
            }
        }

        return $sanitized;
    }

    /**
     * Định nghĩa kiểu dữ liệu (Object Type) TNDS
     */
    private static function register_tnds_type() {
        register_graphql_object_type('TNDS', [
            'description' => __('Thông tin bảo hiểm TNDS', 'qlbh-tnds'),
            'fields' => [
                'id' => ['type' => 'ID'],
                'userId' => ['type' => 'Int'],
                'user' => [
                    'type' => 'User',
                    'resolve' => function($source) {
                        if (empty($source['userId'])) {
                            return null;
                        }
                        return get_userdata(intval($source['userId']));
                    }
                ],
                'chuXeHoTen' => ['type' => 'String'],
                'soDienThoai' => ['type' => 'String'],
                'email' => ['type' => 'String'],
                'diaChi' => ['type' => 'String'],
                'nmbhHoTen' => ['type' => 'String'],
                'nmbhSdt' => ['type' => 'String'],
                'bienSoXe' => ['type' => 'String'],
                'loaiXe' => ['type' => 'String'],
                'hangXe' => ['type' => 'String'],
                'phienBan' => ['type' => 'String'],
                'soKhung' => ['type' => 'String'],
                'soMay' => ['type' => 'String'],
                'namSanXuat' => ['type' => 'Int'],
                'soCho' => ['type' => 'Int'],
                'trongTai' => ['type' => 'Float'],
                'mucDichSuDung' => ['type' => 'String'],
                'ngayDangKy' => ['type' => 'String'],
                'soGcn' => ['type' => 'String'],
                'ngayBatDau' => ['type' => 'String'],
                'ngayHetHan' => ['type' => 'String'],
                'phiBaoHiem' => ['type' => 'Float'],
                'trangThai' => ['type' => 'String'],
                'ghiChu' => ['type' => 'String'],
                'soNgayConLai' => [
                    'type' => 'Int',
                    'resolve' => function($source) {
                        if (empty($source['ngayHetHan'])) return null;
                        try {
                            $today = current_datetime();
                            $expiryDate = new DateTimeImmutable($source['ngayHetHan'], $today->getTimezone());
                            $interval = $today->diff($expiryDate);
                            return $interval->invert ? -$interval->days : $interval->days;
                        } catch (Exception $e) {
                            return null;
                        }
                    }
                ],
            ],
        ]);
    }

    /**
     * Đăng ký Query lấy danh sách (tnds) và lấy lẻ theo ID (tndsById)
     */
    private static function register_tnds_query() {
        // Query 1: Lấy danh sách có bộ lọc
        register_graphql_field('RootQuery', 'tnds', [
            'type' => ['list_of' => 'TNDS'],
            'args' => [
                'trangThai' => ['type' => 'String'],
                'userId' => ['type' => 'Int'],
            ],
            'resolve' => function($root, $args) {
                if (!current_user_can(self::$required_capability)) {
                    throw new \GraphQL\Error\UserError('Bạn không có quyền thực hiện hành động này.');
                }
                global $wpdb;
                $table_name = $wpdb->prefix . 'qlbh_tnds';

                $where = ["1=1"];
                $params = [];

                if (!empty($args['trangThai'])) {
                    $where[] = "trangThai = %s";
                    $params[] = sanitize_text_field($args['trangThai']);
                }

                if (!empty($args['userId'])) {
                    $where[] = "userId = %d";
                    $params[] = intval($args['userId']);
                }

                $where_clause = implode(" AND ", $where);

                if (!empty($params)) {
                    $sql = $wpdb->prepare("SELECT * FROM $table_name WHERE $where_clause ORDER BY ngayHetHan ASC", $params);
                } else {
                    $sql = "SELECT * FROM $table_name ORDER BY ngayHetHan ASC";
                }

                return $wpdb->get_results($sql, ARRAY_A);
            }
        ]);

        // Query 2: Lấy thông tin một bản ghi cụ thể theo ID
        register_graphql_field('RootQuery', 'tndsById', [
            'type' => 'TNDS',
            'args' => [
                'id' => ['type' => ['non_null' => 'ID']],
            ],
            'resolve' => function($root, $args) {
                if (!current_user_can(self::$required_capability)) {
                    throw new \GraphQL\Error\UserError('Bạn không có quyền thực hiện hành động này.');
                }
                global $wpdb;
                $table_name = $wpdb->prefix . 'qlbh_tnds';
                $id = intval($args['id']);

                $record = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $id), ARRAY_A);
                return $record ? $record : null;
            }
        ]);
    }

    /**
     * Mutation tạo bản ghi mới
     */
    private static function register_create_tnds_mutation() {
        register_graphql_mutation('createTNDS', [
            'inputFields' => self::get_tnds_input_fields(),
            'outputFields' => [
                'tnds' => ['type' => 'TNDS'],
            ],
            'mutateAndGetPayload' => function($input) {
                if (!current_user_can(self::$required_capability)) {
                    throw new \GraphQL\Error\UserError('Bạn không có quyền thực hiện hành động này.');
                }
                global $wpdb;
                $table_name = $wpdb->prefix . 'qlbh_tnds';

                $data = self::sanitize_input_data($input);

                // Tự động gán userId là người dùng hiện tại nếu không truyền vào
                if (empty($data['userId'])) {
                    $data['userId'] = get_current_user_id();
                }

                $inserted = $wpdb->insert($table_name, $data);

                if ($inserted === false) {
                    if (strpos($wpdb->last_error, 'Duplicate entry') !== false) {
                        throw new \GraphQL\Error\UserError('Biển số xe này đã tồn tại trên hệ thống.');
                    }
                    throw new \GraphQL\Error\UserError('Không thể tạo bản ghi mới: ' . $wpdb->last_error);
                }

                $new_id = $wpdb->insert_id;
                $new_record = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $new_id), ARRAY_A);

                return [
                    'tnds' => $new_record,
                ];
            }
        ]);
    }

    /**
     * Mutation cập nhật bản ghi
     */
    private static function register_update_tnds_mutation() {
        register_graphql_mutation('updateTNDS', [
            'inputFields' => array_merge(
                ['id' => ['type' => ['non_null' => 'ID']]],
                self::get_tnds_input_fields()
            ),
            'outputFields' => [
                'tnds' => ['type' => 'TNDS'],
            ],
            'mutateAndGetPayload' => function($input) {
                if (!current_user_can(self::$required_capability)) {
                    throw new \GraphQL\Error\UserError('Bạn không có quyền thực hiện hành động này.');
                }
                global $wpdb;
                $table_name = $wpdb->prefix . 'qlbh_tnds';
                $id = intval($input['id']);

                // Kiểm tra xem ID có tồn tại trước khi cập nhật
                $existing = $wpdb->get_row($wpdb->prepare("SELECT id FROM $table_name WHERE id = %d", $id));
                if (!$existing) {
                    throw new \GraphQL\Error\UserError('Bản ghi không tồn tại trong hệ thống.');
                }

                $data = self::sanitize_input_data($input);
                $formats = [];
                $allowed_fields = self::get_tnds_input_fields();

                foreach ($data as $field_name => $value) {
                    $type = $allowed_fields[$field_name]['type'];
                    if ($type === 'Int') {
                        $formats[] = '%d';
                    } elseif ($type === 'Float') {
                        $formats[] = '%f';
                    } else {
                        $formats[] = '%s';
                    }
                }

                if (!empty($data)) {
                    $updated = $wpdb->update($table_name, $data, ['id' => $id], $formats, ['%d']);
                    if ($updated === false) {
                        if (strpos($wpdb->last_error, 'Duplicate entry') !== false) {
                            throw new \GraphQL\Error\UserError('Biển số xe cập nhật bị trùng lặp với một xe khác.');
                        }
                        throw new \GraphQL\Error\UserError('Không thể cập nhật dữ liệu: ' . $wpdb->last_error);
                    }
                }

                $updated_record = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $id), ARRAY_A);

                return [
                    'tnds' => $updated_record,
                ];
            }
        ]);
    }

    /**
     * Mutation xóa bản ghi
     */
    private static function register_delete_tnds_mutation() {
        register_graphql_mutation('deleteTNDS', [
            'inputFields' => [
                'id' => ['type' => ['non_null' => 'ID']],
            ],
            'outputFields' => [
                'deletedId' => ['type' => 'ID'],
                'success' => ['type' => 'Boolean'],
            ],
            'mutateAndGetPayload' => function($input) {
                if (!current_user_can(self::$required_capability)) {
                    throw new \GraphQL\Error\UserError('Bạn không có quyền thực hiện hành động này.');
                }
                global $wpdb;
                $table_name = $wpdb->prefix . 'qlbh_tnds';
                $id = intval($input['id']);

                // Kiểm tra xem ID có tồn tại trước khi xóa
                $existing = $wpdb->get_row($wpdb->prepare("SELECT id FROM $table_name WHERE id = %d", $id));
                if (!$existing) {
                    throw new \GraphQL\Error\UserError('Bản ghi cần xóa không tồn tại.');
                }

                $deleted = $wpdb->delete($table_name, ['id' => $id], ['%d']);

                return [
                    'deletedId' => $id,
                    'success' => ($deleted !== false && $deleted > 0),
                ];
            }
        ]);
    }
}
