import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/authSlice";

const useSignOut = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      // explicitly include the same path/domain options used when setting the cookie:
      cookies.remove("token", { path: "/" });
      // clear Redux
      dispatch(setToken(""));
      // redirect immediately
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Sign out error", err);
    }
  }, [cookies, dispatch, navigate]);

  return handleSignOut;
};

export default useSignOut;
