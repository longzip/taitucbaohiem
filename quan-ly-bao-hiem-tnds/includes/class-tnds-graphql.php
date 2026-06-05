<?php
if (!defined('ABSPATH')) {
    exit;
}

class QLBH_TNDS_GraphQL {

    public static function register() {
        self::register_tnds_type();
        self::register_tnds_query();
        self::register_create_tnds_mutation();
        self::register_update_tnds_mutation();
    }

    private static function get_tnds_input_fields() {
        return [
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

    private static function register_tnds_type() {
        register_graphql_object_type('TNDS', [
            'description' => __('Thông tin bảo hiểm TNDS', 'qlbh-tnds'),
            'fields' => [
                'id' => ['type' => 'ID'],
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
                        $today = new DateTime();
                        $expiryDate = new DateTime($source['ngayHetHan']);
                        $interval = $today->diff($expiryDate);
                        return $interval->invert ? -$interval->days : $interval->days;
                    }
                ],
            ],
        ]);
    }

    private static function register_tnds_query() {
        register_graphql_field('RootQuery', 'tnds', [
            'type' => ['list_of' => 'TNDS'],
            'args' => [
                'trangThai' => ['type' => 'String'],
            ],
            'resolve' => function($root, $args) {
                if (!is_user_logged_in()) {
                    throw new \GraphQL\Error\UserError('Bạn cần đăng nhập để thực hiện hành động này.');
                }
                global $wpdb;
                $table_name = $wpdb->prefix . 'qlbh_tnds';
                $sql = "SELECT * FROM $table_name ORDER BY ngayHetHan ASC";
                if (!empty($args['trangThai'])) {
                    $sql = $wpdb->prepare("SELECT * FROM $table_name WHERE trangThai = %s ORDER BY ngayHetHan ASC", $args['trangThai']);
                }
                return $wpdb->get_results($sql, ARRAY_A);
            }
        ]);
    }

    private static function register_create_tnds_mutation() {
        register_graphql_mutation('createTNDS', [
            'inputFields' => self::get_tnds_input_fields(),
            'outputFields' => [
                'tnds' => ['type' => 'TNDS'],
            ],
            'mutateAndGetPayload' => function($input) {
                if (!is_user_logged_in()) {
                    throw new \GraphQL\Error\UserError('Bạn cần đăng nhập để thực hiện hành động này.');
                }
                global $wpdb;
                $table_name = $wpdb->prefix . 'qlbh_tnds';
                
                $data = $input;
                unset($data['clientMutationId']);

                $wpdb->insert($table_name, $data);

                $new_id = $wpdb->insert_id;
                $new_record = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $new_id), ARRAY_A);

                return [
                    'tnds' => $new_record,
                ];
            }
        ]);
    }

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
                if (!is_user_logged_in()) {
                    throw new \GraphQL\Error\UserError('Bạn cần đăng nhập để thực hiện hành động này.');
                }
                global $wpdb;
                $table_name = $wpdb->prefix . 'qlbh_tnds';
                $id = $input['id'];

                $data = [];
                $formats = [];
                $allowed_fields = self::get_tnds_input_fields();

                foreach ($allowed_fields as $field_name => $field_def) {
                    if (array_key_exists($field_name, $input)) {
                        $data[$field_name] = $input[$field_name];
                        $type = $field_def['type'];
                        if ($type === 'Int') {
                            $formats[] = '%d';
                        } elseif ($type === 'Float') {
                            $formats[] = '%f';
                        } else {
                            $formats[] = '%s';
                        }
                    }
                }

                if (!empty($data)) {
                    $wpdb->update($table_name, $data, ['id' => $id], $formats, ['%d']);
                }

                $updated_record = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $id), ARRAY_A);

                return [
                    'tnds' => $updated_record,
                ];
            }
        ]);
    }
}
