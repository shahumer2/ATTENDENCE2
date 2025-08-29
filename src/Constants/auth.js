// utils/auth.js
import jwtDecode from "jwt-decode";

export const getTokenExpiry = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000; // exp is in seconds, convert to ms
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return true;
  return Date.now() > expiry;
};
