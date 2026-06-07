<?php if (!defined('ABSPATH')) exit; ?>
<div class="wrap">
    <h1 class="wp-heading-inline">Danh Sách Quản Lý Bảo Hiểm Toàn Diện</h1>
    <a href="<?php echo admin_url('admin.php?page=qlbh_them_moi'); ?>" class="page-title-action">Thêm Khách BHYT</a>
    <hr class="wp-header-end">

    <?php
    // Ghép các mảnh giao diện siêu nhỏ từ thư mục partials
    include QLBH_PATH . 'views/partials/danh-sach-bo-loc.php';
    include QLBH_PATH . 'views/partials/danh-sach-phan-trang.php';
    include QLBH_PATH . 'views/partials/danh-sach-bang.php';
    ?>
</div>
