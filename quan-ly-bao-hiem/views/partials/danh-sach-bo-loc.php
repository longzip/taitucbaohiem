<?php if (!defined('ABSPATH')) exit; ?>
<form method="post" action="" style="margin: 15px 0;">
    <input type="search" name="s" value="<?php echo esc_attr($search_term); ?>" placeholder="Tìm tên, SĐT, mã BHYT, mã BHXH..." style="width:300px; height: 30px; vertical-align: middle;">
    <input type="submit" class="button button-secondary" value="Tìm kiếm">
    <?php if(!empty($search_term)): ?>
        <a href="<?php echo admin_url('admin.php?page=qlbh_danh_sach'); ?>" class="button">Xóa bộ lọc</a>
    <?php endif; ?>
</form>
