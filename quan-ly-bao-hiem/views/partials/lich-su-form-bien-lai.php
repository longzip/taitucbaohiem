<?php if (!defined('ABSPATH')) exit; ?>
<div style="background:#fff9db; padding:6px; border:1px solid #ffe066; border-radius:4px; width:200px;">
    <span style="color:#f59f00; font-weight:bold; display:block; margin-bottom:4px; font-size:11px;">⏳ Chờ BHXH</span>
    <form method="post" action="" enctype="multipart/form-data" style="margin:0;"><?php wp_nonce_field('qlbh_form_duyet_bien_lai'); ?>
        <input type="hidden" name="ls_id_duyet" value="<?php echo $ls->id; ?>">
        <input type="text" name="so_bien_lai" placeholder="Số biên lai" style="width:100%; margin-bottom:4px; height:24px;" required>
        <input type="text" name="ma_tra_cuu" placeholder="Mã tra cứu" style="width:100%; margin-bottom:4px; height:24px;" required>

        <label style="font-size:10px; display:block; margin-bottom:2px;">Tải ảnh cuống chụp:</label>
        <input type="file" name="file_anh_bien_lai" accept="image/*" style="font-size:10px; width:100%; margin-bottom:5px;">

        <input type="submit" name="qlbh_hoan_thanh_gia_han" class="button button-small" style="width:100%; background:#2b8a3e; color:#fff; border-color:#2b8a3e;" value="✔️ Hoàn thành">
    </form>
</div>
