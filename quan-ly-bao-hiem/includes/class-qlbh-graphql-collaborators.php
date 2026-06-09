<?php
if (! defined('ABSPATH')) {
    exit;
}

class QLBH_GraphQL_Collaborators
{

    public function __construct()
    {
        add_action('graphql_register_types', [$this, 'register_types_and_queries']);
    }

    private function can_user_access_qlbh()
    {
        $current_user = wp_get_current_user();
        if (! $current_user || $current_user->ID === 0) {
            return false;
        }

        $allowed_roles = ['dai_ly_thu', 'cong_tac_vien', 'editor', 'administrator'];
        return ! empty(array_intersect((array) $current_user->roles, $allowed_roles));
    }

    public function register_types_and_queries()
    {
        register_graphql_object_type('Collaborator', [
            'description' => __('Một người dùng có vai trò trong hệ thống', 'qlbh'),
            'fields'      => [
                'label'         => ['type' => 'String'],
                'value'         => ['type' => 'String'],
                'maNhanVienThu' => ['type' => 'String'],
                'userIdBhxh'    => ['type' => 'String'],
                'vaiTro'        => ['type' => 'String'],
            ],
        ]);

        register_graphql_field('RootQuery', 'collaborators', [
            'type'        => ['list_of' => 'Collaborator'],
            'description' => __('Lấy danh sách người dùng có vai trò đại lý, ctv, editor, admin.', 'qlbh'),
            'resolve'     => function () {
                if (! $this->can_user_access_qlbh()) {
                    return [];
                }

                $users = get_users(['role__in' => ['dai_ly_thu', 'cong_tac_vien', 'editor', 'administrator'], 'orderby' => 'display_name']);
                if (empty($users)) {
                    return [];
                }

                $collaborators = array_map(function ($user) {
                    $maNhanVienThu = get_user_meta($user->ID, 'qlbh_ma_nhan_vien_thu', true);
                    $userIdBhxh    = get_user_meta($user->ID, 'qlbh_userid_bhxh', true);
                    $label         = ! empty($maNhanVienThu) ? $maNhanVienThu : $user->display_name;
                    $value         = ! empty($userIdBhxh) ? $userIdBhxh : $user->user_login;

                    $vaiTro = ! empty($user->roles[0]) ? $user->roles[0] : '';

                    return [
                        'label'         => $label,
                        'value'         => $value,
                        'maNhanVienThu' => $maNhanVienThu ?: '',
                        'userIdBhxh'    => $userIdBhxh ?: '',
                        'vaiTro'        => $vaiTro,
                    ];
                }, $users);

                $filtered = array_filter($collaborators, function ($c) {
                    return ! empty($c['label']) && ! empty($c['value']);
                });

                return array_values($filtered);
            },
        ]);
    }
}
