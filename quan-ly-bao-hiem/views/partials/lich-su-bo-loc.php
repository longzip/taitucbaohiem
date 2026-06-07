<?php if (!defined('ABSPATH')) exit; ?>
<div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
    <form method="post" action="" style="margin:0;">
        <strong>Tra cứu: </strong>
        <input type="text" name="s_bhxh" value="<?php echo esc_attr($search_bhxh); ?>" placeholder="Nhập mã số BHXH cần tra..." style="width:220px; height: 28px;">
        <input type="submit" class="button button-secondary" value="Tìm lịch sử">
        <?php if(!empty($search_bhxh)): ?>
            <a href="<?php echo admin_url('admin.php?page=qlbh_lich_su'); ?>" class="button">Xóa lọc</a>
        <?php endif; ?>
    </form>

    <?php if(empty($search_bhxh)): ?>
    <form method="get" action="" style="margin:0;">
        <input type="hidden" name="page" value="qlbh_lich_su">
        <select name="thang_loc"><?php for($m=1; $m<=12; $m++) { echo '<option value="'.$m.'" '.selected($m,$thang_loc,false).'>Tháng '.$m.'</option>'; } ?></select>
        <select name="nam_loc"><?php $ny=date('Y'); for($y=$ny-2; $y<=$ny+2; $y++) { echo '<option value="'.$y.'" '.selected($y,$nam_loc,false).'>Năm '.$y.'</option>'; } ?></select>
        <input type="submit" class="button button-secondary" value="Lọc">
    </form>
    <?php endif; ?>

    <form method="post" action="" style="margin:0;">
        <input type="submit" name="qlbh_xuat_excel" class="button button-primary" value="Xuất Excel (CSV)">
    </form>
</div>
