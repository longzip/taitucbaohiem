<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class QLBH_GraphQL_Bien_Lai
{
    public function __construct()
    {
        add_action('graphql_register_types', [$this, 'register_graphql_mutations']);
    }

    public function register_graphql_mutations()
    {
        register_graphql_mutation('ghiNhanDongTien', [
            'description' => __('Ghi nhận một giao dịch đóng tiền BHYT hoặc BHXH.', 'qlbh'),
            'inputFields' => [
                'maTraCuu' => ['type' => 'String'],
                'maXacNhan' => ['type' => 'String'],
                'maSoBHXH' => ['type' => 'String'],
                'loaiBaoHiem' => ['type' => 'String'],
                'hoTen' => ['type' => 'String'],
                'ngaySinh' => ['type' => 'String'],
                'diaChi' => ['type' => 'String'],
                'noiDungThu' => ['type' => 'String'],
                'soThangDong' => ['type' => 'Int'],
                'tuThoiGian' => ['type' => 'String'],
                'denThoiGian' => ['type' => 'String'],
                'soTienThu' => ['type' => 'Int'],
                'nhanVienThu' => ['type' => 'String'],
                'ngayLap' => ['type' => 'String'],
            ],
            'outputFields' => [
                'success' => ['type' => 'Boolean'],
                'message' => ['type' => 'String'],
            ],
            'mutateAndGetPayload' => function ($input, $context, $info) {
                global $wpdb;
                $table_name = $wpdb->prefix . 'qlbh_lich_su_dong_tien';

                $data_to_insert = [
                    'ma_tra_cuu' => isset($input['maTraCuu']) ? sanitize_text_field($input['maTraCuu']) : null,
                    'ma_xac_nhan' => isset($input['maXacNhan']) ? sanitize_text_field($input['maXacNhan']) : null,
                    'ma_so_bhxh' => isset($input['maSoBHXH']) ? sanitize_text_field($input['maSoBHXH']) : null,
                    'loai_bao_hiem' => isset($input['loaiBaoHiem']) ? sanitize_text_field($input['loaiBaoHiem']) : null,
                    'ho_ten' => isset($input['hoTen']) ? sanitize_text_field($input['hoTen']) : null,
                    'ngay_sinh' => isset($input['ngaySinh']) ? sanitize_text_field($input['ngaySinh']) : null,
                    'dia_chi' => isset($input['diaChi']) ? sanitize_text_field($input['diaChi']) : null,
                    'noi_dung_thu' => isset($input['noiDungThu']) ? sanitize_text_field($input['noiDungThu']) : null,
                    'so_thang_dong' => isset($input['soThangDong']) ? intval($input['soThangDong']) : null,
                    'tu_thoi_gian' => isset($input['tuThoiGian']) ? sanitize_text_field($input['tuThoiGian']) : null,
                    'den_thoi_gian' => isset($input['denThoiGian']) ? sanitize_text_field($input['denThoiGian']) : null,
                    'so_tien_thu' => isset($input['soTienThu']) ? intval($input['soTienThu']) : null,
                    'nhan_vien_thu' => isset($input['nhanVienThu']) ? sanitize_text_field($input['nhanVienThu']) : null,
                    'ngay_lap' => isset($input['ngayLap']) ? sanitize_text_field($input['ngayLap']) : null,
                ];

                $result = $wpdb->insert($table_name, $data_to_insert);

                if ($result === false) {
                    return [
                        'success' => false,
                        'message' => $wpdb->last_error,
                    ];
                }

                return [
                    'success' => true,
                    'message' => __('Ghi nhận đóng tiền thành công.', 'qlbh'),
                ];
            }
        ]);
    }
}

new QLBH_GraphQL_Bien_Lai();
