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
        path: "/ho-gia-dinh/:id",
        component: () => import("pages/PageHoGd.vue"),
        meta: { requireAuth: true },
      },
    ],
  },
  // {
  //   path: "/dang-nhap-ssm",
  //   name: "auth",
  //   component: () => import("pages/PageAuth2.vue"),
  //   meta: { requireAuth: true },
  // },
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
