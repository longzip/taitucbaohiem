<?php if (!defined('ABSPATH')) exit; ?>
<div class="wrap">
    <h1>Thêm Người Tham Gia BHYT Mới</h1>
    <?php echo $thong_bao; ?>
    <form method="post" action=""><?php wp_nonce_field('qlbh_them_bhyt'); ?>
        <table class="form-table">
            <tr><th>Họ và Tên (Có dấu)</th><td><input type="text" name="hoTen" class="regular-text" placeholder="Nguyễn Văn A" required></td></tr>
            <tr><th>Ngày Tháng Năm Sinh</th><td><input type="date" name="ngaySinh" class="regular-text" required></td></tr>
            <tr><th>Số Căn Cước Công Dân (CCCD)</th><td><input type="text" name="soCmnd" class="regular-text" placeholder="Gồm 12 chữ số" required></td></tr>
            <tr><th>Số Điện Thoại Nhận Tin</th><td><input type="text" name="soDienThoai" class="regular-text" required></td></tr>
            <tr><th>Mã Số Thẻ BHYT</th><td><input type="text" name="soTheBhyt" class="regular-text" required></td></tr>
            !-- Chèn hàng này vào dưới hàng Mã số thẻ BHYT trong file views/them-moi-bhyt.php -->
<tr>
    <th>Mã Số Tờ Khai (Mẫu Hộ Gia Đình)</th>
    <td><input type="text" name="maTk" class="regular-text" placeholder="Ví dụ: TK-2026-0001"></td>
</tr>
            <tr><th>Địa Bàn (Thôn/Xóm)</th><td><input type="text" name="diaBan" class="regular-text" placeholder="Ví dụ: Thôn 1"></td></tr>
            <tr><th>Ngày Hết Hạn BHYT hiện tại</th><td><input type="date" name="denNgay" class="regular-text" required></td></tr>
            <tr><th>Ghi Chú Đặc Thù</th><td><textarea name="ghiChu" class="regular-text" rows="3"></textarea></td></tr>
        </table>
        <?php submit_button('Lưu Người Tham Gia BHYT', 'primary', 'qlbh_Luu_bhyt'); ?>
    </form>
</div>
