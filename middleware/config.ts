export const protectedRoutes = [
    {
      path: "/api/auth/register",
      roles: ["admin"],
    },
    {
      path: "/api/auth/logout",
      roles: ["user", "admin"],
    },
  ];
  