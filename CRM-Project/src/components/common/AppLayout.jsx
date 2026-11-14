
import { Outlet } from "react-router-dom";

import Sidebar from "./AppSidebar.jsx";
import Header from "./Header.jsx";

function Layout() {
  return (
    <div className="flex min-h-screen bg-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default Layout;
