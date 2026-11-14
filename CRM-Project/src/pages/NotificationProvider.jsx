import { useEffect, useMemo, useState } from "react";
import { NotificationContext } from "./NotificationContext.jsx";

const STORAGE_KEY = "crm-notifications-v1";

function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

const initialNotifications = [
  {
    id: "notification-mention",
    actor: "Frank Edward",
    actorInitials: "FE",
    avatarClass: "bg-sky-100 text-sky-700",
    message: "mentioned you in a comment: @Dhanush please review the product design.",
    relatedName: "Monthly Product Discussion",
    relatedType: "task",
    taskId: "planned-1",
    type: "mention",
    createdAt: hoursAgo(1),
    read: false,
    archived: false,
    reply: "",
  },
  {
    id: "notification-assigned",
    actor: "Dianne Russell",
    actorInitials: "DR",
    avatarClass: "bg-rose-100 text-rose-700",
    message: "assigned you a task",
    relatedName: "Monthly Product Discussion",
    relatedType: "task",
    taskId: "planned-1",
    type: "task",
    createdAt: hoursAgo(2),
    read: false,
    archived: false,
  },
  {
    id: "notification-date",
    actor: "James Wong",
    actorInitials: "JW",
    avatarClass: "bg-amber-100 text-amber-800",
    message: "changed the due date",
    relatedName: "Create Monthly Revenue Recap for All Product Line",
    relatedType: "task",
    taskId: "upcoming-1",
    type: "task",
    createdAt: hoursAgo(4),
    read: true,
    archived: false,
  },
  {
    id: "notification-completed",
    actor: "Brooklyn Simmons",
    actorInitials: "BS",
    avatarClass: "bg-emerald-100 text-emerald-700",
    message: "completed a task",
    relatedName: "Uploading New Items to Marketplace",
    relatedType: "task",
    taskId: "completed-1",
    type: "task",
    createdAt: hoursAgo(8),
    read: true,
    archived: false,
  },
  {
    id: "notification-approval",
    actor: "Olivia Rhye",
    actorInitials: "OR",
    avatarClass: "bg-violet-100 text-violet-700",
    message: "requested approval to access",
    relatedName: "Q4 Marketing Campaign",
    relatedType: "request",
    type: "request",
    requestStatus: "pending",
    createdAt: hoursAgo(12),
    read: false,
    archived: false,
  },
  {
    id: "notification-project",
    actor: "Cameron Williamson",
    actorInitials: "CW",
    avatarClass: "bg-orange-100 text-orange-700",
    message: "shared an update with your team",
    relatedName: "Design Team",
    relatedType: "project",
    type: "project",
    createdAt: hoursAgo(26),
    read: true,
    archived: false,
  },
  {
    id: "notification-archived",
    actor: "Robert Fox",
    actorInitials: "RF",
    avatarClass: "bg-indigo-100 text-indigo-700",
    message: "updated the task description",
    relatedName: "Update New Social Media Post",
    relatedType: "task",
    taskId: "planned-2",
    type: "task",
    createdAt: hoursAgo(48),
    read: true,
    archived: true,
  },
];

function readStoredState() {
  const defaultState = {
    notifications: initialNotifications,
    selectedTab: "all",
    selectedFilter: "all",
    popupOpen: false,
  };
  if (typeof window === "undefined") return defaultState;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed.notifications)) {
      throw new Error("Stored notifications are not a list.");
    }

    return {
      notifications: parsed.notifications,
      selectedTab: ["all", "tasks", "archived"].includes(parsed.selectedTab)
        ? parsed.selectedTab
        : "all",
      selectedFilter: ["all", "unread", "read"].includes(parsed.selectedFilter)
        ? parsed.selectedFilter
        : "all",
      popupOpen: Boolean(parsed.popupOpen),
    };
  } catch (error) {
    console.error("Could not load saved notifications.", error);
    return defaultState;
  }
}

export function NotificationProvider({ children }) {
  const [state, setState] = useState(readStoredState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Could not save notifications.", error);
    }
  }, [state]);

  const value = useMemo(() => {
    function updateNotification(id, updater) {
      setState((current) => ({
        ...current,
        notifications: current.notifications.map((notification) => (
          notification.id === id ? updater(notification) : notification
        )),
      }));
    }

    return {
      notifications: state.notifications,
      selectedTab: state.selectedTab,
      selectedFilter: state.selectedFilter,
      popupOpen: state.popupOpen,
      unreadCount: state.notifications.filter(
        (notification) => !notification.read && !notification.archived,
      ).length,
      setSelectedTab: (selectedTab) => setState((current) => ({ ...current, selectedTab })),
      setSelectedFilter: (selectedFilter) => setState((current) => ({ ...current, selectedFilter })),
      openPopup: () => setState((current) => ({ ...current, popupOpen: true })),
      closePopup: () => setState((current) => ({ ...current, popupOpen: false })),
      addNotification: (notification) => {
        const now = Date.now();
        const newNotification = {
          ...notification,
          id: notification.id ?? `notification-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          createdAt: notification.createdAt ?? new Date(now).toISOString(),
          read: false,
          archived: false,
        };
        setState((current) => {
          const duplicate = newNotification.dedupeKey && current.notifications.some(
            (item) => item.dedupeKey === newNotification.dedupeKey
              && now - new Date(item.createdAt).getTime() < 2000,
          );
          if (duplicate) return current;
          return {
            ...current,
            notifications: [newNotification, ...current.notifications],
          };
        });
      },
      markRead: (id) => updateNotification(id, (item) => ({ ...item, read: true })),
      markUnread: (id) => updateNotification(id, (item) => ({ ...item, read: false })),
      markAllRead: () => setState((current) => ({
        ...current,
        notifications: current.notifications.map((item) => ({ ...item, read: true })),
      })),
      archive: (id) => updateNotification(id, (item) => ({ ...item, archived: true })),
      restore: (id) => updateNotification(id, (item) => ({ ...item, archived: false })),
      deleteNotification: (id) => setState((current) => ({
        ...current,
        notifications: current.notifications.filter((item) => item.id !== id),
      })),
      respondToRequest: (id, requestStatus) => updateNotification(id, (item) => ({
        ...item,
        requestStatus,
        read: true,
      })),
      saveReply: (id, reply) => updateNotification(id, (item) => ({
        ...item,
        reply,
        read: true,
      })),
    };
  }, [state]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
