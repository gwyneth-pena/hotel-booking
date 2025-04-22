import { createContext, useContext, useReducer, ReactNode } from "react";

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
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const login = (data: any) => {
    localStorage.setItem("token", data.token);
    dispatch({ type: "LOGIN", payload: data });
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
