<?php
if (!defined('ABSPATH')) exit;

class QLBH_MIC_GraphQL {
    public static function register_fields() {
        add_action('graphql_register_types', function() {
            // 1. First, define the new object type for the payment history log
            register_graphql_object_type('LichSuThuTienType', array(
                'description' => 'Lịch sử thu tiền cho một hợp đồng MIC',
                'fields' => array(
                    'idLog'             => array('type' => 'Int'),
                    'ngayThu'           => array('type' => 'String'),
                    'soTienGoc'         => array('type' => 'Float'),
                    'tiLeHoaHong'       => array('type' => 'Float'),
                    'tienHoaHongTichLuy' => array('type' => 'Float'),
                    'nhanVienThu'       => array('type' => 'String'),
                    'trangThaiChiTra'   => array('type' => 'String'),
                    'thangTinhLuong'    => array('type' => 'String'),
                    'soHoaDon'          => array('type' => 'String'),
                    'maTraCuu'          => array('type' => 'String'),
                    'trangThaiNopTien'  => array('type' => 'String'),
                    'phuongThuc'        => array('type' => 'String'),
                )
            ));

            $lich_su_select_fields_clause = "SELECT 
                id_log AS idLog,
                ngay_thu AS ngayThu,
                so_tien_goc AS soTienGoc,
                ti_le_hoa_hong AS tiLeHoaHong,
                tien_hoa_hong_tich_luy AS tienHoaHongTichLuy,
                nhan_vien_thu AS nhanVienThu,
                trang_thai_chi_tra AS trangThaiChiTra,
                thang_tinh_luong AS thangTinhLuong,
                so_hoa_don AS soHoaDon,
                ma_tra_cuu AS maTraCuu,
                trang_thai_nop_tien AS trangThaiNopTien,
                phuong_thuc AS phuongThuc";

            // 2. Then, update your MicContractType registration to include the new field
            register_graphql_object_type('MicContractType', array(
                'fields' => array(
                    'idHopDong'    => array('type' => 'Int'),
                    'soHopDongMic' => array('type' => 'String'),
                    'ngayBatDau'   => array('type' => 'String'),
                    'ngayHetHan'   => array('type' => 'String'),
                    'mucPhi'       => array('type' => 'Float'),
                    'trangThaiDon' => array('type' => 'String'),
                    // Người được bảo hiểm
                    'ndbhHoTen'    => array('type' => 'String'),
                    'ndbhNgaySinh' => array('type' => 'String'),
                    'ndbhCccd'     => array('type' => 'String'),
                    'ndbhBhxh'     => array('type' => 'String'),
                    'ndbhGioiTinh' => array('type' => 'String'),
                    'ndbhDiaChi'   => array('type' => 'String'),
                    'ndbhSdt'      => array('type' => 'String'),
                    'ndbhEmail'    => array('type' => 'String'),
                    // Người mua bảo hiểm
                    'nmbhHoTen'    => array('type' => 'String'),
                    'nmbhDiaChi'   => array('type' => 'String'),
                    'nmbhSdt'      => array('type' => 'String'),
                    'soNgayConLai' => array('type' => 'Int'),

                    // --- FIELD TO ADD ---
                    'lichSuChuaDuyet' => array(
                        'type' => 'LichSuThuTienType',
                        'description' => 'Lấy thông tin lần thu tiền gần nhất đang ở trạng thái Chờ duyệt',
                        'resolve' => function($contract) use ($lich_su_select_fields_clause) {
                            if (!is_user_logged_in()) {
                                throw new \GraphQL\Error\UserError('Bạn cần đăng nhập để thực hiện hành động này.');
                            }
                            global $wpdb;
                            $id_hop_dong = $contract->id_hop_dong; 
                            
                            if (empty($id_hop_dong)) {
                                return null;
                            }

                            $table_lichsu  = $wpdb->prefix . 'qlbh_mic_lich_su_thu_tien';
                            $query = $wpdb->prepare(
                                "$lich_su_select_fields_clause FROM $table_lichsu 
                                WHERE id_hop_dong = %d AND trang_thai_nop_tien = 'Cho duyet' 
                                ORDER BY ngay_thu DESC LIMIT 1",
                                $id_hop_dong
                            );
                            
                            return $wpdb->get_row($query, OBJECT);
                        }
                    ),
                    'lichSuThanhToan' => array(
                        'type' => array( 'list_of' => 'LichSuThuTienType' ),
                        'description' => 'Lấy tất cả lịch sử thu tiền của hợp đồng',
                        'resolve' => function($contract) use ($lich_su_select_fields_clause) {
                            if (!is_user_logged_in()) {
                                throw new \GraphQL\Error\UserError('Bạn cần đăng nhập để thực hiện hành động này.');
                            }
                            global $wpdb;
                            $id_hop_dong = $contract->id_hop_dong;

                            if (empty($id_hop_dong)) {
                                return [];
                            }

                            $table_lichsu = $wpdb->prefix . 'qlbh_mic_lich_su_thu_tien';
                            $query = $wpdb->prepare(
                                "$lich_su_select_fields_clause FROM $table_lichsu 
                                WHERE id_hop_dong = %d ORDER BY ngay_thu DESC",
                                $id_hop_dong
                            );

                            return $wpdb->get_results($query);
                        }
                    )
                )
            ));

            register_graphql_field('RootQuery', 'danhSachTatCaMicDon', array(
                'type' => array('list_of' => 'MicContractType'),
                'args' => array(
                    'searchKeyword' => array('type' => 'String')
                ),
                'description' => 'Lấy danh sách tất cả các hợp đồng MIC, có thể tìm kiếm',
                'resolve' => function($root, $args) {
                    if (!is_user_logged_in()) {
                        throw new \GraphQL\Error\UserError('Bạn cần đăng nhập để thực hiện hành động này.');
                    }
                    global $wpdb;
                    $table_hopdong = $wpdb->prefix . 'qlbh_hopdong_mic';
                    $search_keyword = !empty($args['searchKeyword']) ? $args['searchKeyword'] : null;

                    $sql = "
                        SELECT 
                            m.id_hop_dong, m.so_hop_dong_mic AS soHopDongMic, 
                            m.ngay_bat_dau AS ngayBatDau, m.ngay_het_han AS ngayHetHan, m.muc_phi AS mucPhi, m.trang_thai_don AS trangThaiDon,
                            m.ndbh_ho_ten AS ndbhHoTen, m.ndbh_ngay_sinh AS ndbhNgaySinh, m.ndbh_cccd AS ndbhCccd, m.ndbh_bhxh AS ndbhBhxh,
                            m.ndbh_gioi_tinh AS ndbhGioiTinh, m.ndbh_dia_chi AS ndbhDiaChi, m.ndbh_sdt AS ndbhSdt, m.ndbh_email AS ndbhEmail,
                            m.nmbh_ho_ten AS nmbhHoTen, m.nmbh_dia_chi AS nmbhDiaChi, m.nmbh_sdt AS nmbhSdt,
                            DATEDIFF(m.ngay_het_han, CURDATE()) AS soNgayConLai
                        FROM $table_hopdong m
                    ";
                    
                    $params = [];
                    if ($search_keyword) {
                        $search_term = '%' . $wpdb->esc_like($search_keyword) . '%';
                        $sql .= " WHERE (m.so_hop_dong_mic LIKE %s OR m.ndbh_ho_ten LIKE %s OR m.ndbh_cccd LIKE %s OR m.ndbh_sdt LIKE %s)";
                        $params = array_fill(0, 4, $search_term);
                    }

                    $sql .= " ORDER BY m.ngay_het_han DESC";

                    $query = $wpdb->prepare($sql, $params);
                    $results = $wpdb->get_results($query);

                    foreach ($results as $contract) {
                         $contract->idHopDong = $contract->id_hop_dong;
                    }
                    
                    return $results;
                }
            ));


            register_graphql_mutation('thuTienMic', [
                'inputFields' => [
                    'idHopDong' => ['type' => ['non_null' => 'Int']],
                    'idLog' => ['type' => 'Int'],
                    'soHoaDon' => ['type' => 'String'],
                    'maTraCuu' => ['type' => 'String'],
                    'phuongThuc' => ['type' => 'String'],
                    'tiLeHoaHong' => ['type' => 'Float'],
                ],
                'outputFields' => [
                    'success' => ['type' => 'Boolean'],
                    'message' => ['type' => 'String'],
                ],
                'mutateAndGetPayload' => function($input) {
                    if (!is_user_logged_in()) {
                        throw new \GraphQL\Error\UserError('Bạn cần đăng nhập để thực hiện hành động này.');
                    }
                    global $wpdb;
                    $id_hop_dong = $input['idHopDong'];
                    $id_log = $input['idLog'] ?? null;
                    $so_hoa_don = trim($input['soHoaDon'] ?? '');
                    $ma_tra_cuu = trim($input['maTraCuu'] ?? '');

                    // 1. Check if contract exists and get necessary data
                    $table_hopdong = $wpdb->prefix . 'qlbh_hopdong_mic';
                    $contract = $wpdb->get_row($wpdb->prepare("SELECT muc_phi, ngay_het_han FROM $table_hopdong WHERE id_hop_dong = %d", $id_hop_dong));

                    if (!$contract) {
                        return [
                            'success' => false,
                            'message' => 'Lỗi: Không tìm thấy hợp đồng gốc.',
                        ];
                    }

                    // 2. Determine history log status
                    $trang_thai_nop_tien = (empty($so_hoa_don) && empty($ma_tra_cuu)) ? 'Cho duyet' : 'Đã có biên lai';

                    // 3. Prepare and insert/update history log
                    $table_lichsu = $wpdb->prefix . 'qlbh_mic_lich_su_thu_tien';
                    $ti_le_hoa_hong = $input['tiLeHoaHong'] ?? 20.00;
                    $tien_hoa_hong = $contract->muc_phi * ($ti_le_hoa_hong / 100);

                    $common_data = [
                        'ti_le_hoa_hong' => $ti_le_hoa_hong,
                        'tien_hoa_hong_tich_luy' => $tien_hoa_hong,
                        'so_hoa_don' => $so_hoa_don,
                        'ma_tra_cuu' => $ma_tra_cuu,
                        'phuong_thuc' => $input['phuongThuc'] ?? 'Chuyen khoan',
                        'trang_thai_nop_tien' => $trang_thai_nop_tien,
                    ];

                    if ($id_log) {
                        // UPDATE existing log
                        $result = $wpdb->update(
                            $table_lichsu,
                            $common_data, 
                            ['id_log' => $id_log] 
                        );
                    } else {
                        // INSERT new log
                        $current_user = wp_get_current_user();
                        $nhan_vien_thu = ($current_user && $current_user->ID > 0) ? $current_user->user_login : 'he thong';
                        
                        $insert_data = array_merge($common_data, [
                            'id_hop_dong' => $id_hop_dong,
                            'ngay_thu' => current_time('mysql'),
                            'so_tien_goc' => $contract->muc_phi,
                            'nhan_vien_thu' => $nhan_vien_thu,
                            'thang_tinh_luong' => current_time('Y-m'),
                        ]);

                        $result = $wpdb->insert($table_lichsu, $insert_data);
                    }

                    if ($result === false) {
                         return [
                            'success' => false,
                            'message' => 'Lỗi database khi ghi nhận lịch sử thu tiền: ' . $wpdb->last_error,
                        ];
                    }
                    
                    // 4. Update main contract status and expiry date
                    $update_data = [];
                    if (!empty($so_hoa_don) && !empty($ma_tra_cuu)) {
                        // Renew contract: set status to 'Hieu luc' and extend expiry date
                        $ngay_het_han_dt = new DateTime($contract->ngay_het_han);
                        $ngay_het_han_dt->add(new DateInterval('P365D'));
                        $ngay_het_han_moi = $ngay_het_han_dt->format('Y-m-d');
                        
                        $update_data = [
                            'trang_thai_don' => 'Hieu luc',
                            'ngay_het_han' => $ngay_het_han_moi,
                        ];
                    } else {
                        // Incomplete info: set status to 'Da thu tien' (Pending approval)
                        $update_data = ['trang_thai_don' => 'Da thu tien'];
                    }

                    $wpdb->update(
                        $table_hopdong,
                        $update_data,
                        ['id_hop_dong' => $id_hop_dong]
                    );

                    return [
                        'success' => true,
                        'message' => 'Ghi nhận lịch sử thành công.',
                    ];
                }
            ]);

            register_graphql_mutation('huyThuMic', [
                'inputFields' => [
                    'idLog' => ['type' => ['non_null' => 'Int']],
                ],
                'outputFields' => [
                    'success' => ['type' => 'Boolean'],
                    'message' => ['type' => 'String'],
                ],
                'mutateAndGetPayload' => function($input) {
                    if (!is_user_logged_in()) {
                        throw new \GraphQL\Error\UserError('Bạn cần đăng nhập để thực hiện hành động này.');
                    }
                    global $wpdb;
                    $id_log = $input['idLog'];
                    $table_lichsu = $wpdb->prefix . 'qlbh_mic_lich_su_thu_tien';
                    $table_hopdong = $wpdb->prefix . 'qlbh_hopdong_mic';

                    // Find the hop_dong_id from the log before deleting it
                    $id_hop_dong = $wpdb->get_var($wpdb->prepare("SELECT id_hop_dong FROM $table_lichsu WHERE id_log = %d", $id_log));

                    if (!$id_hop_dong) {
                        return [
                            'success' => false,
                            'message' => 'Không tìm thấy lịch sử thu tiền.',
                        ];
                    }

                    // Delete the history log
                    $deleted = $wpdb->delete($table_lichsu, ['id_log' => $id_log], ['%d']);

                    if ($deleted === false) {
                        return [
                            'success' => false,
                            'message' => 'Lỗi database khi hủy thu: ' . $wpdb->last_error,
                        ];
                    }

                    // Update the main contract status
                    $wpdb->update(
                        $table_hopdong,
                        ['trang_thai_don' => 'Can tai tuc'],
                        ['id_hop_dong' => $id_hop_dong]
                    );

                    return [
                        'success' => true,
                        'message' => 'Đã hủy ghi nhận thu tiền thành công.',
                    ];
                }
            ]);

            register_graphql_mutation('taoHopDongMicTuBhyt', [
                'inputFields' => [
                    'maSoBhxh' => ['type' => ['non_null' => 'String']],
                ],
                'outputFields' => [
                    'success' => ['type' => 'Boolean'],
                    'message' => ['type' => 'String'],
                ],
                'mutateAndGetPayload' => function($input) {
                    if (!is_user_logged_in()) {
                        throw new \GraphQL\Error\UserError('Bạn cần đăng nhập để thực hiện hành động này.');
                    }
                    global $wpdb;
                    $ma_so_bhxh = $input['maSoBhxh'];

                    // 1. Check if a MIC contract with this BHXH already exists
                    $table_hopdong_mic = $wpdb->prefix . 'qlbh_hopdong_mic';
                    $existing_mic_contract = $wpdb->get_var($wpdb->prepare(
                        "SELECT id_hop_dong FROM $table_hopdong_mic WHERE ndbh_bhxh = %s",
                        $ma_so_bhxh
                    ));

                    if ($existing_mic_contract) {
                        return [
                            'success' => false,
                            'message' => 'Hợp đồng MIC với Mã số BHXH này đã tồn tại.',
                        ];
                    }

                    // 2. Find the BHYT record
                    $table_bhyts = $wpdb->prefix . 'bhyts';
                    $bhyt_record = $wpdb->get_row($wpdb->prepare(
                        "SELECT hoTen, ngaySinhDt, soCmnd, gioiTinh, diaChiLh, soDienThoai, email FROM $table_bhyts WHERE maSoBhxh = %s",
                        $ma_so_bhxh
                    ), ARRAY_A);

                    if (!$bhyt_record) {
                        return [
                            'success' => false,
                            'message' => 'Không tìm thấy thông tin BHYT với Mã số BHXH này.',
                        ];
                    }

                    // 3. Create the new MIC contract
                    $ngay_bat_dau = current_time('Y-m-d');
                    $ngay_het_han_dt = new DateTime($ngay_bat_dau);
                    $ngay_het_han_dt->add(new DateInterval('P364D'));
                    $ngay_het_han = $ngay_het_han_dt->format('Y-m-d');

                    $gioi_tinh_text = '';
                    if ($bhyt_record['gioiTinh'] !== null) {
                        $gioi_tinh_text = ($bhyt_record['gioiTinh'] == 1) ? 'Nam' : 'Nữ';
                    }

                    $result = $wpdb->insert($table_hopdong_mic, [
                        'ndbh_ho_ten'    => $bhyt_record['hoTen'],
                        'ndbh_ngay_sinh' => $bhyt_record['ngaySinhDt'],
                        'ndbh_cccd'      => $bhyt_record['soCmnd'],
                        'ndbh_bhxh'      => $ma_so_bhxh,
                        'ndbh_gioi_tinh' => $gioi_tinh_text,
                        'ndbh_dia_chi'   => $bhyt_record['diaChiLh'],
                        'ndbh_sdt'       => $bhyt_record['soDienThoai'],
                        'ndbh_email'     => $bhyt_record['email'],
                        'ngay_bat_dau'   => $ngay_bat_dau,
                        'ngay_het_han'   => $ngay_het_han,
                        'trang_thai_don' => 'Can tai tuc',
                        'muc_phi'        => 169000.00,
                    ]);

                    if ($result === false) {
                        return [
                            'success' => false,
                            'message' => 'Lỗi database khi tạo hợp đồng MIC mới: ' . $wpdb->last_error,
                        ];
                    }

                    return [
                        'success' => true,
                        'message' => 'Tạo hợp đồng MIC mới thành công.',
                    ];
                }
            ]);


            register_graphql_mutation('luuHopDongMicTuGCN', [
                'inputFields' => [
                    'soHopDongMic' => ['type' => 'String'],
                    'ngayBatDau'   => ['type' => 'String'],
                    'ngayHetHan'   => ['type' => 'String'],
                    'ndbhHoTen'    => ['type' => ['non_null' => 'String']],
                    'ndbhNgaySinh' => ['type' => 'String'],
                    'ndbhCccd'     => ['type' => ['non_null' => 'String']],
                    'ndbhGioiTinh' => ['type' => 'String'],
                    'ndbhDiaChi'   => ['type' => 'String'],
                    'ndbhSdt'      => ['type' => 'String'],
                    'ndbhEmail'    => ['type' => 'String'],
                    'nmbhHoTen'    => ['type' => 'String'],
                    'nmbhDiaChi'   => ['type' => 'String'],
                    'nmbhSdt'      => ['type' => 'String'],
                ],
                'outputFields' => [
                    'success' => ['type' => 'Boolean'],
                    'message' => ['type' => 'String'],
                ],
                'mutateAndGetPayload' => function($input) {
                    if (!is_user_logged_in()) {
                        throw new \GraphQL\Error\UserError('Bạn cần đăng nhập để thực hiện hành động này.');
                    }
                    global $wpdb;
                    $table_hopdong = $wpdb->prefix . 'qlbh_hopdong_mic';
                    $cccd = trim($input['ndbhCccd']);

                    // Helper function to convert date format from d/m/Y to Y-m-d
                    $convert_date = function($date_string) {
                        if (empty($date_string)) return null;
                        try {
                            $dt = DateTime::createFromFormat('d/m/Y', $date_string);
                            return $dt ? $dt->format('Y-m-d') : null;
                        } catch (Exception $e) {
                            return null;
                        }
                    };

                    // Prepare the data array, common for both insert and update
                    $data = [
                        'so_hop_dong_mic' => $input['soHopDongMic'] ?? null,
                        'ngay_bat_dau'   => $convert_date($input['ngayBatDau']),
                        'ngay_het_han'   => $convert_date($input['ngayHetHan']),
                        'trang_thai_don' => 'Hieu luc',
                        'muc_phi'        => 169000.00,
                        'ndbh_ho_ten'    => $input['ndbhHoTen'],
                        'ndbh_ngay_sinh' => $convert_date($input['ndbhNgaySinh']),
                        'ndbh_cccd'      => $cccd,
                        'ndbh_gioi_tinh' => $input['ndbhGioiTinh'] ?? null,
                        'ndbh_dia_chi'   => $input['ndbhDiaChi'] ?? null,
                        'ndbh_sdt'       => $input['ndbhSdt'] ?? null,
                        'ndbh_email'     => $input['ndbhEmail'] ?? null,
                        'nmbh_ho_ten'    => $input['nmbhHoTen'] ?? null,
                        'nmbh_dia_chi'   => $input['nmbhDiaChi'] ?? null,
                        'nmbh_sdt'       => $input['nmbhSdt'] ?? null,
                    ];

                    // Check if contract with this CCCD already exists
                    $existing_id = $wpdb->get_var($wpdb->prepare(
                        "SELECT id_hop_dong FROM $table_hopdong WHERE ndbh_cccd = %s",
                        $cccd
                    ));

                    if ($existing_id) {
                        // UPDATE existing contract
                        $result = $wpdb->update($table_hopdong, $data, ['id_hop_dong' => $existing_id]);
                        $message = 'Đã cập nhật thành công hợp đồng cho CCCD: ' . $cccd;
                    } else {
                        // INSERT new contract
                        $result = $wpdb->insert($table_hopdong, $data);
                        $message = 'Đã thêm thành công hợp đồng cho CCCD: ' . $cccd;
                    }

                    if ($result === false) {
                        return [
                            'success' => false,
                            'message' => 'Lỗi database: ' . $wpdb->last_error,
                        ];
                    }

                    return [
                        'success' => true,
                        'message' => $message,
                    ];
                }
            ]);
        });
    }
}
