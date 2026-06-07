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
      {
        path: "/mic",
        component: () => import("src/pages/QuanLyTaiTucMic.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "/tnds",
        component: () => import("src/pages/QuanLyBaoHiemTNDS.vue"),
        meta: { requireAuth: true },
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', name: 'auth', component: () => import('pages/PageAuth.vue'), meta: { requireAuth: false } }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
