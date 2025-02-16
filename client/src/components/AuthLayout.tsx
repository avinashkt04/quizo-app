import React from "react";
import { useAuth } from "../provider/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "./Spinner";

function AuthLayout({
  children,
  authentication,
}: {
  children: React.ReactNode;
  authentication: boolean;
}) {
  const { isAuthenticated, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!authLoading) {
      if (authentication && !isAuthenticated) {
        navigate("/login");
      } else if (!authentication && isAuthenticated) {
        if (location.pathname === "/login" || location.pathname === "/signup") {
          navigate("/dashboard");
        }
      }
    }
  }, [
    isAuthenticated,
    authLoading,
    navigate,
    authentication,
    location.pathname,
  ]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="w-9" /> 
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthLayout;
