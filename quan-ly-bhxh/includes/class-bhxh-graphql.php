<?php
if (!defined('ABSPATH')) {
    exit;
}

class QLBHXH_GraphQL {
    public static function register_types_and_fields() {
        // Register Payment History Type
        register_graphql_object_type('LichSuThanhToan', [
            'description' => __('Payment history record', 'wp-graphql'),
            'fields' => [
                'id' => ['type' => 'ID'],
                'bienLaiId' => ['type' => 'Number'],
                'ngayLap' => ['type' => 'String'],
                'trangThaiHoSoName' => ['type' => 'String'],
                'tongTien' => ['type' => 'Number'],
                'tienHoaHong' => ['type' => 'Number'],
                'nguoiNop' => ['type' => 'String'],
                'tenThuTuc' => ['type' => 'String'],
                'userId' => ['type' => 'Number'],
                'noiDung' => ['type' => 'String'],
                'maTraCuuQr' => ['type' => 'String'],
            ],
        ]);

        // Register BHXH Profile Type
        register_graphql_object_type('HoSoBHXH', [
            'description' => __('A BHXH profile', 'wp-graphql'),
            'fields' => [
                'maSoBhxh' => ['type' => 'String'],
                'hoTen' => ['type' => 'String'],
                'ngaySinh' => ['type' => 'String'],
                'cmnd' => ['type' => 'String'],
                'soDienThoai' => ['type' => 'String'],
                'email' => ['type' => 'String'],
                'diaChi' => ['type' => 'String'],
                'hoGiaDinh' => ['type' => 'String'],
                'ngayDk' => ['type' => 'String'],
                'maDonViBhxh' => ['type' => 'String'],
                'tenDonViBhxh' => ['type' => 'String'],
                'phuongAn' => ['type' => 'String'],
                'mucTienDong' => ['type' => 'Number'],
                'phuongThucDong' => ['type' => 'String'],
                'tuThangNam' => ['type' => 'String'],
                'thoiGianNhacDong' => ['type' => 'String'],
                'tiLeHoaHong' => ['type' => 'Number'],
                'ghiChu' => ['type' => 'String'],
                'lichSuThanhToan' => [
                    'type' => ['list_of' => 'LichSuThanhToan'],
                    'resolve' => function ($hoso) {
                        if (!is_user_logged_in()) {
                            throw new \GraphQL\Error\UserError('Bạn cần đăng nhập để thực hiện hành động này.');
                        }
                        global $wpdb;
                        $table_name = $wpdb->prefix . 'qlbhxh_lich_su_thanh_toan';
                        return $wpdb->get_results($wpdb->prepare("SELECT * FROM $table_name WHERE maSoBhxh = %s", $hoso->maSoBhxh));
                    },
                ],
            ],
        ]);

        // Register field to query BHXH profiles
        register_graphql_field('RootQuery', 'hoSoBHXH', [
            'type' => ['list_of' => 'HoSoBHXH'],
            'args' => [
                'maSoBhxh' => ['type' => 'String'],
            ],
            'resolve' => function ($root, $args) {
                if (!is_user_logged_in()) {
                    throw new \GraphQL\Error\UserError('Bạn cần đăng nhập để thực hiện hành động này.');
                }
                global $wpdb;
                $table_name = $wpdb->prefix . 'qlbhxh_hoso';
                $sql = "SELECT * FROM $table_name";
                if (!empty($args['maSoBhxh'])) {
                    $sql .= $wpdb->prepare(" WHERE maSoBhxh = %s", $args['maSoBhxh']);
                }
                return $wpdb->get_results($sql);
            },
        ]);

        // Mutation to add or update a BHXH record
        register_graphql_mutation('addOrUpdateBhxhRecord', [
            'inputFields' => [
                // Profile Fields
                'maSoBhxh' => ['type' => ['non_null' => 'String']],
                'hoTen' => ['type' => ['non_null' => 'String']],
                'ngaySinh' => ['type' => 'String'],
                'cmnd' => ['type' => 'String'],
                'soDienThoai' => ['type' => 'String'],
                'email' => ['type' => 'String'],
                'diaChi' => ['type' => 'String'],
                'hoGiaDinh' => ['type' => 'String'],
                'ngayDk' => ['type' => 'String'],
                'maDonViBhxh' => ['type' => 'String'],
                'tenDonViBhxh' => ['type' => 'String'],
                'phuongAn' => ['type' => 'String'],
                'mucTienDong' => ['type' => 'Number'],
                'phuongThucDong' => ['type' => 'String'],
                'tuThangNam' => ['type' => 'String'],
                'thoiGianNhacDong' => ['type' => 'String'],
                'tiLeHoaHong' => ['type' => 'Number'],
                'ghiChu' => ['type' => 'String'],
                // Payment History Fields
                'bienLaiId' => ['type' => 'Number'],
                'ngayLap' => ['type' => 'String'],
                'trangThaiHoSoName' => ['type' => 'String'],
                'tongTien' => ['type' => 'Number'],
                'tienHoaHong' => ['type' => 'Number'],
                'nguoiNop' => ['type' => 'String'],
                'tenThuTuc' => ['type' => 'String'],
                'userId' => ['type' => 'Number'],
                'noiDung' => ['type' => 'String'],
                'maTraCuuQr' => ['type' => 'String'],
            ],
            'outputFields' => [
                'hoSo' => ['type' => 'HoSoBHXH'],
            ],
            'mutateAndGetPayload' => function ($input) {
                if (!is_user_logged_in()) {
                    throw new \GraphQL\Error\UserError('Bạn cần đăng nhập để thực hiện hành động này.');
                }
                global $wpdb;
                $hoso_table = $wpdb->prefix . 'qlbhxh_hoso';
                $lich_su_table = $wpdb->prefix . 'qlbhxh_lich_su_thanh_toan';

                // Prepare profile data
                $hoso_data = [
                    'hoTen' => $input['hoTen'],
                    'ngaySinh' => $input['ngaySinh'],
                    'cmnd' => $input['cmnd'],
                    'soDienThoai' => $input['soDienThoai'],
                    'email' => $input['email'],
                    'diaChi' => $input['diaChi'],
                    'hoGiaDinh' => $input['hoGiaDinh'],
                    'ngayDk' => $input['ngayDk'],
                    'maDonViBhxh' => $input['maDonViBhxh'],
                    'tenDonViBhxh' => $input['tenDonViBhxh'],
                    'phuongAn' => $input['phuongAn'],
                    'mucTienDong' => $input['mucTienDong'],
                    'phuongThucDong' => $input['phuongThucDong'],
                    'tuThangNam' => $input['tuThangNam'],
                    'thoiGianNhacDong' => $input['thoiGianNhacDong'],
                    'tiLeHoaHong' => $input['tiLeHoaHong'],
                    'ghiChu' => $input['ghiChu'],
                ];
                $hoso_data = array_filter($hoso_data, function($value) { return $value !== null; });
                $wpdb->replace($hoso_table, array_merge(['maSoBhxh' => $input['maSoBhxh']], $hoso_data));

                // Insert payment history if provided
                if (isset($input['bienLaiId'])) {
                     $wpdb->insert($lich_su_table, [
                        'maSoBhxh' => $input['maSoBhxh'],
                        'bienLaiId' => $input['bienLaiId'],
                        'ngayLap' => $input['ngayLap'],
                        'trangThaiHoSoName' => $input['trangThaiHoSoName'],
                        'tongTien' => $input['tongTien'],
                        'tienHoaHong' => $input['tienHoaHong'],
                        'nguoiNop' => $input['nguoiNop'],
                        'tenThuTuc' => $input['tenThuTuc'],
                        'userId' => $input['userId'],
                        'noiDung' => $input['noiDung'],
                        'maTraCuuQr' => $input['maTraCuuQr'],
                    ]);
                }

                $ho_so = $wpdb->get_row($wpdb->prepare("SELECT * FROM $hoso_table WHERE maSoBhxh = %s", $input['maSoBhxh']));

                return ['hoSo' => $ho_so];
            },
        ]);
    }
}
?>