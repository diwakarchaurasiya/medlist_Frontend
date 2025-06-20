import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState(null); // 'patient', 'doctor', 'admin'
  const [user, setUser] = useState(null); // Stores user data
  const navigate = useNavigate();

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem(`token`); // Changed to a single 'token' key
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedRole && storedUser) {
      setIsLogin(true);
      setRole(storedRole.toLowerCase());
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLogin(false);
        setRole(null);
        setUser(null);
      }
    }
  }, []);

  // Login function
  const login = useCallback((token, userData, userRole) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userRole.toLowerCase()); // Ensure lowercase
    setIsLogin(true);
    setRole(userRole.toLowerCase());
    setUser(userData);
    toast.success("Successfully logged in!");
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.clear();
    setIsLogin(false);
    setRole(null);
    setUser(null);
    toast.info("You have been logged out.");
    navigate("/login"); // Redirect to login after logout
  }, [navigate]);

  const value = {
    isLogin,
    role,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
