"use client";

import { createContext, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";
import { postApi } from "@/helpers/api-helpers";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [userInfo, setUserInfo] = useState({});
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const doLogout = async () => {
    googleLogout();
    await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/do-logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setUserInfo({});
    setRole(null);
  };

  const fetchUser = async (arg) => {
    setLoading(true);
    let data = {};
    let error;
    try {
      let result = await postApi("auth/fetch-user");
      // data = result;
      // setRole(result.userRole);
    } catch (err) {
      error = err;
      setLoading(false);
    }

    const curUserInfo = {
      user: data,
      isAuthenticated: data?.email ? true : false,
      lastFetched: new Date().getTime(),
      error,
    };

    setUserInfo(curUserInfo);
    setLoading(false);
    return userInfo;
  };

  return (
    <UserContext.Provider
      value={{
        userInfo: userInfo,
        role,
        setRole,
        refetchUser: fetchUser,
        loadingUserInfo: loading,
        doLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
