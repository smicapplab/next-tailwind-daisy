"use client";

import { useContext, useEffect } from "react";
import { UserContext } from "../store/context/UserContextProvider";
import MenuIcon from "./Icons/MenuIcon";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const { userInfo, doLogout, refetchUser } = useContext(UserContext);
  const router = useRouter()
  const user = userInfo?.user;

  useEffect(() => {
    const fetchUsers = async () => {
      await refetchUser();
    };
    fetchUsers();
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("");
    return initials.toUpperCase();
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <label htmlFor="koredor-drawer">
          <MenuIcon className="text-secondary" />
        </label>
        <a className="btn btn-ghost text-xl logo-font" onClick={() => router.replace("/dashboard")}>
          koredor
        </a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
              {user?.picture ? (
                <img
                  alt={user?.name}
                  src={user.picture}
                  className="rounded-full w-full h-full object-cover"
                />
              ) : (
                <div class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                  <span class="text-xl text-gray-600 dark:text-gray-300">
                    {getInitials(user?.name)}
                  </span>
                </div>
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">Profile</a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a onClick={doLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
