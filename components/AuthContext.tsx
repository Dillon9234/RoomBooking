"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  authenticated: boolean;
  role: string;
  setAuthenticated: (authenticated: boolean, role: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  role: "",
  setAuthenticated: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticatedState] = useState(false);
  const [role, setRole] = useState("");

  const setAuthenticated = (auth: boolean, userRole: string) => {
    setAuthenticatedState(auth);
    setRole(userRole || "");
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (res.ok) {
          const userData = await res.json();
          setAuthenticated(userData.authenticated, userData.role);
        } else {
          setAuthenticated(false, "");
        }
      } catch {
        setAuthenticated(false, "");
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, role, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
