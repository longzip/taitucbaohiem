<?php if (!defined('ABSPATH')) exit;
$ngay_hom_nay = current_time('Y-m-d');

// Tính hạn bảo hiểm y tế hộ gia đình
$diff_yt = date_diff(date_create($ngay_hom_nay), date_create($row->denNgayDt));
$days_yt = $diff_yt->format("%r%a");
$bg_yt = ($days_yt <= 10) ? 'background:#ffcccb;' : (($days_yt <= 30) ? 'background:#fff3cd;' : '');

// Tính hạn bảo hiểm xã hội tự nguyện mở rộng
$bg_xh = ''; $han_xh = '<i>Chưa tham gia</i>';
if (!empty($row->maSoBhxh)) {
    $diff_xh = date_diff(date_create($ngay_hom_nay), date_create($row->ngayHetHanBhxh));
    $days_xh = $diff_xh->format("%r%a");
    $bg_xh = ($days_xh <= 10) ? 'background:#ffcccb;' : (($days_xh <= 30) ? 'background:#fff3cd;' : '');
    $han_xh = date('d/m/Y', strtotime($row->ngayHetHanBhxh)) . ' (' . $days_xh . ' ngày)';
}
?>
<tr>
    <td><strong><?php echo esc_html($row->hoTen); ?></strong></td>
    <td><?php echo esc_html($row->soDienThoai); ?></td>
    <td><?php echo esc_html($row->diaChiLh); ?></td>
    <td>
    <?php if(!empty($row->maTk)): ?>
        <a href="<?php echo admin_url('admin.php?page=qlbh_ho_gia_dinh&ma_tk=' . urlencode($row->maTk)); ?>" style="font-weight:bold; color:#1c7ed6; text-decoration:none;" title="Bấm để xem cả hộ">
            📁 <?php echo esc_html($row->maTk); ?>
        </a>
    <?php else: ?>
        <span style="color:#aaa;">-</span>
    <?php endif; ?>
    </td>
    <td><?php echo esc_html($row->soTheBhyt); ?></td>
    <td style="<?php echo $bg_yt; ?>"><?php echo date('d/m/Y', strtotime($row->denNgayDt)); ?></td>
    <td><?php echo ($row->maSoBhxh ? esc_html($row->maSoBhxh) : '<span style="color:#aaa;">-</span>'); ?></td>
    <td style="<?php echo $bg_xh; ?>"><?php echo $han_xh; ?></td>
    <td>
        <?php if(empty($row->maSoBhxh)): ?>
            <a href="<?php echo admin_url('admin.php?page=qlbh_kich_hoat_bhxh&khach_id='.$row->id); ?>" class="button button-small button-primary">+ Thêm BHXH</a>
        <?php endif; ?>
        <a href="<?php echo admin_url('admin.php?page=qlbh_danh_sach&action=xoa&id=' . $row->id); ?>" class="button button-small" onclick="return confirm('Bạn có chắc chắn muốn xóa toàn bộ thông tin người này không?')">Xóa</a>
    </td>
</tr>
