<?php
if (!defined('ABSPATH')) exit;

class QLBH_DB {
    public static function tao_cac_bang_he_thong() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();

        $table_bhyt = $wpdb->prefix . 'bhyts';
        $table_bhxh = $wpdb->prefix . 'qlbh_bhxh_mo_rong';
        $table_lich_su = $wpdb->prefix . 'qlbh_lich_su_dong_tien';

        // Bảng gốc BHYT (camelCase)
        $sql_bhyt = "CREATE TABLE $table_bhyt (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            maSoBhxh varchar(191) NOT NULL,
            hoTen varchar(191) NOT NULL DEFAULT 'Noname',
            ngaySinhDt date DEFAULT NULL,
            gioiTinh tinyint(1) DEFAULT NULL,
            soCmnd varchar(191) DEFAULT NULL,
            maHoGd varchar(191) DEFAULT NULL,
            soDienThoai varchar(191) DEFAULT NULL,
            soDienThoai2 varchar(191) DEFAULT NULL,
            email varchar(191) DEFAULT NULL,
            facebook varchar(255) DEFAULT NULL,
            diaChiLh varchar(191) DEFAULT NULL,
            ghiChu text DEFAULT NULL,
            starRating tinyint(1) DEFAULT 0,
            trangThaiTaiTuc varchar(50) DEFAULT 'Chưa liên hệ',
            soTheBhyt varchar(191) DEFAULT NULL,
            tuNgayDt date DEFAULT NULL,
            denNgayDt date DEFAULT NULL,
            ngay5Nam date DEFAULT NULL,
            maKCB varchar(191) DEFAULT NULL,
            tenDvi varchar(191) DEFAULT NULL,
            maToKhaiRieng varchar(50) DEFAULT NULL,
            tongTien double DEFAULT 0,
            ngayLap date DEFAULT NULL,
            maBienLai varchar(50) DEFAULT NULL,
            maTraCuu varchar(100) DEFAULT NULL,
            soThang int(2) DEFAULT 12,
            nguoiThuMay varchar(20) DEFAULT NULL,
            userName varchar(191) DEFAULT NULL,
            completed tinyint(1) DEFAULT 0,
            thuTruoc tinyint(1) DEFAULT 0,
            ngayThuTruoc date DEFAULT NULL,
            soTienThuTruoc double DEFAULT 0,
            nhanVienThu varchar(50) DEFAULT NULL,
            ngayTraCuu datetime DEFAULT CURRENT_TIMESTAMP,
            createdAt timestamp NULL DEFAULT NULL,
            updatedAt timestamp NULL DEFAULT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY bhyts_masobhxh_unique (maSoBhxh),
            KEY idx_hoTen (hoTen)
        ) $charset_collate;";

        // Bảng mở rộng BHXH (camelCase)
        $sql_bhxh = "CREATE TABLE $table_bhxh (
            maSoBhxh varchar(50) NOT NULL,
            ngayHetHanBhxh date NOT NULL,
            ghiChuBhxh text,
            ngayDk DATE NULL,
            maDonViBhxh VARCHAR(50) NULL,
            tenDonViBhxh VARCHAR(255) NULL,
            phuongAn VARCHAR(10) NULL,
            mucTienDong DECIMAL(20, 2) NULL,
            phuongThucDong VARCHAR(10) NULL,
            tuThangNam VARCHAR(7) NULL,
            PRIMARY KEY  (maSoBhxh)
        ) $charset_collate;";

        // Bảng nhật ký đóng tiền và hoa hồng (camelCase)
        $sql_lich_su = "CREATE TABLE $table_lich_su (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            khachHangId bigint(20) NOT NULL,
            loaiGiaoDich varchar(20) NOT NULL,
            ngayLap datetime NOT NULL,
            tongTien double NOT NULL,
            phanTramHoaHong float NOT NULL,
            tienHoaHong int(11) NOT NULL,
            nguoiThu varchar(100) DEFAULT '',
            soBienLai varchar(50) DEFAULT '',
            maTraCuu varchar(100) DEFAULT '',
            ngayDuKienGiaHan date,
            ghiChuDong text,
            trangThaiNhac varchar(50) DEFAULT 'Chưa nhắn Zalo',
            hinhThucTt varchar(50) DEFAULT '',
            anhBienLai varchar(255) DEFAULT '',
            PRIMARY KEY  (id),
            KEY khachHangId (khachHangId)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql_bhyt);
        dbDelta($sql_bhxh);
        dbDelta($sql_lich_su);

        if (!wp_next_scheduled('qlbh_cronjob_quet_hang_ngay')) {
            wp_schedule_event(strtotime('08:00:00'), 'daily', 'qlbh_cronjob_quet_hang_ngay');
        }
    }
}
