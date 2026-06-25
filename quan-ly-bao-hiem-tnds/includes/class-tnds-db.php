<?php
if (!defined('ABSPATH')) {
    exit;
}

class QLBH_TNDS_DB {
    public static function create_tables() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'qlbh_tnds';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            userId bigint(20) unsigned DEFAULT NULL, -- Thêm cột userId liên kết với người dùng WordPress
            chuXeHoTen varchar(255) NOT NULL,
            soDienThoai varchar(20),
            email varchar(100),
            diaChi text,
            nmbhHoTen varchar(255),
            nmbhSdt varchar(20),
            bienSoXe varchar(50) NOT NULL,
            loaiXe varchar(50),
            hangXe varchar(100),
            phienBan varchar(100),
            soKhung varchar(100),
            soMay varchar(100),
            namSanXuat int,
            soCho int,
            trongTai float,
            mucDichSuDung varchar(255),
            ngayDangKy date,
            soGcn varchar(100),
            ngayBatDau date,
            ngayHetHan date,
            phiBaoHiem decimal(10, 2),
            trangThai varchar(100) DEFAULT 'Cần tái tục',
            ghiChu text,
            PRIMARY KEY  (id),
            UNIQUE KEY unique_bienSoXe (bienSoXe)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }
}
