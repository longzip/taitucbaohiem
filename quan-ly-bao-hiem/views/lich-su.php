<?php if (!defined('ABSPATH')) exit; ?>
<div class="wrap">
    <h1>Quản Lý Nhật Ký Thu Tiền & Hoa Hồng</h1>
    <?php
    echo $thong_bao;
    include QLBH_PATH . 'views/partials/lich-su-bo-loc.php';
    include QLBH_PATH . 'views/partials/lich-su-thong-ke.php';
    include QLBH_PATH . 'views/partials/lich-su-bang.php';
    ?>
</div>
