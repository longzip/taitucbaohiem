<?php if (!defined('ABSPATH')) exit; ?>
<div style="background:#f1f3f5; padding:6px; border:1px solid #ced4da; border-radius:4px; width:200px;">
    <form method="post" action="" style="margin:0;"><?php wp_nonce_field('qlbh_form_thu_nhanh'); ?>
        <input type="hidden" name="ls_id" value="<?php echo $ls->id; ?>">
        <input type="number" name="so_tien_dong_nhanh" placeholder="Số tiền nộp" style="width:100%; margin-bottom:4px; height:24px;" required>
        <input type="date" name="ngay_het_han_moi_nhanh" title="Ngày hết hạn mới sau khi nộp tiền" style="width:100%; margin-bottom:4px; height:24px;" required>
        <select name="hinh_thuc_tt" style="width:100%; margin-bottom:4px; height:24px;" required>
            <option value="Chuyển khoản">🏦 Chuyển khoản</option>
            <option value="Tiền mặt">💵 Tiền mặt</option>
        </select>
        <input type="submit" name="qlbh_cap_nhat_thu_tien" class="button button-small button-primary" style="width:100%;" value="Thu -> Chờ BHXH">
    </form>
</div>
