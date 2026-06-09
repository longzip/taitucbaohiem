<?php if (!defined('ABSPATH')) exit; ?>
<table class="wp-list-table widefat fixed striped">
    <thead>
        <tr><th>Ngày Quét</th><th>Tên Khách Hàng</th><th>Gói Gần Hết</th><th>Trạng Thái Nhắc / Thu Tiền</th><th>Người Đi Thu</th><th>Ghi Chú Hệ Thống</th></tr>
    </thead>
    <tbody>
        <?php if(!empty($lich_su)): foreach($lich_su as $ls):
            $color = ($ls->loaiGiaoDich === 'BHYT') ? 'color:#0b7285;' : 'color:#e8590c;';
            $row_bg = ($ls->trangThaiNhac === 'Chưa nhắn Zalo') ? 'background-color: #fff3cd;' : '';

            preg_match('/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/', $ls->ghiChuDong, $matches);
            $ngay_in_tin_nhan = !empty($matches) ? $matches[0] : 'tháng sau';
            $loi_nhan_mau = "Kinh gui anh/chi " . $ls->hoTen . ", goi " . $ls->loaiGiaoDich . " cua anh/chi se het han vao ngay " . $ngay_in_tin_nhan . ". Vui long liên hệ với em để gia hạn nhé.";
            $url_danh_dau = admin_url('admin.php?page=qlbh_lich_su&action=da_nhan_zalo&ls_id=' . $ls->id);
            ?>
            <tr style="<?php echo $row_bg; ?>">
                <td><?php echo date('d/m/Y', strtotime($ls->ngayLap)); ?></td>
                <td><strong><?php echo esc_html($ls->hoTen); ?></strong> (<?php echo esc_html($ls->soDienThoai); ?>)</td>
                <td><b style="<?php echo $color; ?>"><?php echo $ls->loaiGiaoDich; ?></b></td>

                <td>
                <?php
                if ($ls->trangThaiNhac === 'Chưa nhắn Zalo') {
                    echo '<button type="button" class="button button-small button-primary" onclick="qlbhCopyVaChuyenHuong(this, ' . esc_attr(json_encode($loi_nhan_mau)) . ', \'' . esc_url($url_danh_dau) . '\')">⚠️ Nhắn Zalo</button>';
                } elseif ($ls->trangThaiNhac === 'Đã nhắn Zalo') {
                    include QLBH_PATH . 'views/partials/lich-su-form-thu-nhanh.php';
                } elseif ($ls->trangThaiNhac === 'Chờ kết quả BHXH') {
                    include QLBH_PATH . 'views/partials/lich-su-form-bien-lai.php';
                } else {
                    echo '<span style="color:#1c7ed6; font-weight:bold; display:block;">🎉 Đã gia hạn thành công</span>';
                    if($ls->soBienLai) {
                        echo '<small style="color:#666; display:block;">Số BL: '.$ls->soBienLai.'</small>';
                        echo '<small style="color:#666; display:block;">Mã TC: '.$ls->maTraCuu.'</small>';
                        if(!empty($ls->anh_bien_lai)) {
                            echo '<a href="' . esc_url($ls->anh_bien_lai) . '" target="_blank" class="button button-small" style="margin-top:4px;font-size:10px;height:22px;line-height:20px;">🖼️ Xem ảnh biên lai</a>';
                        }
                    }
                }
                ?>
                </td>
                <td><?php echo esc_html($ls->nguoiThu); ?></td>
                <td><?php echo esc_html($ls->ghiChuDong); ?></td>
            </tr>
        <?php endforeach; else: echo '<tr><td colspan="6">Không có dữ liệu giao dịch nào.</td></tr>'; endif; ?>
    </tbody>
</table>
