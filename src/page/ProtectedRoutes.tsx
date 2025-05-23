// page/ProtectedRoutes.tsx
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import BlogAddEditForm from "./admin/blog/add";
import Blog from "./admin/blog";
import CategoryAddEditForm from "./admin/category/add";
import Category from "./admin/category";
import VerifyEmail from "./admin/verifyEmail/page";
import Register from "./admin/register/page";
import Login from "./admin/login/page";
import { ProgressIndicator } from "../components/ProgressIndicator";
import { useEffect, useState } from "react";
import { parseJwt } from "../utils/parseJwt";
import { DecodedToken } from "../utils/getUserPermissions";
import Cookies from "universal-cookie";

export default function ProtectedRoutes() {
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [permissions, setPermissions] = useState<any>({});
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("token");
  const location = useLocation();
  const decodedToken: DecodedToken = token ? parseJwt(token) : null;

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        const currentTime = Date.now() / 1000;
        const decodedToken: DecodedToken = token ? parseJwt(token) : null;

        if (decodedToken.exp < currentTime) {
          cookies.remove("token");
          navigate("/login");
        } else {
          setIsSuperAdmin(decodedToken.type === "company" || false);

          if (decodedToken.type !== "company") {
            const userPermissions: any = {};
            if (decodedToken?.roles) {
              decodedToken?.roles.forEach((role: any) => {
                role.permissions.forEach((permission: any) => {
                  userPermissions[permission.module] = permission.permissions;
                });
              });
            }
            setPermissions(userPermissions);
          }

          // Redirect logged-in users away from login and register pages
          if (
            location.pathname === "/login" ||
            location.pathname === "/register"
          ) {
            navigate("/");
          }
        }
      }
    };

    checkToken();
  }, [token, navigate, location.pathname]);

  if (
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    isSuperAdmin == null
  ) {
    return <ProgressIndicator open />;
  }

  const hasPermission = (module: string, action: string) => {
    return (
      Array.isArray(permissions[module]) && permissions[module].includes(action)
    );
  };

  const hasSubEmployeePermission = (module: string, action: string) => {
    const EmployeePermissions =
      decodedToken?.roles?.find((role) => role.name === "Employee")
        ?.permissions || [];

    const mainModule = EmployeePermissions.find(
      (perm) => perm.module === module
    );

    if (
      Array.isArray(mainModule?.permissions) &&
      mainModule?.permissions.includes(action)
    ) {
      return true;
    }

    if (Array.isArray(mainModule?.submodules)) {
      return mainModule?.submodules.some(
        (sub) =>
          Array.isArray(sub.permissions) && sub.permissions.includes(action)
      );
    }

    return false;
  };

  return (
    <Routes>
      {/* Auth pages */}
      {!token && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </>
      )}

      <Route path="/category" element={<Category />} />
      <Route path="/category/add" element={<CategoryAddEditForm />} />
      <Route path="/category/edit/:id" element={<CategoryAddEditForm />} />

      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/add" element={<BlogAddEditForm />} />
      <Route path="/blog/edit/:id" element={<BlogAddEditForm />} />
    </Routes>
  );
}
