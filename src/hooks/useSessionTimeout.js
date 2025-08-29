// hooks/useSessionTimeout.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getTokenExpiry } from "../utils/auth";
import { signoutSuccess } from "redux/Slice/SignInSlice";


export const useSessionTimeout = (extendSessionCallback) => {
  const { currentUser } = useSelector((state) => state.user);
  const [warning, setWarning] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentUser?.token) return;

    const expiryTime = getTokenExpiry(currentUser.token);
    if (!expiryTime) return;

    const now = Date.now();
    const warningTime = expiryTime - now - 60 * 1000; // 1 min before expiry
    const logoutTime = expiryTime - now;

    let warningTimer, logoutTimer;

    if (warningTime > 0) {
      warningTimer = setTimeout(() => {
        setWarning(true);
        toast.warning("Session expiring soon. Do you want to extend?");
      }, warningTime);
    }

    if (logoutTime > 0) {
      logoutTimer = setTimeout(() => {
        dispatch(signoutSuccess());
        toast.error("Session expired. Please login again.");
      }, logoutTime);
    }

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
    };
  }, [currentUser, dispatch]);

  const extendSession = async () => {
    setWarning(false);
    await extendSessionCallback(); // call API with refreshToken
  };

  return { warning, extendSession };
};
