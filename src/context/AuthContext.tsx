import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { decodeToken, isTokenValid } from "../utils/token";
import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";

const initialState = {
  token: localStorage.getItem("token") || null,
  user: null,
  isAuthenticated: false,
};

const AuthContext = createContext<any>(null);

const AuthReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const apiURL = config.apiUrl;
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(AuthReducer, initialState);
  const [initialized, setInitialized] = useState(false);

  const login = (data: any, redirect = true) => {
    localStorage.setItem("token", data.token);
    dispatch({ type: "LOGIN", payload: data });
    if (redirect) navigate("/");
  };

  const logout = async () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    const loggedOutRes = await axios.post(`${apiURL}/auth/logout`);
    if (loggedOutRes.status === 200) navigate("/");
  };

  const getUser = async (id: string) => {
    try {
      const userReq = await axios.get(`${apiURL}/users/my-data/${id}`);
      return userReq.data;
    } catch (e) {
      logout();
    }
  };

  useEffect(() => {
    const token = window?.localStorage?.getItem("token") || "";
    const isValidToken = isTokenValid(token);
    if (!isValidToken) {
      logout();
      setInitialized(true);
    } else {
      const decoded: any = decodeToken(token);
      login({ token }, false);
      (async () => {
        if (!state.user) {
          const user = await getUser(decoded["id"]);
          if (user) {
            login({ token, user }, false);
            setInitialized(true);
          }
        }
      })();
    }
  }, []);

  if (!initialized) return null;

  return (
    <AuthContext.Provider value={{ ...state, login, logout, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
