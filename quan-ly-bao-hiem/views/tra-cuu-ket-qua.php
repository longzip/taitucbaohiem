<?php if (!defined('ABSPATH')) exit; ?>
<div class="ket_qua_tra_cuu" style="border: 2px solid #2b8a3e; padding: 20px; border-radius: 8px; margin: 20px auto; max-width:500px; background:#fff; font-family: sans-serif;">
    <h4 style="color:#2b8a3e; margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px; text-align:center;">✔️ XÁC MINH THÀNH CÔNG</h4>
    <p><strong>Họ và Tên:</strong> <?php echo esc_html($khach->hoTen); ?></p>
    <p><strong>Số CCCD:</strong> <?php echo esc_html($khach->soCmnd); ?></p>
    <p><strong>Ngày sinh:</strong> <?php echo date('d/m/Y', strtotime($khach->ngaySinh)); ?></p>
    <p><strong>Địa bàn:</strong> <?php echo esc_html($khach->diaBan); ?></p>

    <div style="background:#e3fafc; padding:12px; border-radius:4px; margin-bottom:12px; border-left:4px solid #1098ad;">
        <strong>BẢO HIỂM Y TẾ HỘ GIA ĐÌNH:</strong><br>
        • Mã số thẻ: <?php echo esc_html($khach->soTheBhyt); ?><br>
        • Hạn sử dụng: <?php echo date('d/m/Y', strtotime($khach->denNgay)); ?> (<?php echo ($d_yt > 0) ? 'Còn hạn' : 'Hết hạn'; ?>)
    </div>

    <?php if (!empty($khach->maSoBhxh)):
        <div style="background:#fff4e6; padding:12px; border-radius:4px; margin-bottom:15px; border-left:4px solid #fd7e14;">
            <strong>BẢO HIỂM XÃ HỘI TỰ NGUYỆN:</strong><br>
            • Mã số sổ: <?php echo esc_html($khach->maSoBhxh); ?><br>
            • Hạn sử dụng: <?php echo date('d/m/Y', strtotime($khach->ngayHetHanBhxh)); ?> (<?php echo ($d_xh > 0) ? 'Còn hạn' : 'Hết hạn'; ?>)
        </div>
    <?php endif; ?>

    <h5 style="color:#495057; border-bottom:1px solid #eee; padding-bottom:5px; margin-bottom:8px;">LỊCH SỬ ĐÓNG PHÍ GẦN ĐÂY</h5>
    <?php if (!empty($ls_dong)):
        <table style="width:100%; border-collapse: collapse; font-size:12px;">
            <tr style="background:#f1f3f5;"><th style="padding:6px; border:1px solid #ddd;">Ngày đóng</th><th style="padding:6px; border:1px solid #ddd;">Gói nộp</th><th style="padding:6px; border:1px solid #ddd;">Số tiền</th><th style="padding:6px; border:1px solid #ddd;">Số biên lai BHXH</th></tr>
            <?php foreach ($ls_dong as $ls):
                <tr><td style="padding:6px; border:1px solid #ddd;"><?php echo date('d/m/Y', strtotime($ls->ngayLap)); ?></td><td style="padding:6px; border:1px solid #ddd;"><?php echo esc_html($ls->loaiGiaoDich); ?></td><td style="padding:6px; border:1px solid #ddd;"><?php echo number_format($ls->tongTien); ?> đ</td><td style="padding:6px; border:1px solid #ddd;"><?php echo $ls->soBienLai ? esc_html($ls->soBienLai) : '<i>Đang xử lý</i>'; ?></td></tr>
            <?php endforeach; ?>
        </table>
    <?php else: echo '<p style="color:#aaa; font-style:italic; font-size:12px;">Chưa ghi nhận lịch sử giao dịch.</p>'; endif; ?>
</div>
