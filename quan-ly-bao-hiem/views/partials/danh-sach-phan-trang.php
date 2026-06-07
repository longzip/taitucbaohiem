<?php if (!defined('ABSPATH')) exit; ?>
<div class="tablenav top">
    <div class="tablenav-pages">
        <span class="displaying-num">Trang <?php echo $trang_hien_tai; ?> / <?php echo $tong_so_trang; ?> (Tổng: <?php echo $tong_so_dong; ?> người)</span>
        <?php
        echo paginate_links(array(
            'base' => add_query_arg('paged', '%#%'),
            'format' => '',
            'prev_text' => __('&laquo; Trước'),
            'next_text' => __('Sau &raquo;'),
            'total' => $tong_so_trang,
            'current' => $trang_hien_tai
        ));
        ?>
    </div>
</div>
