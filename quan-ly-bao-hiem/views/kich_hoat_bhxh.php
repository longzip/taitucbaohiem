<?php if (!defined('ABSPATH')) exit; ?>
<div class="wrap">
    <h1>Kích Hoạt Mở Rộng Thẻ BHXH Tự Nguyện</h1>
    <?php echo $thong_bao; ?>
    <form method="post" action=""><?php wp_nonce_field('qlbh_kich_hoat_bhxh_nonce'); ?>
        <table class="form-table">
            <tr>
                <th>Chọn người tham gia</th>
                <td>
                    <select name="khach_hang_id" style="width:25em;" required>
                        <option value="">-- Chọn danh tính từ danh bạ BHYT gốc --</option>
                        <?php foreach($danh_sach_goc as $item) {
                            $selected = ($item->id == $khach_id_get) ? 'selected' : '';
                            echo '<option value="'.$item->id.'" '.$selected.'>'.$item->hoTen.'</option>';
                        } ?>
                    </select>
                </td>
            </tr>
            <tr><th>Mã Số Sổ BHXH Tự Nguyện</th><td><input type="text" name="ma_so_bhxh" class="regular-text" required></td></tr>
            <tr><th>Ngày Hết Hạn Đóng BHXH</th><td><input type="date" name="ngay_het_han_bhxh" class="regular-text" required></td></tr>
            <tr><th>Ghi Chú BHXH</th><td><textarea name="ghi_chu_bhxh" class="regular-text" rows="3"></textarea></td></tr>
        </table>
        <?php submit_button('Kích Hoạt BHXH Tự Nguyện', 'primary', 'qlbh_Luu_bhxh'); ?>
    </form>
</div>
