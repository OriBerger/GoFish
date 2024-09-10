import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem('token'); // Check for token in localStorage
  const navigate = useNavigate(); // Use navigate to redirect

  useEffect(() => {
    if (!token) {
      navigate("/"); // Redirect to home page if no token
    }
  }, [token, navigate]);

  return token ? <>{children}</> : null; // Only render children if token exists
}

export default PrivateRoute;
