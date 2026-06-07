<?php
if (!defined('ABSPATH')) exit;

class QLBH_Admin {
    public function __construct() {
        add_action('admin_menu', array($this, 'khoi_tao_menu'));
        add_action('admin_head', array($this, 'qlbh_css_dien_thoai'));
    }

    public function khoi_tao_menu() {
        add_menu_page('QL Bảo Hiểm', 'QL Bảo Hiểm', 'manage_options', 'qlbh_danh_sach', array($this, 'trang_danh_sach'), 'dashicons-businessman', 6);
        add_submenu_page('qlbh_danh_sach', 'Thêm Khách BHYT', 'Thêm Khách BHYT', 'manage_options', 'qlbh_them_moi', array($this, 'trang_them_moi_bhyt'));
        add_submenu_page('qlbh_danh_sach', 'Kích Hoạt BHXH', 'Kích Hoạt BHXH', 'manage_options', 'qlbh_kich_hoat_bhxh', array($this, 'trang_kich_hoat_bhxh'));
        add_submenu_page('qlbh_danh_sach', 'Dán JSON', 'Nhập Dữ Liệu JSON', 'manage_options', 'qlbh_json', array($this, 'trang_nhap_json'));
        add_submenu_page('qlbh_danh_sach', 'Dòng Tiền', 'Lịch Sử & Hoa Hồng', 'manage_options', 'qlbh_lich_su', array($this, 'trang_lich_su_hoa_hong'));
        add_submenu_page('qlbh_danh_sach', 'Doanh Số CTV', 'Doanh Số CTV', 'manage_options', 'qlbh_ctv', array($this, 'trang_quan_ly_ctv'));
        add_submenu_page('qlbh_danh_sach', 'Tối Ưu Hệ Thống', 'Tối Ưu Hệ Thống', 'manage_options', 'qlbh_toi_uu', array($this, 'trang_toi_uu_he_thong'));
        add_submenu_page(null, 'Chi Tiết Hộ', 'Chi Tiết Hộ', 'manage_options', 'qlbh_ho_gia_dinh', array($this, 'trang_chi_tiet_ho_gia_dinh'));
        add_submenu_page(null, 'Kích hoạt BHXH', 'Kích hoạt BHXH', 'manage_options', 'qlbh_kich_hoat_bhxh', array($this, 'trang_kich_hoat_bhxh'));

    }

    // Gọi các file xử lý chức năng nhỏ từ thư mục admin
    public function trang_danh_sach() { require_once QLBH_PATH . 'includes/admin/xu-ly-danh-sach.php'; }
    public function trang_them_moi_bhyt() { require_once QLBH_PATH . 'includes/admin/xu-ly-them-khach.php'; }
    public function trang_kich_hoat_bhxh() { require_once QLBH_PATH . 'includes/admin/kich-hoat-bhxh.php'; }
    public function trang_nhap_json() { require_once QLBH_PATH . 'includes/admin/xu-ly-json.php'; }
    public function trang_lich_su_hoa_hong() { require_once QLBH_PATH . 'includes/admin/xu-ly-dong-tien.php'; }
    public function trang_quan_ly_ctv() { require_once QLBH_PATH . 'includes/admin/xu-ly-ctv.php'; }
    public function trang_toi_uu_he_thong() { require_once QLBH_PATH . 'includes/admin/xu-ly-toi-uu.php'; }

    public function qlbh_css_dien_thoai() {
        echo '<style>@media screen and (max-width: 782px) { .wp-list-table { display: block; width: 100%; overflow-x: auto; } .form-table td input, .form-table td select { width: 100% !important; margin-bottom: 10px; } form table td { display: block; width: 100% !important; } } .wp-list-table th, .wp-list-table td { padding: 12px 10px !important; vertical-align: middle; }</style>';
    }

    public function trang_chi_tiet_ho_gia_dinh() {
      if (!current_user_can('manage_options')) wp_die('Chặn truy cập.');
      global $wpdb;
      $table_bhyt = $wpdb->prefix . 'bhyts';
      $table_bhxh = $wpdb->prefix . 'qlbh_bhxh_mo_rong';

      // Lấy mã tờ khai từ đường link url
      $ma_tk_loc = isset($_GET['ma_tk']) ? sanitize_text_field($_GET['ma_tk']) : '';

      // Truy vấn tất cả những ai có chung mã tờ khai này
      $thanh_vien = $wpdb->get_results($wpdb->prepare("
          SELECT b.*, x.maSoBhxh
          FROM $table_bhyt b
          LEFT JOIN $table_bhxh x ON b.maSoBhxh = x.maSoBhxh
          WHERE b.maToKhaiRieng = %s
          ORDER BY b.ngaySinhDt ASC
      ", $ma_tk_loc));

      // Gọi file view hiển thị danh sách hộ vừa tạo ra màn hình
      include QLBH_PATH . 'views/chi-tiet-ho-gia-dinh.php';
  }

}
new QLBH_Admin();
