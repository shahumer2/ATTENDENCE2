import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { signoutSuccess, updateToken } from "../../../redux/Slice/SignInSlice";
import { REFRESH_URL } from "Constants/utils";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inactivityTimer = useRef(null);
  const logoutTimer = useRef(null);
  const countdownInterval = useRef(null);

  // ✅ Token Expiry Check
  useEffect(() => {
    if (currentUser?.token) {
      const decoded = jwtDecode(currentUser.token);
      const expiryTime = decoded.exp * 1000;
      const now = Date.now();

      const warningTime = expiryTime - now - 20 * 1000;

      if (warningTime > 0) {
        const timer = setTimeout(() => {
          startCountdown(20);
        }, warningTime);

        return () => clearTimeout(timer);
      } else {
        handleLogout();
      }
    }
  }, [currentUser]);

  // ✅ Inactivity Check (2 min idle → 30s popup → auto logout)
  useEffect(() => {
    if (!currentUser) return;

    const resetInactivityTimer = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (logoutTimer.current) clearTimeout(logoutTimer.current);

      inactivityTimer.current = setTimeout(() => {
        startCountdown(30); // show 30s countdown modal
      }, 2 * 60 * 1000); // 2 minutes
    };

    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer)
    );

    resetInactivityTimer();

    return () => {
      events.forEach((event) => 
        window.removeEventListener(event, resetInactivityTimer)
      );
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [currentUser]);

  // ✅ Auto extend if activity detected while modal is open
  useEffect(() => {
    if (!showSessionModal) return;

    const autoExtend = () => {
      handleExtendSession();
    };

    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) =>
      window.addEventListener(event, autoExtend)
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, autoExtend)
      );
    };
  }, [showSessionModal]);

  // ✅ Start countdown
  const startCountdown = (seconds) => {
    setCountdown(seconds);
    setShowSessionModal(true);

    logoutTimer.current = setTimeout(() => {
      handleLogout();
    }, seconds * 1000);

    countdownInterval.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleExtendSession = async () => {
    try {
      // 🔥 Call refresh API (only expects token in body)
      const res = await fetch(REFRESH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: currentUser.refreshToken }), // 👈 send refresh token
      });

      if (!res.ok) throw new Error("Failed to refresh token");

      const data = await res.json();

      // ✅ Update Redux with new token (and refresh token if API gives it again)
      dispatch(updateToken({
        token: data.token,
        refreshToken: data.refreshToken || currentUser.refreshToken
      }));

      toast.success("Session extended!");
    } catch (err) {
      toast.error("Session expired, please login again");
      handleLogout();
    } finally {
      setShowSessionModal(false);

      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);

      setCountdown(0);
    }
  };



  const handleLogout = () => {
    dispatch(signoutSuccess());
    window.location.href = "/login";
  };

  if (!currentUser) {
    dispatch(signoutSuccess());
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <>
      {children}

      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg font-bold">Session Expiring</h2>
            <p className="mt-2">
              Your session will expire in{" "}
              <span className="font-semibold text-red-600">{countdown}</span>{" "}
              seconds.
            </p>
            <div className="mt-4 flex gap-4 justify-center">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleExtendSession}
              >
                Extend
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrivateRoute;
