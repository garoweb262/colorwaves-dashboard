"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/routing";
import { protectedRoutes } from "@/app/resources";
import { Button } from "@/amal-ui/components";

interface ClientRouteGuardProps {
  children: React.ReactNode;
}

const ClientRouteGuard: React.FC<ClientRouteGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const [isRouteEnabled, setIsRouteEnabled] = useState(false);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performChecks = async () => {
      setLoading(true);
      setIsRouteEnabled(false);
      setIsPasswordRequired(false);
      setIsAuthenticated(false);

      // Allow all routes by default - only block if explicitly protected
      const isProtected =
        protectedRoutes[pathname as keyof typeof protectedRoutes];

      if (isProtected) {
        setIsPasswordRequired(true);
        const response = await fetch("/api/check-auth");
        if (response.ok) {
          setIsAuthenticated(true);
        }
      }

      // Enable route by default (unless it's a protected route that requires authentication)
      setIsRouteEnabled(!isProtected || isAuthenticated);
      setLoading(false);
    };

    performChecks();
  }, [pathname, isAuthenticated]);

  const handlePasswordSubmit = async () => {
    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      setError(undefined);
    } else {
      setError("Incorrect password");
    }
  };

  if (loading) {
    return (
      <div className="w-full py-32 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amaltech-orange"></div>
      </div>
    );
  }

  if (!isRouteEnabled) {
    return (
      <div className="w-full py-32 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amaltech-orange"></div>
      </div>
    );
  }

  if (isPasswordRequired && !isAuthenticated) {
    return (
      <div className="w-full py-32 max-w-md mx-auto flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-center">
          This page is password protected
        </h1>
        <div className="w-full">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-amaltech-gray-700 mb-2"
          >
            Enter password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(undefined);
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amaltech-orange focus:border-transparent ${
              error ? "border-red-500" : "border-amaltech-gray-300"
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <Button onClick={handlePasswordSubmit}>Submit</Button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ClientRouteGuard;
