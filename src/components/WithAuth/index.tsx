import React, { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { useLocation, useNavigate, matchPath } from "react-router-dom";
import { getToken, setToken } from "../../redux/authSlice";
import { parseJwt } from "../../utils/parseJwt";

// Routes accessible without authentication
const publicRoutes = ["/login", "/register", "/verify-email"];

interface WithAuthProps {
  children: ReactNode;
}
const WithAuth: React.FC<WithAuthProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const cookies = new Cookies();

  const reduxToken = useSelector(getToken);
  const [loading, setLoading] = useState(true);

  const isPublicRoute = publicRoutes.some((route) =>
    matchPath({ path: route, end: true }, location.pathname)
  );

  useEffect(() => {
    const cookieToken = cookies.get("token");
    const token = cookieToken || reduxToken;

    if (cookieToken && !reduxToken) {
      dispatch(setToken(cookieToken));
    }

    // No need to redirect if it's a public route
    if (isPublicRoute) {
      setLoading(false);
      return;
    }

    // For protected routes, check token
    if (!token) {
      navigate("/login", { replace: true });
      setLoading(false);
      return;
    }

    // Validate token expiration
    try {
      const { exp } = parseJwt(token);
      const now = Date.now().valueOf() / 1000;
      if (exp < now) {
        cookies.remove("token");
        dispatch(setToken(""));
        navigate("/login", { replace: true });
      }
    } catch {
      cookies.remove("token");
      dispatch(setToken(""));
      navigate("/login", { replace: true });
    }

    setLoading(false);
  }, [reduxToken, location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
export default WithAuth;
