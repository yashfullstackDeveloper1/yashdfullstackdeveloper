import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem("user");

  return isLoggedIn ? children : <Navigate to="/" />;
}

export default PrivateRoute;