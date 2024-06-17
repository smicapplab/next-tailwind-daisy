import { UserContext } from "@/app/store/context/UserContextProvider";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function withAuth(Component) {
  return function ProtectedRoute({ ...props }) {
    const router = useRouter();
    const pathname = usePathname();
    const { refetchUser, userInfo, loading } = useContext(UserContext);

    useEffect(() => {
      const fetchUsers = async () => {
        await refetchUser();
      };
      fetchUsers();
    }, []);

    useEffect(() => {
      if (!loading && userInfo && pathname) {
        if (!userInfo?.isAuthenticated) {
          router.replace("/login");
        } 
      }
    }, [loading, pathname, userInfo]);

    return <Component {...props} />;
  };
}
