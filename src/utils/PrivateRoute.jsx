// // PrivateRoute.js
// import React from "react";
// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";

// const PrivateRoute = () => {
//   // const { isAuthenticated } = useAuth();
//   const { user } = useSelector(state => state.auth);
//   return user ? <Outlet /> : <Navigate to="/login" />;
// };

// export default PrivateRoute;

// PrivateRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ requiredRole }) => {
  const { user } = useSelector(state => state.auth);

  if (!user?.uid) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to="/acceso-denegado" />;
  }

  return <Outlet />;
};

export default PrivateRoute;

