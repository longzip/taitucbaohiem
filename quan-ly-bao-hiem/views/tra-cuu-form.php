<?php if (!defined('ABSPATH')) exit; ?>
<div class="qlbh-tra-cuu-box" style="background: #f8f9fa; padding: 25px; border: 1px solid #dee2e6; border-radius: 8px; margin: 20px auto; font-family: sans-serif; max-width: 500px;">
    <h3 style="margin-top:0; color:#1c7ed6; text-align:center;">CỔNG TRA CỨU HẠN DÙNG BẢO HIỂM</h3>
    <p style="font-size:13px; text-align:center; color:#e03131; font-weight:bold;">* Nhập chính xác 3 thông tin để xác minh danh tính bảo mật</p>

    <form method="post" action="" style="display: flex; flex-direction: column; gap: 12px; margin-top:15px;">
        <div>
            <label style="font-weight:bold; display:block; margin-bottom:5px;">1. Họ và tên (Ghi đúng chữ có dấu):</label>
            <input type="text" name="tc_ho_ten" value="<?php echo esc_attr($hoTen); ?>" placeholder="Ví dụ: Nguyễn Văn A" style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;" required>
        </div>
        <div>
            <label style="font-weight:bold; display:block; margin-bottom:5px;">2. Ngày tháng năm sinh:</label>
            <input type="date" name="tc_ngay_sinh" value="<?php echo esc_attr($ngaySinh); ?>" style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;" required>
        </div>
        <div>
            <label style="font-weight:bold; display:block; margin-bottom:5px;">3. Số định danh (CCCD hoặc Mã số BHXH):</label>
            <input type="text" name="tc_ma_dinh_danh" value="<?php echo esc_attr($ma_dinh_danh); ?>" placeholder="Nhập số căn cước hoặc mã sổ bảo hiểm..." style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;" required>
        </div>
        <input type="submit" value="Xác Minh & Tra Cứu" style="background: #1c7ed6; color: white; border: none; padding: 12px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size:15px;">
    </form>
</div>
