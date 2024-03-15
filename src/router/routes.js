const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/PageTraCuuBHYT.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/export-chi-tiet",
        component: () => import("src/pages/PageBaoCaoChiTietGiaoDich.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "old",
        component: () => import("src/pages/PageTheHT.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "khl2",
        component: () => import("src/pages/PageKHLNew.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "items",
        component: () => import("src/pages/PageItems.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "evn2",
        component: () => import("src/pages/PageEVN2.vue"),
        meta: { requireAuth: false },
      },
      {
        path: "dons",
        component: () => import("src/pages/PageDon.vue"),
        meta: { requireAuth: false },
      },
      {
        path: "/tai-tuc",
        component: () => import("pages/PageTaiTuc.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/tai-tuc-2",
        component: () => import("pages/PageTaiTuc2.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/het-han",
        component: () => import("pages/PageHetHan.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/dong-bo",
        component: () => import("pages/PageDongBo.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/settings",
        component: () => import("pages/PageSettings.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/phat-sinh",
        component: () => import("pages/PagePhatSinh.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/theo-doi",
        component: () => import("pages/PageStar.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/ngung-hoat-dong",
        component: () => import("pages/PageNgungHoatDong.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/tim-kiem",
        component: () => import("pages/PageTimKiem.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/ho-gia-dinh/:id",
        component: () => import("pages/PageHoGd.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/auth",
        name: "auth",
        component: () => import("pages/PageAuth.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/dang-nhap-ssm",
        name: "auth",
        component: () => import("pages/PageAuth2.vue"),
        meta: { requireAuth: false },
      },
      {
        path: "/dang-ky-142010",
        name: "dka",
        component: () => import("pages/PageAuth.vue"),
        meta: { requireAuth: false },
      },
      {
        path: "/tra-cuu/:id",
        component: () => import("pages/PageTraCuu.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/tra-cuu",
        component: () => import("pages/PageTraCuu.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/tra-cuu-tu-dong",
        component: () => import("pages/PageTraCuuAuto.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/ho-so-chua-xu-ly",
        component: () => import("pages/PageHoSoChuaXuLy.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/khach-hang-chua-nop",
        component: () => import("pages/PageKhachHangChuaNop.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/khach-hang-tai-tuc-bhxh",
        component: () => import("pages/PageDSKHTaiTuc.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/ho-so-da-xu-ly",
        component: () => import("pages/PageHoSoDaXuLy.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/ho-so-da-nop",
        component: () => import("pages/PageHoSoDaNopBDH.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/khl",
        component: () => import("pages/PageKhl.vue"),
        meta: { requireAuth: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
