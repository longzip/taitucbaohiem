<?php if (!defined('ABSPATH')) exit; ?>
<table class="wp-list-table widefat fixed striped table-view-list">
    <thead>
        <tr>
            <th>Mã số BHXH</th>
            <th>Họ Tên</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Mã thẻ BHYT</th>
            <th>Từ ngày ĐT</th>
            <th>Đến ngày ĐT</th>
            <th>Tổng tiền</th>
            <th>Ghi chú</th>
        </tr>
    </thead>
    <tbody>
        <?php if (!empty($results)): foreach ($results as $row):
            include QLBH_PATH . 'views/partials/danh-sach-dong.php';
        endforeach; else: ?>
            <tr><td colspan="9">Không có dữ liệu khách hàng nào phù hợp.</td></tr>
        <?php endif; ?>
    </tbody>
</table>
