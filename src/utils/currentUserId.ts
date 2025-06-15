import { useState, useEffect } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

const useCurrentUserId = () => {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.user_id) {
        setCurrentUserId(decoded.user_id);
      }
    }
  }, []);

  return currentUserId;
};

export default useCurrentUserId;
