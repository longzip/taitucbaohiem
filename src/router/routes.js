const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      // {
      //   path: "/contacts",
      //   component: () => import("pages/PageContacts.vue"),
      // },
      {
        path: "/settings",
        component: () => import("pages/PageSettings.vue"),
      },
      {
        path: "/tra-cuu",
        component: () => import("pages/PageTraCuu.vue"),
      },
      {
        path: "/phat-sinh",
        component: () => import("pages/PagePhatSinh.vue"),
      },
      {
        path: "/tim-kiem",
        component: () => import("pages/PageTimKiem.vue"),
      },
      {
        path: "/ho-gia-dinh/:id",
        component: () => import("pages/PageHoGd.vue"),
      },
      { path: "/auth", component: () => import("pages/PageAuth.vue") },
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
