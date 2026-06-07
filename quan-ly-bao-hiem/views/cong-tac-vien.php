<?php if (!defined('ABSPATH')) exit; ?>
<div class="wrap">
    <h1>Bảng Xếp Hạng & Quản Lý Doanh Số Cộng Tác Viên</h1>

    <form method="get" action="" style="margin-bottom: 20px;">
        <input type="hidden" name="page" value="qlbh_ctv">
        <strong>Xem doanh số: </strong>
        <select name="thang_loc">
            <?php for($m=1; $m<=12; $m++) { echo '<option value="'.$m.'" '.selected($m,$thang_loc,false).'>Tháng '.$m.'</option>'; } ?>
        </select>
        <select name="nam_loc">
            <?php $ny=date('Y'); for($y=$ny-2; $y<=$ny+2; $y++) { echo '<option value="'.$y.'" '.selected($y,$nam_loc,false).'>Năm '.$y.'</option>'; } ?>
        </select>
        <input type="submit" class="button button-secondary" value="Xem báo cáo">
    </form>

    <table class="wp-list-table widefat fixed striped table-view-list">
        <thead>
            <tr>
                <th style="width: 80px;">Thứ Hạng</th>
                <th>Tên Cộng Tác Viên</th>
                <th>Số Lượt Đi Thu</th>
                <th>Tổng Tiền Mang Về (VNĐ)</th>
                <th>Tiền Hoa Hồng Tổng (VNĐ)</th>
            </tr>
        </thead>
        <tbody>
            <?php
            if (!empty($bxh_ctv)):
                $hang = 1;
                foreach ($bxh_ctv as $ctv):
                    if (empty($ctv->nguoi_thu) || $ctv->nguoi_thu == 'Tự động' || strpos($ctv->nguoi_thu, 'Bản thân') !== false) continue;
                    $badge = $hang;
                    if ($hang == 1) $badge = '🥇';
                    if ($hang == 2) $badge = '🥈';
                    if ($hang == 3) $badge = '🥉';
                    ?>
                    <tr>
                        <td><span style="font-size: 16px; font-weight: bold;"><?php echo $badge; ?></span></td>
                        <td><strong><?php echo esc_html($ctv->nguoi_thu); ?></strong></td>
                        <td><?php echo intval($ctv->so_luot); ?> lượt thu</td>
                        <td style="color:#1c7ed6; font-weight:bold;"><?php echo number_format($ctv->tong_thu); ?> đ</td>
                        <td style="color:#2b8a3e; font-weight:bold;"><?php echo number_format($ctv->tong_hoa_hong); ?> đ</td>
                    </tr>
                    <?php $hang++;
                endforeach;
                if ($hang == 1): echo '<tr><td colspan="5">Tháng này chưa có cộng tác viên nào nộp tiền.</td></tr>'; endif;
            else: echo '<tr><td colspan="5">Chưa có dữ liệu giao dịch nào.</td></tr>';
            endif; ?>
        </tbody>
    </table>
</div>
