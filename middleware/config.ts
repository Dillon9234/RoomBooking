export const protectedRoutes = [
  {
    path: /^\/api\/auth\/register$/,
    roles: ["admin"],
  },
  {
    path: /^\/api\/auth\/logout$/,
    roles: ["user", "admin"],
  },
  {
    path: /^\/api\/bookroom$/,
    roles: ["user", "admin"],
  },
  {
    path: /^\/api\/building\/new$/,
    roles: ["admin"],
  },
  {
    path: /^\/api\/building\/\w+\/edit$/,
    roles: ["admin"],
  },
  {
    path: /^\/api\/building\/\w+\/room\/new$/,
    roles: ["admin"],
  },
  {
    path: /^\/api\/building\/\w+\/room\/\w+\/edit$/,
    roles: ["admin"],
  },
];
