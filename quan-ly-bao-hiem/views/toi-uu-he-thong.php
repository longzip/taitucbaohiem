<?php if (!defined('ABSPATH')) exit; ?>
<div class="wrap">
    <h1>Tối Ưu Hệ Thống & Lưu Trữ Dữ Liệu Cũ</h1>
    <?php echo $thong_bao; ?>

    <div style="background:#fff; padding:20px; border:1px solid #ccd0d4; margin-bottom:20px; max-width:600px;">
        <h3>1. Giải phóng bộ nhớ đệm (Clean Cache)</h3>
        <p class="description">Xóa sạch các tệp dữ liệu rác tạm thời để website hoạt động nhẹ và nhanh hơn.</p>
        <form method="post" action=""><?php wp_nonce_field('qlbh_clean_cache_nonce'); ?>
            <input type="submit" name="qlbh_clean_cache" class="button button-secondary" value="Dọn dẹp rác hệ thống">
        </form>
    </div>

    <div style="background:#fff5f5; padding:20px; border:1px solid #ffe3e3; max-width:600px;">
        <h3 style="color:#c92a2a;">2. Đóng gói lưu trữ nhật ký đóng phí cũ</h3>
        <p class="description">Xuất toàn bộ lịch sử thu tiền của năm cũ ra file Excel (CSV) để lưu trữ trên máy tính, đồng thời giải nén làm sạch cơ sở dữ liệu trên trang web.</p>
        <form method="post" action="" onsubmit="return confirm('Bạn có chắc chắn muốn xuất file và xóa dữ liệu chạy của năm cũ không? Hãy nhớ lưu kỹ file tải về!');"><?php wp_nonce_field('qlbh_archive_nonce'); ?>
            <label>Chọn năm đóng gói:</label><br><br>
            <select name="nam_archive" style="width:150px; margin-bottom:10px;">
                <?php $nam_truoc = date('Y') - 1; for($y = $nam_truoc; $y >= $nam_truoc - 2; $y--) { echo '<option value="'.$y.'">Năm '.$y.'</option>'; } ?>
            </select><br>
            <input type="submit" name="qlbh_archive_data" class="button button-primary" style="background:#c92a2a; border-color:#c92a2a;" value="Xuất file & Nén dữ liệu cũ">
        </form>
    </div>
</div>
