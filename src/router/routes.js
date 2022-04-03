const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
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
        meta: { requireAuth: false },
      },
      {
        path: "/tra-cuu/:id",
        component: () => import("pages/PageTraCuu.vue"),
        meta: { requireAuth: false },
      },
      {
        path: "/tra-cuu",
        component: () => import("pages/PageTraCuu.vue"),
        meta: { requireAuth: false },
      },
      {
        path: "/tra-cuu-tu-dong",
        component: () => import("pages/PageTraCuuAuto.vue"),
        meta: { requireAuth: false },
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
