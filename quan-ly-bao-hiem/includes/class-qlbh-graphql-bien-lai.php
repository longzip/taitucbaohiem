<?php
// Prevent direct access
if (! defined('ABSPATH')) {
    exit;
}

class QLBH_GraphQL_Bien_Lai
{
    public function __construct()
    {
        add_action('graphql_register_types', [$this, 'register_graphql_types_and_mutations']);
    }

    public function register_graphql_types_and_mutations()
    {
        register_graphql_input_type('BienLaiBaoHiemInput', [
            'description' => 'Cấu trúc dữ liệu biên lai bảo hiểm đầu vào dạng camelCase',
            'fields'      => [
                'userId'          => ['type' => 'Int'],
                'maTraCuu'        => ['type' => 'String'],
                'maXacNhan'       => ['type' => 'String'],
                'maSoBhxh'        => ['type' => 'String'],
                'noiDungThuDayDu' => ['type' => 'String'],
                'loaiBienLai'     => ['type' => 'String'], // Nhận BHYT, BHXH, BHXH_TN...
                'ngayGiaoDich'    => ['type' => 'String'],
                'nhanVienThu'     => ['type' => 'String'],
                'soThangDong'     => ['type' => 'Int'],
                'tuThoiGian'      => ['type' => 'String'],
                'denThoiGian'     => ['type' => 'String'],
                'soTienThu'       => ['type' => 'Float'],
                'phanTramHoaHong' => ['type' => 'Float'],
            ],
        ]);

        register_graphql_object_type('BienLaiBaoHiemResult', [
            'fields' => [
                'maSoBhxh' => ['type' => 'String'],
                'status'   => ['type' => 'String'],
                'message'  => ['type' => 'String'],
            ],
        ]);

        register_graphql_mutation('capNhatDanhSachBienLaiBH', [
            'inputFields'         => [
                'danhSachBienLai' => [
                    'type'        => ['list_of' => 'BienLaiBaoHiemInput'],
                    'description' => 'Mảng chứa danh sách các biên lai bảo hiểm cần đồng bộ',
                ],
            ],
            'outputFields'        => [
                'success' => ['type' => 'Boolean'],
                'message' => ['type' => 'String'],
                'results' => ['type' => ['list_of' => 'BienLaiBaoHiemResult']],
            ],
            'mutateAndGetPayload' => function ($input) {
                global $wpdb;
                $table_bhyt    = $wpdb->prefix . 'bhyts';
                $table_lich_su = $wpdb->prefix . 'qlbh_lich_su_dong_tien';
                $table_bhxh_tn = $wpdb->prefix . 'qlbh_bhxh_tn';

                $results = [];
                if (empty($input['danhSachBienLai'])) {
                    return [
                        'success' => false,
                        'message' => 'Danh sách biên lai trống.',
                        'results' => [],
                    ];
                }

                foreach ($input['danhSachBienLai'] as $bienLai) {
                    $maSoBhxh    = sanitize_text_field($bienLai['maSoBhxh'] ?? '');
                    $maTraCuu    = sanitize_text_field($bienLai['maTraCuu'] ?? '');
                    $loaiBienLai = sanitize_text_field($bienLai['loaiBienLai'] ?? '');

                    // Kiểm tra các trường dữ liệu bắt buộc
                    if (empty($maSoBhxh)) {
                        $results[] = [
                            'maSoBhxh' => '',
                            'status'   => 'error',
                            'message'  => 'Mã số BHXH không được để trống.',
                        ];
                        continue;
                    }

                    try {
                        $wpdb->query('START TRANSACTION');

                        // Tìm ID khách hàng
                        $customer_id = $wpdb->get_var($wpdb->prepare(
                            "SELECT id FROM $table_bhyt WHERE maSoBhxh = %s",
                            $maSoBhxh
                        ));

                        $user_id = isset($bienLai['userId']) ? intval($bienLai['userId']) : 1;

                        // Tạo khách hàng mới nếu chưa tồn tại
                        if (! $customer_id) {
                            $insert_customer = $wpdb->insert($table_bhyt, [
                                'maSoBhxh'  => $maSoBhxh,
                                'hoTen'     => 'Chưa có tên',
                                'createdAt' => current_time('mysql', 1),
                            ]);

                            if ($insert_customer === false) {
                                throw new Exception("Không thể tạo khách hàng mới với mã BHXH: $maSoBhxh");
                            }
                            $customer_id = $wpdb->insert_id;
                        }
                        // Tính toán hoa hồng
                        $soTienThu          = floatval($bienLai['soTienThu'] ?? 0);
                        $phan_tram_hoa_hong = floatval($bienLai['phanTramHoaHong'] ?? 0);
                        $tien_hoa_hong      = ($soTienThu * $phan_tram_hoa_hong) / 100;

                        // Xử lý riêng cho BHXH
                        if (strpos($loaiBienLai, 'BHXH') !== false) {
                            $soThangDong = intval($bienLai['soThangDong'] ?? 0);

                            // Ngăn ngừa lỗi chia cho 0
                            if ($soThangDong > 0) {
                                $mucTienDong = (($soTienThu / $soThangDong) + 99000) / 0.22;
                            } else {
                                $mucTienDong = 0.0;
                            }

                            $bhxh_data = [
                                'ngayHetHanBhxh' => sanitize_text_field($bienLai['denThoiGian'] ?? ''),
                                'ghiChuBhxh'     => sanitize_text_field($bienLai['noiDungThuDayDu'] ?? ''),
                                'mucTienDong'    => $mucTienDong,
                                'soTien'         => $soTienThu,
                                'soThangDong'    => $soThangDong,
                                'trangThai'      => 'DANG_DONG',
                            ];

                            $existing_bhxh = $wpdb->get_var($wpdb->prepare(
                                "SELECT COUNT(*) FROM $table_bhxh_tn WHERE maSoBhxh = %s",
                                $maSoBhxh
                            ));

                            if ($existing_bhxh > 0) {
                                // SỬA LỖI 2: Kiểm tra kết quả cập nhật BHXH mở rộng
                                $update_res = $wpdb->update($table_bhxh_tn, $bhxh_data, ['maSoBhxh' => $maSoBhxh]);
                                if ($update_res === false) {
                                    throw new Exception("Không thể cập nhật bảng BHXH mở rộng cho mã BHXH: $maSoBhxh. Lỗi: " . $wpdb->last_error);
                                }
                            } else {
                                // SỬA LỖI 2: Kiểm tra kết quả tạo mới BHXH mở rộng
                                $bhxh_data['maSoBhxh'] = $maSoBhxh;
                                $insert_res            = $wpdb->insert($table_bhxh_tn, $bhxh_data);
                                if ($insert_res === false) {
                                    throw new Exception("Không thể thêm mới dữ liệu vào bảng BHXH mở rộng cho mã BHXH: $maSoBhxh. Lỗi: " . $wpdb->last_error);
                                }
                            }

                        }

                        // Xử lý riêng cho BHYT
                        // if (strpos($loaiBienLai, 'BHYT') !== false) {
                        //     $update_bhyt_res = $wpdb->update(
                        //         $table_bhyt,
                        //         [
                        //             'tuNgayDt'        => sanitize_text_field($bienLai['tuThoiGian'] ?? ''),
                        //             'denNgayDt'       => sanitize_text_field($bienLai['denThoiGian'] ?? ''),
                        //             'tongTien'        => $soTienThu,
                        //             'completed'       => 0,
                        //             'trangThaiTaiTuc' => 'Lưu biên lai',
                        //             'userName'        => $user_id,
                        //             'nhanVienThu'     => isset($bienLai['nhanVienThu']) ? sanitize_text_field($bienLai['nhanVienThu']) : null,
                        //             'updatedAt'       => current_time('mysql', 1),
                        //         ],
                        //         ['id' => $customer_id]
                        //     );

                        //     // SỬA LỖI 2: Kiểm tra kết quả cập nhật BHYT
                        //     if ($update_bhyt_res === false) {
                        //         throw new Exception("Không thể cập nhật bảng BHYT cho mã BHXH: $maSoBhxh. Lỗi: " . $wpdb->last_error);
                        //     }
                        // }

                        // Kiểm tra trùng lặp giao dịch
                        if (! empty($maTraCuu)) {
                            $existing_transaction = $wpdb->get_var($wpdb->prepare(
                                "SELECT COUNT(*) FROM $table_lich_su WHERE maTraCuu = %s",
                                $maTraCuu
                            ));

                            if ($existing_transaction > 0) {
                                $results[] = [
                                    'maSoBhxh' => $maSoBhxh,
                                    'status'   => 'skipped',
                                    'message'  => "Giao dịch với mã tra cứu $maTraCuu đã tồn tại.",
                                ];
                                $wpdb->query('COMMIT');
                                continue;
                            }
                        }

                        // Ghi lịch sử giao dịch
                        $lich_su_data = [
                            'khachHangId'      => $customer_id,
                            'loaiGiaoDich'     => $loaiBienLai,
                            'ngayLap'          => sanitize_text_field($bienLai['ngayGiaoDich'] ?? ''),
                            'tongTien'         => $soTienThu,
                            'nguoiThu'         => sanitize_text_field($bienLai['nhanVienThu'] ?? ''),
                            'soBienLai'        => sanitize_text_field($bienLai['maXacNhan'] ?? ''),
                            'maTraCuu'         => $maTraCuu,
                            'ngayDuKienGiaHan' => sanitize_text_field($bienLai['denThoiGian'] ?? ''),
                            'ghiChuDong'       => sanitize_text_field($bienLai['noiDungThuDayDu'] ?? ''),
                            'phanTramHoaHong'  => $phan_tram_hoa_hong,
                            'tienHoaHong'      => $tien_hoa_hong,
                        ];

                        $result = $wpdb->insert($table_lich_su, $lich_su_data);

                        if ($result === false) {
                            throw new Exception("Không thể ghi nhận lịch sử giao dịch cho mã BHXH: $maSoBhxh. Lỗi: " . $wpdb->last_error);
                        }

                        $wpdb->query('COMMIT');

                        $results[] = [
                            'maSoBhxh' => $maSoBhxh,
                            'status'   => 'success',
                            'message'  => 'Ghi nhận thành công.',
                        ];

                    } catch (Exception $e) {
                        $wpdb->query('ROLLBACK');
                        $results[] = [
                            'maSoBhxh' => $maSoBhxh,
                            'status'   => 'error',
                            'message'  => $e->getMessage(),
                        ];
                    }
                }

                return [
                    'success' => true,
                    'message' => 'Đồng bộ hoàn tất.',
                    'results' => $results,
                ];
            }
        ]);
    }
}

new QLBH_GraphQL_Bien_Lai();
