import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";

import Loading from "../components/general/Loading";
import { client } from "../helpers/config";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Use auth must be inside the auth Provider");
  return context;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserInfo = async () => {
    setIsLoading(true);
    const res = await client.get("/auth/user");
    setIsLoading(false);
    setRoles(res.data.user.roles);
    return res.data.user;
  };

  const updateUserInfo = async () => {
    const resUser = await getUserInfo();
    delete resUser.token;
    setUser(resUser);
  };

  useEffect(() => {
    const checkAuthCookie = async () => {
      try {
        const access_token = Cookies.get("access_token"); // get token
        if (!access_token) return logout();
        client.defaults.headers.common["Authorization"] = access_token; // set token for all api calls
        const res = await getUserInfo();
        if (res) return login({ ...res, token: access_token });
      } catch (err) {
        console.error(err);
        return err;
      }
    };
    checkAuthCookie();
  }, []);

  const login = (receivedUser) => {
    const { token } = receivedUser;
    delete receivedUser.token;
    setUser(receivedUser);
    Cookies.set("access_token", token);
    client.defaults.headers.common["Authorization"] = token; // set token for all api calls
  };

  const logout = () => {
    setIsLoading(false);
    setUser(null);
    setRoles(null)
    Cookies.remove("access_token");
  };

  if (isLoading) return <Loading />;

  return (
    <AuthContext.Provider
      value={{ user, roles, login, logout, updateUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};
