<?php if (!defined('ABSPATH')) exit; ?>
<div style="background:#fff; padding:20px; margin-bottom:20px; border:1px solid #ccd0d4;">
    <h3>Ghi Nhận Đợt Đóng Phí Mới</h3>
    <form method="post" action=""><?php wp_nonce_field('qlbh_form_thu_tien_v4'); ?>
        <select name="khach_hang_id" required>
            <option value="">-- Chọn khách hàng --</option>
            <?php foreach($khach_hangs as $kh) { echo '<option value="'.$kh->id.'">'.$kh->ho_ten.'</option>'; } ?>
        </select>

        <select name="loai_giao_dich" id="loai_gd_select" required>
            <option value="">-- Thu cho gói nào? --</option>
            <option value="BHYT">BHYT Hộ gia đình</option>
            <option value="BHXH">BHXH Tự nguyện</option>
        </select>

        <input type="number" name="so_tien_dong" placeholder="Số tiền thu" required>
        <input type="number" step="0.1" name="phan_tram_hoa_hong" id="phan_tram_input" placeholder="% hoa hồng" required>
        <input type="text" name="nguoi_thu" placeholder="Người thu (CTV)"><br><br>
        <input type="date" name="ngay_dong" value="<?php echo current_time('Y-m-d'); ?>" required>
        <input type="date" name="ngay_het_han_moi" title="Hạn sử dụng mới sau khi đóng tiền" required>
        <input type="text" name="ghi_chu_dong" placeholder="Ghi chú">
        <?php submit_button('Ghi Giao Dịch', 'primary', 'qlbh_ghi_thu_v4', false); ?>
    </form>
</div>

<script>
document.getElementById('loai_gd_select').addEventListener('change', function() {
    var val = this.value; var input = document.getElementById('phan_tram_input');
    if (val === "BHYT") { input.value = 3.5; } else if (val === "BHXH") { input.value = 5.0; } else { input.value = ""; }
});

function qlbhCopyVaChuyenHuong(nutBam, loiNhan, urlChuyenHuong) {
    navigator.clipboard.writeText(loiNhan).then(function() {
        alert("Đã sao chép nội dung nhắc phí! Hệ thống sẽ chuyển hướng và đánh dấu.");
        window.location.href = urlChuyenHuong;
    }, function(err) {
        alert("Không thể tự động sao chép: " + loiNhan);
    });
}
</script>
