<?php if (!defined('ABSPATH')) exit; ?>
<table class="wp-list-table widefat fixed striped table-view-list">
    <thead>
        <tr>
            <th>Họ và Tên</th><th>Số Điện Thoại</th><th>Địa Bàn</th><th>Mã Tờ Khai</th>
            <th>Mã Số BHYT</th><th>Hạn BHYT</th>
            <th>Mã Số BHXH</th><th>Hạn BHXH</th><th>Hành Động</th>
        </tr>
    </thead>
    <tbody>
        <?php if (!empty($results)): foreach ($results as $row):
            include QLBH_PATH . 'views/partials/danh-sach-dong.php';
        endforeach; else: ?>
            <tr><td colspan="8">Không có dữ liệu khách hàng nào phù hợp.</td></tr>
        <?php endif; ?>
    </tbody>
</table>
