<?php
if (! defined('ABSPATH')) {
    exit;
}

// Helper function to sanitize date values
if (! function_exists('qlbh_sanitize_date_db')) {
    function qlbh_sanitize_date_db($date_string)
    {
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

class QLBH_GraphQL_Sync_Customer
{
    public function __construct()
    {
        add_action('graphql_register_types', [$this, 'register_mutation']);
    }

    public function register_mutation()
    {
        register_graphql_mutation('syncCustomer', [
            'description'         => __("Đồng bộ hóa dữ liệu khách hàng từ một nguồn bên ngoài như VNPost.", 'qlbh'),
            'inputFields'         => [
                // Fields from VNPost Extension
                'maSoBhxh'        => ['type' => ['non_null' => 'String']],
                'hoVaTen'         => ['type' => 'String'],
                'ngaySinh'        => ['type' => 'String'],
                'gioiTinhHienThi' => ['type' => 'String'],
                'maSoThe'         => ['type' => 'String'],
                'hanTheTuNgay'    => ['type' => 'String'],
                'hanTheDenNgay'   => ['type' => 'String'],
                'thoiDiem5Nam'    => ['type' => 'String'],
                'coSoKCB'         => ['type' => 'String'],
                'tenDonVi'        => ['type' => 'String'],
                'maQuanLy'        => ['type' => 'String'],
                'soCmnd'          => ['type' => 'String'],
                'diaChiLh'        => ['type' => 'String'],
                'soDienThoai'     => ['type' => 'String'],
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
                $data             = [];
                $add_if_not_empty = function ($key, $value, $is_date = false) use (&$data) {
                    $val = trim((string) $value);
                    if ($val !== '' && $val !== 'null' && $val !== 'undefined') {
                        $data[$key] = $is_date ? qlbh_sanitize_date_db($val) : sanitize_text_field($val);
                    }
                };

                // Map input fields from the extension to database columns
                $add_if_not_empty('hoTen', $input['hoVaTen'] ?? null);
                $add_if_not_empty('ngaySinhDt', $input['ngaySinh'] ?? null, true);
                $add_if_not_empty('soTheBhyt', $input['maSoThe'] ?? null);
                $add_if_not_empty('tuNgayDt', $input['hanTheTuNgay'] ?? null, true);
                $add_if_not_empty('denNgayDt', $input['hanTheDenNgay'] ?? null, true);
                $add_if_not_empty('ngay5Nam', $input['thoiDiem5Nam'] ?? null, true);
                $add_if_not_empty('maKCB', $input['coSoKCB'] ?? null);
                $add_if_not_empty('tenDvi', $input['tenDonVi'] ?? null);
                $add_if_not_empty('soCmnd', $input['soCmnd'] ?? null);
                $add_if_not_empty('diaChiLh', $input['diaChiLh'] ?? null);
                $add_if_not_empty('soDienThoai', $input['soDienThoai'] ?? null);

                // Special handling for gender
                if (! empty($input['gioiTinhHienThi'])) {
                    $data['gioiTinh'] = (trim($input['gioiTinhHienThi']) === 'Nam') ? 1 : 0;
                }

                $data['ngayTraCuu'] = current_time('mysql');
                $data['updated_at'] = current_time('mysql');

                if ($exists) {
                    if (! empty($data)) {
                        $wpdb->update($table, $data, ['id' => $exists->id]);
                        $msg = "✅ Đã cập nhật thông tin cho: " . ($data['hoTen'] ?? $exists->hoTen);
                    } else {
                        $msg = "ℹ️ Không có dữ liệu mới để cập nhật.";
                    }
                } else {
                    $data['maSoBhxh']        = $maSo;
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
    }
}
