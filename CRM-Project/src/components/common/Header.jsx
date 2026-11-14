
import { Search, CircleHelp, ChevronDown, Bell } from "lucide-react";
import { useNotifications } from "../../pages/NotificationContext.jsx";
import NotificationCenter from "../../pages/NotificationCenter.jsx";

function Header() {
  const { popupOpen, openPopup, closePopup, unreadCount } = useNotifications();

  return (
    <header className="relative z-30 flex h-[65px] w-full min-w-0 items-center justify-between gap-2 border-b border-gray-200 bg-white px-3 sm:px-6">

      {/* Left Section - Search */}
      <div className="flex min-w-0 max-w-[280px] flex-1 items-center rounded-md border border-gray-200 px-3 py-2">

        <Search size={16} className="text-gray-400" />

        <input
          type="text"
          placeholder="Search"
          className="ml-2 min-w-0 w-full text-sm outline-none placeholder:text-gray-400"
        />

      </div>

      {/* Right Section */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-6">
        <button
          type="button"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
          aria-expanded={popupOpen}
          className="relative rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          onClick={popupOpen ? closePopup : openPopup}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Help Center */}
        <button type="button" className="flex items-center gap-2 text-sm text-gray-600 hover:text-black">

          <CircleHelp size={17} />

          <span className="hidden sm:inline">Help Center</span>

        </button>

        {/* User Profile */}
        <button type="button" className="flex items-center gap-2 sm:gap-3">

          <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-xs font-semibold text-gray-700">
            DM
          </div>

          <span className="hidden text-sm font-medium text-gray-700 sm:inline">
            Dhanush M
          </span>

          <ChevronDown size={15} className="text-gray-500" />

        </button>

      </div>

      {popupOpen && (
        <>
          <button
            type="button"
            aria-label="Close notifications popup"
            className="fixed inset-0 z-40 cursor-default bg-transparent"
            onClick={closePopup}
          />
          <NotificationCenter mode="popup" onClose={closePopup} />
        </>
      )}

    </header>
  );
}

export default Header;
