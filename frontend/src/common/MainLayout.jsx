import { Outlet } from "react-router";
import { AppNavBar } from "./AppNavBar.jsx";

export function MainLayout() {
  return (
    <div>
      <div>
        <AppNavBar />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
