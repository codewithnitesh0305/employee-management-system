import { useCallback, useMemo, useState } from "react";
import { authApi } from "../api/auth/authApi";
import { authStorage } from "../auth/authStorage";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const token = authStorage.getToken();
    const storedUser = authStorage.getUser();

    if (token) {
      return { token, user: storedUser };
    }

    authStorage.clearAuth();
    return { token: null, user: null };
  });
  const isLoading = false;

  const login = useCallback(async (credentials) => {
    const result = await authApi.login(credentials);
    if (result?.status !== true) {
      throw new Error(
        typeof result?.message === "string" && result.message
          ? result.message
          : "Login failed. Please check your credentials."
      );
    }

    const token = result.data?.token;
    const userDetails = result.data?.userDetails;
    const organization = result.data?.organization;
    if (
      typeof token !== "string" ||
      !token ||
      !userDetails ||
      typeof userDetails !== "object" ||
      Array.isArray(userDetails)
    ) {
      throw new Error(
        "The login response is missing the expected token or user details."
      );
    }

    const authenticatedUser = {
      ...userDetails,
      ...(organization &&
      typeof organization === "object" &&
      !Array.isArray(organization)
        ? { organization }
        : {}),
    };

    authStorage.saveToken(token);
    authStorage.saveUser(authenticatedUser);
    setSession({ token, user: authenticatedUser });

    return authenticatedUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      authStorage.clearAuth();
      setSession({ token: null, user: null });
    }
  }, []);

  const value = useMemo(
    () => ({
      user: session.user,
      isAuthenticated: Boolean(session.token),
      isLoading,
      login,
      logout,
    }),
    [session, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
