import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  Bell,
  Check,
  CheckCheck,
  MoreHorizontal,
  RotateCcw,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useNotifications } from "./NotificationContext.jsx";

const tabs = [
  { id: "all", label: "All" },
  { id: "tasks", label: "Tasks" },
  { id: "archived", label: "Archived" },
];

function formatTime(dateString) {
  const date = new Date(dateString);
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (elapsedMinutes < 1) return "Just now";
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}h ago`;
  if (elapsedHours < 48) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function NotificationCard({ notification, onOpenTask }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const {
    markRead,
    markUnread,
    archive,
    restore,
    deleteNotification,
    respondToRequest,
    saveReply,
  } = useNotifications();

  function handleDelete() {
    if (window.confirm("Delete this notification? This cannot be undone.")) {
      deleteNotification(notification.id);
    }
    setMenuOpen(false);
  }

  function submitReply(event) {
    event.preventDefault();
    const reply = replyText.trim();
    if (!reply) return;
    saveReply(notification.id, reply);
    setReplyText("");
    setReplyOpen(false);
  }

  const canOpenTask = notification.relatedType === "task" && notification.taskId;

  return (
    <article className={`relative flex gap-3 border-b border-gray-100 px-4 py-4 ${notification.read ? "bg-white" : "bg-blue-50/40"}`}>
      <button
        type="button"
        aria-label={`${notification.read ? "Read" : "Unread"} notification from ${notification.actor}`}
        className={`relative flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${notification.avatarClass ?? "bg-gray-100 text-gray-700"}`}
        onClick={() => canOpenTask && onOpenTask(notification)}
      >
        {notification.actorInitials}
        {!notification.read && <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white bg-blue-600" />}
      </button>

      <div className="min-w-0 flex-1">
        <button
          type="button"
          className="block w-full text-left"
          onClick={() => {
            if (canOpenTask) onOpenTask(notification);
            else markRead(notification.id);
          }}
        >
          <span className="block text-xs leading-5 text-gray-700">
            <span className="font-semibold text-gray-900">{notification.actor}</span>{" "}
            {notification.message}
          </span>
          <span className="mt-1 block truncate text-xs font-medium text-gray-800">
            {notification.relatedName}
          </span>
          <span className="mt-1 block text-[10px] text-gray-400">
            {formatTime(notification.createdAt)}
          </span>
        </button>

        {notification.type === "mention" && (
          <div className="mt-2">
            {notification.reply ? (
              <p className="rounded bg-gray-50 px-2 py-1.5 text-xs text-gray-600">
                <span className="font-medium text-gray-800">Your reply:</span> {notification.reply}
              </p>
            ) : replyOpen ? (
              <form className="flex items-center gap-2" onSubmit={submitReply}>
                <input
                  autoFocus
                  aria-label="Reply to mention"
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  className="min-w-0 flex-1 rounded border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-gray-500"
                  placeholder="Write a reply"
                />
                <button type="submit" aria-label="Send reply" disabled={!replyText.trim()} className="text-gray-500 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40">
                  <Send size={14} />
                </button>
                <button type="button" aria-label="Cancel reply" className="text-gray-400 hover:text-gray-700" onClick={() => setReplyOpen(false)}>
                  <X size={14} />
                </button>
              </form>
            ) : (
              <button type="button" className="text-xs font-medium text-blue-700 hover:text-blue-900" onClick={() => setReplyOpen(true)}>
                Reply
              </button>
            )}
          </div>
        )}

        {notification.type === "request" && (
          <div className="mt-3">
            {notification.requestStatus === "pending" ? (
              <div className="flex flex-wrap gap-2">
                <button type="button" className="rounded bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700" onClick={() => respondToRequest(notification.id, "accepted")}>
                  Accept
                </button>
                <button type="button" className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50" onClick={() => respondToRequest(notification.id, "declined")}>
                  Decline
                </button>
              </div>
            ) : (
              <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${notification.requestStatus === "accepted" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                <Check size={13} />
                {notification.requestStatus === "accepted" ? "Accepted" : "Declined"}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="relative shrink-0">
        <button
          type="button"
          aria-label={`More options for notification from ${notification.actor}`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MoreHorizontal size={17} />
        </button>
        {menuOpen && (
          <div role="menu" className="absolute right-0 top-8 z-20 w-40 rounded-md border border-gray-200 bg-white p-1 shadow-lg">
            <button type="button" role="menuitem" className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-xs text-gray-700 hover:bg-gray-50" onClick={() => { (notification.read ? markUnread : markRead)(notification.id); setMenuOpen(false); }}>
              <CheckCheck size={14} />
              Mark as {notification.read ? "Unread" : "Read"}
            </button>
            <button type="button" role="menuitem" className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-xs text-gray-700 hover:bg-gray-50" onClick={() => { (notification.archived ? restore : archive)(notification.id); setMenuOpen(false); }}>
              {notification.archived ? <RotateCcw size={14} /> : <Archive size={14} />}
              {notification.archived ? "Restore" : "Archive"}
            </button>
            <button type="button" role="menuitem" className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-xs text-red-600 hover:bg-red-50" onClick={handleDelete}>
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function NotificationCenter({ mode = "page", onClose }) {
  const navigate = useNavigate();
  const {
    notifications,
    selectedTab,
    selectedFilter,
    setSelectedTab,
    setSelectedFilter,
    markAllRead,
    markRead,
    closePopup,
  } = useNotifications();

  const tabNotifications = notifications.filter((notification) => {
    if (selectedTab === "archived") return notification.archived;
    if (notification.archived) return false;
    if (selectedTab === "tasks") return notification.relatedType === "task";
    return true;
  });
  const visibleNotifications = tabNotifications.filter((notification) => {
    if (selectedFilter === "unread") return !notification.read;
    if (selectedFilter === "read") return notification.read;
    return true;
  });

  function openTask(notification) {
    markRead(notification.id);
    if (mode === "popup") closePopup();
    if (notification.taskId) {
      navigate("/tasks", { state: { openTaskId: notification.taskId } });
    }
  }

  function seeAll() {
    closePopup();
    navigate("/notifications");
  }

  const popup = mode === "popup";

  return (
    <section
      aria-label="Notifications"
      className={popup
        ? "fixed left-[228px] right-4 top-[72px] z-50 flex max-h-[min(680px,calc(100vh-88px))] w-auto max-w-[300px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl max-[480px]:left-2 max-[480px]:w-[calc(100vw-16px)] max-[480px]:max-w-none"
        : "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"}
    >
      <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <Bell size={17} className="text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
        </div>
        {popup && (
          <button type="button" aria-label="Close notifications" className="rounded p-1 text-gray-500 hover:bg-gray-100" onClick={onClose ?? closePopup}>
            <X size={17} />
          </button>
        )}
      </header>

      <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4">
        <div className="flex min-w-0 items-center gap-4">
          {tabs.map((tab) => {
            const count = notifications.filter((notification) => (
              tab.id === "archived"
                ? notification.archived
                : !notification.archived && (tab.id === "all" || notification.relatedType === "task")
            )).length;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={selectedTab === tab.id}
                className={`flex shrink-0 items-center gap-1.5 border-b-2 py-2.5 text-xs ${selectedTab === tab.id ? "border-gray-900 font-semibold text-gray-900" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                onClick={() => setSelectedTab(tab.id)}
              >
                {tab.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${selectedTab === tab.id ? "bg-gray-100 text-gray-700" : "bg-gray-50 text-gray-400"}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-2">
        <button type="button" className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-600 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40" onClick={markAllRead} disabled={!notifications.some((notification) => !notification.read)}>
          <CheckCheck size={14} />
          Mark All as Read
        </button>
        <label className="flex items-center gap-1.5 text-[11px] text-gray-500">
          Filter
          <select aria-label="Filter notifications" value={selectedFilter} onChange={(event) => setSelectedFilter(event.target.value)} className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 outline-none focus:border-gray-400">
            <option value="all">All Notifications</option>
            <option value="unread">Unread Notifications</option>
            <option value="read">Read Notifications</option>
          </select>
        </label>
      </div>

      <div className={popup ? "min-h-0 flex-1 overflow-y-auto" : "max-h-[calc(100vh-270px)] min-h-64 overflow-y-auto"}>
        {visibleNotifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} onOpenTask={openTask} />
        ))}
        {visibleNotifications.length === 0 && (
          <div className="flex min-h-40 flex-col items-center justify-center px-6 text-center">
            <Bell size={22} className="mb-2 text-gray-300" />
            <p className="text-sm font-medium text-gray-700">You&apos;re all caught up</p>
            <p className="mt-1 text-xs text-gray-400">There are no notifications in this view.</p>
          </div>
        )}
      </div>

      {popup && (
        <footer className="border-t border-gray-100 p-3">
          <button type="button" className="w-full rounded-md bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700" onClick={seeAll}>
            See All Notifications
          </button>
        </footer>
      )}
    </section>
  );
}

export default NotificationCenter;
