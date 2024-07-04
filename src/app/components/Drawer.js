import { useRouter } from "next/navigation";
import { useRef } from "react";
import AssessmentIcon from "./Icons/AssessmentIcon";
import BankStatementsIcon from "./Icons/BankStatementsIcon";
import DashboardIcon from "./Icons/DashboardIcon";

const menus = [
  {
    name: "Dashboard",
    icon: <DashboardIcon />,
    pathname: "/dashboard",
  },
  {
    name: "Credit Assessment",
    icon: <AssessmentIcon />,
    pathname: "/credit-assessment",
  },
  {
    name: "Bank Statements",
    icon: <BankStatementsIcon />,
    pathname: "/bank-statement",
  },
];

export default function Drawer(props) {
  const router = useRouter();
  const drawerCheckboxRef = useRef(null);

  const redirectUser = (pathname) => {
    router.replace(pathname);
    if (drawerCheckboxRef.current) {
      drawerCheckboxRef.current.checked = false; // Toggle the drawer close
    }
  };

  return (
    <div className="drawer">
      <input
        id="koredor-drawer"
        type="checkbox"
        className="drawer-toggle"
        ref={drawerCheckboxRef}
      />
      <div className="drawer-side fixed top-0 left-0 z-50 h-full">
        <label
          htmlFor="koredor-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu bg-base-200 min-w-72 min-h-full">
          <div className="grid w-full h-24 mb-10 bg-secondary text-white place-content-center text-5xl font-extrabold">
            koredor
          </div>
          <ul className="font-bold text-gray-900">
            {menus.map(({ name, icon, pathname }) => (
              <li className="h-14" key={name}>
                <a onClick={() => redirectUser(pathname)}>
                  {icon}
                  {name}
                </a>
              </li>
            ))}
          </ul>
          <div className="text-sm text-gray-600 absolute bottom-0 text-center w-full mb-5">
            &copy; 2024 Koredor <br/>
            Demo purposes only
          </div>
        </div>
      </div>
    </div>
  );
}