<?php
if (!defined('ABSPATH')) exit;

class QLBH_MIC_DB {
    
    public static function create_tables() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        $table_hopdong = $wpdb->prefix . 'qlbh_hopdong_mic';
        $table_lichsu  = $wpdb->prefix . 'qlbh_mic_lich_su_thu_tien';
        
        // Bảng gốc hợp đồng MIC
        $sql_hopdong = "CREATE TABLE $table_hopdong (
            id_hop_dong bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            so_hop_dong_mic varchar(50) DEFAULT NULL,
            ngay_bat_dau date NOT NULL,
            ngay_het_han date NOT NULL,
            muc_phi decimal(12,2) DEFAULT 169000.00,
            trang_thai_don enum('Hieu luc','Het han','Can tai tuc','Da thu tien') DEFAULT 'Can tai tuc',
            ndbh_ho_ten varchar(100) NOT NULL,
            ndbh_ngay_sinh date DEFAULT NULL,
            ndbh_cccd varchar(12) NOT NULL,
            ndbh_bhxh varchar(20) DEFAULT NULL,
            ndbh_gioi_tinh varchar(10) DEFAULT '',
            ndbh_dia_chi text DEFAULT '',
            ndbh_sdt varchar(15) DEFAULT '',
            ndbh_email varchar(100) DEFAULT '',
            nmbh_ho_ten varchar(100) DEFAULT '',
            nmbh_dia_chi text DEFAULT '',
            nmbh_sdt varchar(15) DEFAULT '',
            PRIMARY KEY  (id_hop_dong),
            UNIQUE KEY uk_so_hop_dong (so_hop_dong_mic),
            KEY idx_ndbh_cccd (ndbh_cccd),
            KEY idx_ndbh_bhxh (ndbh_bhxh),
            KEY idx_trang_thai_don (trang_thai_don),
            KEY idx_ngay_het_han_mic (ngay_het_han)
        ) $charset_collate;";

        // Bảng lịch sử dòng tiền biên lai
        $sql_lichsu = "CREATE TABLE $table_lichsu (
            id_log int(11) NOT NULL AUTO_INCREMENT,
            id_hop_dong bigint(20) UNSIGNED NOT NULL,
            ngay_thu datetime NOT NULL,
            so_tien_goc decimal(12,2) DEFAULT 169000.00,
            ti_le_hoa_hong decimal(5,2) DEFAULT 20.00,
            tien_hoa_hong_tich_luy decimal(12,2) DEFAULT 0.00,
            nhan_vien_thu varchar(60) NOT NULL,
            trang_thai_chi_tra varchar(20) DEFAULT 'Chua tra',
            thang_tinh_luong varchar(7) NOT NULL,
            so_hoa_don varchar(100) DEFAULT NULL,
            ma_tra_cuu varchar(255) DEFAULT NULL,
            trang_thai_nop_tien varchar(30) DEFAULT 'Cho duyet',
            phuong_thuc varchar(20) DEFAULT 'Chuyen khoan',
            ghi_chu text DEFAULT '',
            PRIMARY KEY  (id_log),
            KEY idx_id_hop_dong (id_hop_dong),
            KEY idx_nhan_vien (nhan_vien_thu)
        ) $charset_collate;";  
         
        dbDelta($sql_hopdong);
        dbDelta($sql_lichsu);
    }
}
