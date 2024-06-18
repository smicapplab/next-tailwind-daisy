import { UserContext } from "@/app/store/context/UserContextProvider";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function withAuth(Component) {
  return function ProtectedRoute({ ...props }) {
    const router = useRouter();
    const pathname = usePathname();
    const { refetchUser, userInfo, loadingUserInfo } = useContext(UserContext);

    useEffect(() => {
      const fetchUsers = async () => {
        await refetchUser();
      };
      fetchUsers();
    }, []);

    useEffect(() => {
      if (!loadingUserInfo) {
        if (!userInfo || !userInfo.isAuthenticated) {
          if (pathname !== "/login") {
            router.replace("/login");
          }
        } else if (pathname === "/login") {
          router.replace("/dashboard");
        } else if (pathname === "/") {
          router.replace("/dashboard");
        }
      }
    }, [loadingUserInfo, pathname, userInfo]);

    return <Component {...props} />;
  };
}
