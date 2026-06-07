<?php if (!defined('ABSPATH')) exit; ?>
<div class="alignleft actions">
    <?php if(empty($search_bhxh)):
         $thang_hien_tai = isset($_GET['thang_loc']) ? $_GET['thang_loc'] : date('n');
    ?>
        <form method="get" action="" style="margin:0;">
            <input type="hidden" name="page" value="qlbh_lich_su">
            <select name="thang_loc">
                <option value="" <?php selected($thang_hien_tai, ''); ?>>Cả năm</option>
                <?php for($m=1; $m<=12; $m++) { echo '<option value="'.$m.'" '.selected($m,$thang_hien_tai,false).'>Tháng '.$m.'</option>'; } ?>
            </select>
            <select name="nam_loc"><?php $ny=date('Y'); for($y=$ny-3; $y<=$ny+2; $y++) { echo '<option value="'.$y.'" '.selected($y,$nam_loc,false).'>Năm '.$y.'</option>'; } ?></select>
            <input type="submit" class="button button-secondary" value="Lọc">
        </form>
    <?php endif; ?>

    <form method="post" action="" style="margin:0;">
        <input type="submit" name="qlbh_xuat_excel" class="button button-primary" value="Xuất Excel (CSV)">
    </form>
</div>
