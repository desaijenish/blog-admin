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

  // Define public routes
  const publicRoutes = ["/login", "/register", "/verify-email"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        const currentTime = Date.now() / 1000;
        const decodedToken: DecodedToken = parseJwt(token);

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
          if (isPublicRoute) {
            navigate("/");
          }
        }
      }
    };

    checkToken();
  }, [token, navigate, location.pathname]);

  // Only show loading for protected routes when checking token
  if (!isPublicRoute && isSuperAdmin == null && token) {
    return <ProgressIndicator open />;
  }
  return (
    <Routes>
      {/* Public routes accessible without token */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected routes */}
      {token && (
        <>
          <Route path="/category" element={<Category />} />
          <Route path="/category/add" element={<CategoryAddEditForm />} />
          <Route path="/category/edit/:id" element={<CategoryAddEditForm />} />

          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/add" element={<BlogAddEditForm />} />
          <Route path="/blog/edit/:id" element={<BlogAddEditForm />} />
        </>
      )}

      {/* Redirect to login for protected routes without token */}
      {!token && !isPublicRoute && (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}
