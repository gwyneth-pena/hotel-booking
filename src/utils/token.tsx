import { jwtDecode } from "jwt-decode";

type JWT = {
  exp: number;
  iat: number;
  [key: string]: any;
};

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded: JWT = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();
    return !isExpired;
  } catch (error) {
    return false;
  }
};

export const decodeToken = (token: string): JWT | null => {
  try {
    const decoded: JWT = jwtDecode(token);
    return decoded;
  } catch (error) {
    return null;
  }
};
