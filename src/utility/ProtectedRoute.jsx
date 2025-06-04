// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Element, isLogin, role, allowedRoles }) => {
    if (!isLogin) return <Navigate to="/login" />;

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" />;
    }

    return <Element />;
};

export default ProtectedRoute;
