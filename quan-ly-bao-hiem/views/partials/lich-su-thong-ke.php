<?php if (!defined('ABSPATH')) exit; ?>
<div style="display:flex; gap:20px; margin-bottom:20px; font-weight:bold;">
    <div style="background:#e7f5ff; padding:15px; border-left:4px solid #339af0; flex:1;">
        Tổng thu tháng <?php echo $thang_loc.'/'.$nam_loc; ?>: <?php echo number_format($tong_doanh_thu); ?> đ
    </div>
    <div style="background:#ebfbee; padding:15px; border-left:4px solid #40c057; flex:1;">
        Hoa hồng đút túi: <?php echo number_format($tong_hoa_hong); ?> đ
    </div>
</div>
