import { Outlet, useLocation } from "react-router-dom";

function AuthLayout() {
  const { pathname } = useLocation();

  if (pathname === "/login") {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;