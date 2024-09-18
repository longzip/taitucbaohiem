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
        path: "/settings",
        component: () => import("pages/PageSettings.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/ho-gia-dinh/:id",
        component: () => import("pages/PageHoGd.vue"),
        meta: { requireAuth: true },
      },

      {
        path: "/ho-so-chua-xu-ly",
        component: () => import("pages/PageHoSoChuaXuLy.vue"),
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
    ],
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

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
