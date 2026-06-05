<?php
if (!defined('ABSPATH')) {
    exit;
}

class QLBHXH_DB {
    public static function create_tables() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        // Table for BHXH profiles (hoso)
        $table_name_hoso = $wpdb->prefix . 'qlbhxh_hoso';
        $sql_hoso = "CREATE TABLE $table_name_hoso (
            maSoBhxh VARCHAR(20) NOT NULL,
            hoTen VARCHAR(255) NOT NULL,
            ngaySinh VARCHAR(20) NULL,
            cmnd VARCHAR(20) NULL,
            soDienThoai VARCHAR(20) NULL,
            email VARCHAR(100) NULL,
            diaChi TEXT NULL,
            hoGiaDinh VARCHAR(50) NULL,
            ngayDk DATE NULL,
            maDonViBhxh VARCHAR(50) NULL,
            tenDonViBhxh VARCHAR(255) NULL,
            phuongAn VARCHAR(10) NULL,
            mucTienDong DECIMAL(20, 2) NULL,
            phuongThucDong VARCHAR(10) NULL,
            tuThangNam VARCHAR(7) NULL,
            thoiGianNhacDong DATE NULL,
            tiLeHoaHong DECIMAL(5, 2) NULL,
            ghiChu TEXT NULL,
            PRIMARY KEY (maSoBhxh)
        ) $charset_collate;";
        dbDelta($sql_hoso);

        // Table for payment history
        $table_name_lich_su = $wpdb->prefix . 'qlbhxh_lich_su_thanh_toan';
        $sql_lich_su = "CREATE TABLE $table_name_lich_su (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            maSoBhxh VARCHAR(20) NOT NULL,
            bienLaiId BIGINT(20) NULL,
            ngayLap DATETIME NULL,
            trangThaiHoSoName VARCHAR(255) NULL,
            tongTien DECIMAL(20, 2) NULL,
            tienHoaHong DECIMAL(20, 2) NULL,
            nguoiNop VARCHAR(255) NULL,
            tenThuTuc VARCHAR(255) NULL,
            userId BIGINT(20) NULL,
            noiDung TEXT NULL,
            maTraCuuQr VARCHAR(255) NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (maSoBhxh) REFERENCES $table_name_hoso(maSoBhxh) ON DELETE CASCADE
        ) $charset_collate;";
        dbDelta($sql_lich_su);
    }
}
?>