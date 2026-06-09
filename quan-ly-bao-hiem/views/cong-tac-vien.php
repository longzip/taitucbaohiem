<?php if (!defined('ABSPATH')) exit; ?>
<div class="wrap">
    <h1 class="wp-heading-inline">Doanh số Cộng tác viên (CTV)</h1>

    <div class="alignleft actions">
        <form method="get" action="">
            <input type="hidden" name="page" value="qlbh_ctv">
            <select name="thang_loc">
                <option value="" <?php selected($thang_loc, ''); ?>>Cả năm</option>
                <?php
                for ($m = 1; $m <= 12; $m++) {
                    echo '<option value="' . $m . '" ' . selected($m, $thang_loc, false) . '>Tháng ' . $m . '</option>';
                }
                ?>
            </select>
            <select name="nam_loc">
                <?php
                $ny = date('Y');
                for ($y = $ny - 3; $y <= $ny + 2; $y++) {
                    echo '<option value="' . $y . '" ' . selected($y, $nam_loc, false) . '>Năm ' . $y . '</option>';
                }
                ?>
            </select>
            <input type="submit" class="button button-secondary" value="Lọc">
        </form>
    </div>

    <table class="wp-list-table widefat fixed striped">
        <thead>
            <tr>
                <th>Hạng</th>
                <th>Tên CTV</th>
                <th>Số lượt thu</th>
                <th>Tổng doanh thu</th>
                <th>Tổng hoa hồng</th>
            </tr>
        </thead>
        <tbody>
            <?php if (!empty($bxh_ctv)):
                $i=1;
                foreach ($bxh_ctv as $ctv) : ?>
                    <tr>
                        <td><?php echo $i++; ?></td>
                        <td><?php echo esc_html($ctv->nguoi_thu); ?></td>
                        <td><?php echo esc_html($ctv->so_luot); ?></td>
                        <td><?php echo number_format($ctv->tong_thu, 0, ',', '.'); ?> đ</td>
                        <td><?php echo number_format($ctv->tong_hoa_hong, 0, ',', '.'); ?> đ</td>
                    </tr>
            <?php endforeach; else: ?>
                <tr><td colspan="5">Không có dữ liệu cho lựa chọn này.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>
