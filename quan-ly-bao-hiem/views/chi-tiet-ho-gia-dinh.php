<?php if (!defined('ABSPATH')) exit; ?>
<div class="wrap">
    <h1>Thành Viên Hộ Gia Đình: <?php echo esc_html($ma_tk_loc); ?></h1>
    <p><a href="<?php echo admin_url('admin.php?page=qlbh_danh_sach'); ?>" class="button">&laquo; Quay lại danh sách tổng</a></p>

    <p class="description">Tìm thấy **<?php echo count($thanh_vien); ?>** thành viên đăng ký chung tờ khai này.</p>

    <table class="wp-list-table widefat fixed striped">
        <thead>
            <tr>
                <th>Họ và Tên</th>
                <th>Ngày Sinh</th>
                <th>Số CCCD</th>
                <th>Số Điện Thoại</th>
                <th>Mã Số BHYT</th>
                <th>Hạn Dùng BHYT</th>
                <th>Mã Số BHXH</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($thanh_vien as $tv):
                $ngay_hom_nay = current_time('Y-m-d');
                $diff = date_diff(date_create($ngay_hom_nay), date_create($tv->denNgayDt));
                $days = $diff->format("%r%a");
                $bg = ($days <= 10) ? 'background:#ffcccb;' : (($days <= 30) ? 'background:#fff3cd;' : '');
                ?>
                <tr>
                    <td><strong><?php echo esc_html($tv->hoTen); ?></strong></td>
                    <td><?php echo date('d/m/Y', strtotime($tv->ngaySinhDt)); ?></td>
                    <td><?php echo esc_html($tv->soCmnd); ?></td>
                    <td><?php echo esc_html($tv->soDienThoai); ?></td>
                    <td><?php echo esc_html($tv->soTheBhyt); ?></td>
                    <td style="<?php echo $bg; ?>"><?php echo date('d/m/Y', strtotime($tv->denNgayDt)); ?></td>
                    <td><?php echo $tv->maSoBhxh ? esc_html($tv->maSoBhxh) : '-'; ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
