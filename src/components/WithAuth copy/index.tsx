import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { setToken } from "../../redux/authSlice";
import { useLocation, useNavigate } from "react-router-dom";

type ProtectedPageProps = {
  children: ReactNode;
};

const WithAuth = ({ children }: ProtectedPageProps) => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const location = useLocation();
  const dispatch = useDispatch();
  // const getTokens = useSelector(getToken);

  const token = cookies.get("token");

  useEffect(() => {
    dispatch(setToken(token));

    if (
      !token &&
      location.pathname !== "/login" &&
      location.pathname !== "/verify-email" &&
      location.pathname !== "/register"
    ) {
      navigate("/login");
    } else if (location.pathname === "/login" && token) {
      navigate("/");
    }
  }, [dispatch, token, location.pathname, navigate, setToken]);

  if (
    (!token &&
      location.pathname !== "/login" &&
      location.pathname !== "/verify-email" &&
      location.pathname !== "/register") ||
    (location.pathname === "/login" && token)
  ) {
    return null;
  }

  return <>{children}</>;
};

export default WithAuth;
