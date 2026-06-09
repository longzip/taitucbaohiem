<?php if (!defined('ABSPATH')) exit; ?>
<tr>
    <td><?php echo ($row->maSoBhxh ? esc_html($row->maSoBhxh) : '<span style="color:#aaa;">-</span>'); ?></td>
    <td><strong><?php echo esc_html($row->hoTen); ?></strong></td>
    <td><?php echo date('d/m/Y', strtotime($row->ngaySinhDt)); ?></td>
    <td><?php echo esc_html($row->gioiTinh); ?></td>
    <td><?php echo esc_html($row->soTheBhyt); ?></td>
    <td><?php echo date('d/m/Y', strtotime($row->tuNgayDt)); ?></td>
    <td><?php echo date('d/m/Y', strtotime($row->denNgayDt)); ?></td>
    <td><?php echo number_format($row->tongTien, 0, ',', '.'); ?></td>
    <td><?php echo esc_html($row->ghiChu); ?></td>
</tr>
