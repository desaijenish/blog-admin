import React, { ReactNode, useEffect, useState, useRef } from "react";
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
  const lastCookieToken = useRef<string | undefined>(cookies.get("token"));

  const isPublicRoute = publicRoutes.some((route) =>
    matchPath({ path: route, end: true }, location.pathname)
  );

  useEffect(() => {
    const cookieToken = cookies.get("token");
    const token = cookieToken || reduxToken;

    if (cookieToken && !reduxToken) {
      dispatch(setToken(cookieToken));
    }

    if (!token && !isPublicRoute) {
      if (location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
      setLoading(false);
      return;
    }

    if (token) {
      let isValid = true;
      try {
        const { exp } = parseJwt(token);
        const now = Date.now().valueOf() / 1000;
        if (exp < now) isValid = false;
      } catch {
        isValid = false;
      }

      if (!isValid) {
        cookies.remove("token");
        dispatch(setToken(""));
        if (location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
        setLoading(false);
        return;
      }

      if (isPublicRoute) {
        if (location.pathname !== "/blog") {
          navigate("/blog", { replace: true });
        }
        setLoading(false);
        return;
      }
    }

    setLoading(false);
  }, [reduxToken, location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = cookies.get("token");
      if (lastCookieToken.current && !current) {
        dispatch(setToken(""));
        if (!isPublicRoute) navigate("/login", { replace: true });
      }
      lastCookieToken.current = current;
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, navigate, isPublicRoute]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default WithAuth;
