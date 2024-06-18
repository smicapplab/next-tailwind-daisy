"use client";

import { createContext, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";
import { postApi } from "@/helpers/api-helpers";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const doLogout = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  const fetchUser = async (arg) => {
    setLoading(true);
    let data = {};
    let error;
    try {
      const fetchResult = await postApi("auth/fetch-user");
      if( fetchResult.success ){
        setUserInfo({
          isAuthenticated: true,
          user: fetchResult,
          lastFetched: new Date().getTime(),
        });
      }else{
        setUserInfo({
          isAuthenticated: false,
          message: fetchResult.message,
          user: {},
        });
      }
    } catch (err) {
      console.error * err;
      error = err;
      setUserInfo({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userInfo: userInfo,
        refetchUser: fetchUser,
        loadingUserInfo: loading,
        doLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
