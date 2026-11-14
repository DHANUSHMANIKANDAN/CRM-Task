
import {
  LayoutDashboard,
  Bell,
  StickyNote,
  CheckSquare,
  Mail,
  CalendarDays,
  ChartNoAxesCombined,
  Users,
  Building2,
  Blocks,
  Settings,
  Grid2X2,
  ChevronDown,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {

  const mainMenu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: Bell,
    },
    {
      name: "Notes",
      path: "/notes",
      icon: StickyNote,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: CheckSquare,
    },
    {
      name: "Emails",
      path: "/emails",
      icon: Mail,
    },
    {
      name: "Calendars",
      path: "/calendar",
      icon: CalendarDays,
    },
  ];

  const databaseMenu = [
    {
      name: "Analytics",
      path: "/analytics",
      icon: ChartNoAxesCombined,
    },
    {
      name: "Contacts",
      path: "/contacts",
      icon: Users,
    },
    {
      name: "Companies",
      path: "/companies",
      icon: Building2,
    },
  ];
  const settingsMenu = [
    {
        name: "integrations",
        path: "/integrations",
        icon: Blocks
    },
    {
        name:"settings",
        path:"/settings",
        icon: Settings
    }
  ]

  return (
    <aside className="min-h-screen w-16 shrink-0 border-r border-gray-200 bg-[#FAFAFA] flex flex-col md:w-[220px]">

      {/* Logo Section */}
      <div className="flex h-[65px] items-center justify-center border-b border-gray-200 px-2 md:justify-start md:px-5">
        <h1 className="pl-0 text-2xl font-bold text-gray-900 md:pl-4">
          <span className="md:hidden">V</span>
          <span className="hidden md:inline">Venture</span>
        </h1>
      </div>

      {/* Main Navigation */}
      <div className="p-2 md:p-3">

 

        <nav className="space-y-1">

          {mainMenu.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                aria-label={item.name}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-3 rounded-md px-2 py-2.5 text-sm transition-all duration-200 md:justify-start md:px-3
                  ${
                    isActive
                      ? "bg-gray-200 text-gray-900 font-semibold"
                      : "text-gray-500 hover:bg-gray-100 hover:text-black hover:shadow-[0_0_8px_rgba(0,0,0,0.35)]"
                  }`
                }
              >

                <Icon size={17} strokeWidth={1.8} />

                <span className="hidden md:inline">{item.name}</span>

              </NavLink>
            );

          })}

        </nav>

      </div>

      {/* Database Navigation */}
      <div className="border-t border-gray-200 px-2 pt-4 md:px-3">

        <p className="mb-3 hidden px-2 text-[13px] font-medium text-gray-400 md:block">
          DATABASE
        </p>

        <nav className="space-y-1">

          {databaseMenu.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                aria-label={item.name}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-3 rounded-md px-2 py-2.5 text-sm transition-all duration-200 md:justify-start md:px-3
                  ${
                    isActive
                      ? "bg-gray-200 text-gray-900 font-semibold"
                      : "text-gray-500 hover:bg-gray-100 hover:text-black hover:shadow-[0_0_8px_rgba(0,0,0,0.35)]"
                  }`
                }
              >

                <Icon size={17} strokeWidth={1.8} />

                <span className="hidden md:inline">{item.name}</span>

              </NavLink>

            );

          })}

        </nav>

      </div>
      <div className="border-t border-gray-200 px-2 pt-4 md:px-3">


        <nav className="space-y-1">

          {settingsMenu.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                aria-label={item.name}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-3 rounded-md px-2 py-2.5 text-sm transition-all duration-200 md:justify-start md:px-3
                  ${
                    isActive
                      ? "bg-gray-200 text-gray-900 font-semibold"
                      : "text-gray-500 hover:bg-gray-100 hover:text-black hover:shadow-[0_0_8px_rgba(0,0,0,0.35)]"
                  }`
                }
              >

                <Icon size={17} strokeWidth={1.8} />

                <span className="hidden md:inline">{item.name}</span>

              </NavLink>

            );

          })}

        </nav>

      </div>

      {/* Settings */}
      <div className="mt-auto p-3 ">


        {/* Team Selector */}
        <div className="mt-4 flex items-center justify-center border-t border-gray-200 pt-3 md:justify-between">

          <div className="flex items-center gap-2">

            <Grid2X2 size={17} />

            <span className="hidden text-xs font-medium md:inline">
              Marketing Team
            </span>

          </div>

          <ChevronDown size={15} className="hidden md:block" />

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;
