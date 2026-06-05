<?php
class QLBHXH_Import {

    public function __construct() {
        add_action('admin_menu', array($this, 'add_import_page'));
    }

    public function add_import_page() {
        add_menu_page(
            'Import Dữ Liệu BHXH',
            'Import BHXH',
            'manage_options',
            'qlbhxh-import',
            array($this, 'render_import_page'),
            'dashicons-database-import'
        );
    }

    public function render_import_page() {
        ?>
        <div class="wrap">
            <h1>Import Dữ Liệu BHXH từ JSON</h1>
            <form method="post">
                <p>Dán dữ liệu JSON vào ô bên dưới:</p>
                <p>
                    <textarea name="import_json" rows="15" class="widefat"></textarea>
                </p>
                <p>
                    <?php wp_nonce_field('qlbhxh_import_nonce', 'qlbhxh_import_nonce_field'); ?>
                    <input type="submit" name="submit_import" class="button button-primary" value="Import" />
                </p>
            </form>
            <?php $this->handle_import(); ?>
        </div>
        <?php
    }

    public function handle_import() {
        if (isset($_POST['submit_import']) && isset($_POST['qlbhxh_import_nonce_field']) && wp_verify_nonce($_POST['qlbhxh_import_nonce_field'], 'qlbhxh_import_nonce')) {
            if (!empty($_POST['import_json'])) {
                $json_data = stripslashes($_POST['import_json']);
                $data = json_decode($json_data, true);

                if (json_last_error() === JSON_ERROR_NONE && isset($data['items'])) {
                    global $wpdb;
                    $ho_so_table = $wpdb->prefix . 'qlbhxh_hoso';
                    $lich_su_table = $wpdb->prefix . 'qlbhxh_lich_su_thanh_toan';

                    $imported_count = 0;
                    $skipped_count = 0;
                    $updated_lich_su_count = 0;
                    $inserted_lich_su_count = 0;

                    foreach ($data['items'] as $item) {
                        if (isset($item['tenThuTuc']) && $item['tenThuTuc'] == '602') {

                            // Format data for ho_so table
                            $ngay_dk = !empty($item['ngayLap']) ? date('Y-m-d', strtotime($item['ngayLap'])) : null;
                            $tu_thang_nam = !empty($item['ky']) ? '20' . substr($item['ky'], 3, 2) . '-' . substr($item['ky'], 0, 2) : null;

                            // Data for ho_so table
                            $ho_so_data = array(
                                'maSoBhxh' => $item['maSoBHXH'],
                                'hoTen' => $item['hoTen'],
                                'ngaySinh' => $item['ngaySinh'],
                                'cmnd' => $item['cmnd'],
                                'ngayDk' => $ngay_dk,
                                'mucTienDong' => $item['tongTien'],
                                'tuThangNam' => $tu_thang_nam,
                                'ghiChu' => 'Số hồ sơ: ' . $item['soHoSo'] . ' | Trạng thái: ' . $item['trangThaiHoSoName'],
                            );

                            $wpdb->replace($ho_so_table, $ho_so_data);

                            // Data for lich_su table
                            $lich_su_data = array(
                                'maSoBhxh' => $item['maSoBHXH'],
                                'bienLaiId' => $item['bienLaiId'],
                                'ngayLap' => $item['ngayLap'],
                                'trangThaiHoSoName' => $item['trangThaiHoSoName'],
                                'tongTien' => $item['tongTien'],
                                'nguoiNop' => $item['nguoiNop'],
                                'tenThuTuc' => $item['tenThuTuc'],
                                'userId' => $item['userId'],
                                'noiDung' => $item['moTaKetQuaHoSo'],
                            );

                            // Check if bienLaiId exists
                            $existing_lich_su = $wpdb->get_var($wpdb->prepare("SELECT id FROM $lich_su_table WHERE bienLaiId = %d", $item['bienLaiId']));

                            if ($existing_lich_su) {
                                // Update existing record
                                $wpdb->update($lich_su_table, $lich_su_data, array('id' => $existing_lich_su));
                                $updated_lich_su_count++;
                            } else {
                                // Insert new record
                                $wpdb->insert($lich_su_table, $lich_su_data);
                                $inserted_lich_su_count++;
                            }

                            $imported_count++;
                        } else {
                            $skipped_count++;
                        }
                    }

                    if ($imported_count > 0) {
                        echo '<div class="updated"><p>Import thành công ' . $imported_count . ' bản ghi vào hồ sơ.</p>';
                        echo '<p>Lịch sử thanh toán: ' . $inserted_lich_su_count . ' bản ghi được thêm mới, ' . $updated_lich_su_count . ' bản ghi được cập nhật.</p></div>';
                    }
                    if ($skipped_count > 0) {
                        echo '<div class="notice notice-warning"><p>Bỏ qua ' . $skipped_count . ' bản ghi không có mã thủ tục 602.</p></div>';
                    }

                } else {
                    echo '<div class="error"><p>Dữ liệu JSON không hợp lệ hoặc không có mục \'items\'.</p></div>';
                }
            } elseif (isset($_POST['submit_import'])) {
                echo '<div class="error"><p>Vui lòng dán dữ liệu JSON để import.</p></div>';
            }
        }
    }
}
?>