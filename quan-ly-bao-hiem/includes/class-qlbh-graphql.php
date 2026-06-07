<?php
if (!defined('ABSPATH')) exit;

class QLBH_GraphQL {

    public function __construct() {
        add_action('graphql_register_types', [$this, 'register_graphql_types']);
    }

    public function register_graphql_types() {
        $this->register_create_giao_dich_mutation();
    }

    public function register_create_giao_dich_mutation() {
        register_graphql_mutation(
            'createGiaoDichFromJson',
            [
                'inputFields' => [
                    'jsonData' => [
                        'type' => ['non_null' => 'String'],
                        'description' => 'Chuỗi JSON chứa dữ liệu giao dịch.',
                    ],
                ],
                'outputFields' => [
                    'success' => [
                        'type' => 'Boolean',
                        'description' => 'Trạng thái thành công của mutation.',
                    ],
                    'message' => [
                        'type' => 'String',
                        'description' => 'Thông báo kết quả xử lý.',
                    ],
                ],
                'mutateAndGetPayload' => function ($input) {
                    global $wpdb;
                    
                    ini_set('memory_limit', '1024M');

                    $t_bhyt = $wpdb->prefix . 'qlbh_bhyt';
                    $t_bhxh = $wpdb->prefix . 'qlbh_bhxh_mo_rong';
                    $t_lich_su = $wpdb->prefix . 'qlbh_lich_su_dong_tien';

                    $json_data = stripcslashes(trim($input['jsonData']));
                    $data_goc = json_decode($json_data, true);

                    if (!is_array($data_goc) || !isset($data_goc['items'])) {
                        return [
                            'success' => false,
                            'message' => 'Lỗi: Dữ liệu JSON không hợp lệ hoặc thiếu mảng `items`.',
                        ];
                    }

                    $rows = $data_goc['items'];
                    $count_bo_qua = 0; $count_them_moi = 0; $count_lich_su = 0;

                    foreach ($rows as $row) {
                        $so_bl = !empty($row['bienLaiId']) ? sanitize_text_field($row['bienLaiId']) : '';
                        $ma_bhxh = !empty($row['maSoBhxh']) ? sanitize_text_field($row['maSoBhxh']) : '';
                        $ten_thu_tuc = !empty($row['tenThuTuc']) ? trim($row['tenThuTuc']) : '';

                        if (!empty($so_bl)) {
                            $check_bl = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $t_lich_su WHERE soBienLai = %s", $so_bl));
                            if ($check_bl > 0) { $count_bo_qua++; continue; }
                        }

                        if (empty($row['hoTen']) || empty($ma_bhxh)) { continue; }

                        $ten_nhan_vien_thu = !empty($row['nguoiNop']) ? sanitize_text_field($row['nguoiNop']) : '';
                        $thong_tin_mo_rong_ctv = '';
                        $json_user_id = !empty($row['userId']) ? intval($row['userId']) : 0;

                        $user_query = new WP_User_Query([
                            'meta_query' => [
                                'relation' => 'OR',
                                ['key' => 'qlbh_userid_bhxh', 'value' => $json_user_id, 'compare' => '='],
                                ['key' => 'qlbh_ma_nhan_vien_thu', 'value' => $ten_nhan_vien_thu, 'compare' => '=']
                            ],
                            'number' => 1
                        ]);
                        $users = $user_query->get_results();

                        if (!empty($users)) {
                            $user_found = $users[0];
                            $ten_nhan_vien_thu = get_user_meta($user_found->ID, 'qlbh_ma_nhan_vien_thu', true) ?: $user_found->display_name;
                            $ctv_dai_ly  = get_user_meta($user_found->ID, 'qlbh_dai_ly_thu', true);
                            $ctv_ma_xa   = get_user_meta($user_found->ID, 'qlbh_ma_xa_moi', true);
                            $ctv_dia_chi = get_user_meta($user_found->ID, 'qlbh_dia_chi_diem_thu', true);
                            $thong_tin_mo_rong_ctv = " [Đại lý: {$ctv_dai_ly} - Mã xã: {$ctv_ma_xa} - ĐC: {$ctv_dia_chi}]";
                        }

                        $ngay_sinh_chuan = '1900-01-01';
                        if (!empty($row['ngaySinh'])) {
                            $parts = explode('/', $row['ngaySinh']);
                            if (count($parts) == 3) { $ngay_sinh_chuan = $parts[2] . '-' . $parts[1] . '-' . $parts[0]; }
                        }

                        $khach_hang_cu = $wpdb->get_row($wpdb->prepare("SELECT id FROM $t_bhyt WHERE maSoBhxh = %s", $ma_bhxh));
                        $khach_hang_id = 0;
                        if ($khach_hang_cu) {
                            $khach_hang_id = $khach_hang_cu->id;
                        } else {
                            $wpdb->insert($t_bhyt, [
                                'hoTen' => sanitize_text_field($row['hoTen']), 'ngaySinh' => $ngay_sinh_chuan,
                                'soCmnd' => !empty($row['cmnd']) ? sanitize_text_field($row['cmnd']) : '',
                                'soDienThoai' => '0', 'soTheBhyt' => '', 'maSoBhxh' => $ma_bhxh,
                                'maTk' => !empty($row['soHoSo']) ? sanitize_text_field($row['soHoSo']) : '',
                                'diaBan' => !empty($row['tenDonViXuLyTruoc']) ? sanitize_text_field($row['tenDonViXuLyTruoc']) : '',
                                'denNgay' => '1900-01-01', 'ghiChu' => 'Import tự động từ GraphQL'
                            ]);
                            $khach_hang_id = $wpdb->insert_id;
                            $count_them_moi++;
                        }
                        
                        $so_tien = !empty($row['tongTien']) ? intval($row['tongTien']) : 0;
                        $loai_gd = ($ten_thu_tuc == '602') ? 'BHXH' : 'BHYT';
                        $phan_tram = ($loai_gd == 'BHXH') ? 5.0 : 3.5;

                        $wpdb->insert($t_lich_su, [
                            'khachHangId' => $khach_hang_id, 'loaiGiaoDich' => $loai_gd,
                            'ngayLap' => !empty($row['ngayLap']) ? substr($row['ngayLap'], 0, 10) : current_time('Y-m-d'),
                            'tongTien' => $so_tien, 'phanTramHoaHong' => $phan_tram,
                            'tienHoaHong' => round(($so_tien * $phan_tram) / 100),
                            'nguoiThu' => $ten_nhan_vien_thu, 'soBienLai' => $so_bl, 'maTraCuu' => '',
                            'ghiChu' => 'Thủ tục ' . $ten_thu_tuc . ' - Trạng thái: ' . sanitize_text_field($row['trangThaiHoSoName']) . $thong_tin_mo_rong_ctv,
                            'trangThai' => (isset($row['trangThaiHoSo']) && intval($row['trangThaiHoSo']) >= 8) ? 'Đã gia hạn' : 'Đã xuất biên lai',
                            'hinhThucThanhToan' => 'Chuyển khoản'
                        ]);
                        $count_lich_su++;
                    }

                    $thong_bao = sprintf('Đồng bộ thành công: %d biên lai mới, %d khách hàng mới, %d biên lai trùng bị bỏ qua.',
                        $count_lich_su, $count_them_moi, $count_bo_qua
                    );

                    return [
                        'success' => true,
                        'message' => $thong_bao,
                    ];
                },
            ]
        );
    }
}
