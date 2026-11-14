import { useEffect, useMemo, useState } from "react";
import { CRMDataContext } from "./CRMDataContext.jsx";
import { initialContacts, initialTasks } from "./CRMDataSeeds.jsx";

const storageKeys = {
  calendarEvents: "crm-calendar-events-v1",
  companies: "crm-companies-v1",
  contacts: "crm-contacts-v1",
  emailStats: "crm-email-stats-v1",
  tasks: "crm-tasks-v1",
};

function dateTimeDaysFromNow(days, hour, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const initialCompanies = [
  { id: "company-1", name: "Product Hunt", industry: "Web Design", location: "New York City, NY", status: "Active", createdAt: new Date().toISOString() },
  { id: "company-2", name: "Google", industry: "Search Engine", location: "New York City, NY", status: "Active", createdAt: new Date().toISOString() },
  { id: "company-3", name: "Wordpress", industry: "Web Development", location: "New York City, NY", status: "Active", createdAt: new Date().toISOString() },
  { id: "company-4", name: "Tripadvisor", industry: "Travel Reviews", location: "New York City, NY", status: "Lead", createdAt: new Date().toISOString() },
  { id: "company-5", name: "Slack", industry: "Communication", location: "New York City, NY", status: "Lead", createdAt: new Date().toISOString() },
];

const initialCalendarEvents = [
  {
    id: "event-1",
    title: "Meeting with Client",
    startAt: dateTimeDaysFromNow(2, 11),
    description: "Review this month's progress and agree on the next steps.",
  },
  {
    id: "event-2",
    title: "Product planning",
    startAt: dateTimeDaysFromNow(5, 12),
    description: "Plan the next product milestone with the team.",
  },
  {
    id: "event-3",
    title: "Marketing review",
    startAt: dateTimeDaysFromNow(7, 14, 30),
    description: "Review campaign performance and upcoming launches.",
  },
  {
    id: "event-4",
    title: "Partner check-in",
    startAt: dateTimeDaysFromNow(11, 10),
    description: "Share updates and discuss partner feedback.",
  },
];

const monthLabels = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const sentByMonth = [104, 98, 112, 105, 117, 96, 109, 102, 115, 107, 101, 85];
const deliveredByMonth = [103, 98, 112, 105, 117, 96, 109, 102, 115, 107, 101, 85];
const openedByMonth = [80, 47, 90, 63, 90, 39, 66, 51, 81, 60, 80, 56];
const initialEmailStats = monthLabels.map((month, index) => ({
  month: index,
  monthName: month,
  year: 2026,
  sent: sentByMonth[index],
  delivered: deliveredByMonth[index],
  opened: openedByMonth[index],
}));

function readStoredList(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error(`Saved ${key} data is not a list.`);
    return parsed;
  } catch (error) {
    console.error(`Could not load ${key} data.`, error);
    return fallback;
  }
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function CRMDataProvider({ children }) {
  const [contacts, setContacts] = useState(() => readStoredList(storageKeys.contacts, initialContacts));
  const [tasks, setTasks] = useState(() => readStoredList(storageKeys.tasks, initialTasks));
  const [companies, setCompanies] = useState(() => readStoredList(storageKeys.companies, initialCompanies));
  const [calendarEvents, setCalendarEvents] = useState(() => readStoredList(storageKeys.calendarEvents, initialCalendarEvents));
  const [emailStats, setEmailStats] = useState(() => readStoredList(storageKeys.emailStats, initialEmailStats));

  useEffect(() => {
    for (const [name, value] of Object.entries({
      calendarEvents,
      companies,
      contacts,
      emailStats,
      tasks,
    })) {
      try {
        window.localStorage.setItem(storageKeys[name], JSON.stringify(value));
      } catch (error) {
        console.error(`Could not save ${name} data.`, error);
      }
    }
  }, [calendarEvents, companies, contacts, emailStats, tasks]);

  const value = useMemo(() => ({
    contacts,
    tasks,
    companies,
    calendarEvents,
    emailStats,
    addContact: (contact) => setContacts((current) => [contact, ...current]),
    updateContact: (id, updater) => setContacts((current) => current.map(
      (contact) => contact.id === id ? updater(contact) : contact,
    )),
    deleteContact: (id) => setContacts((current) => current.filter((contact) => contact.id !== id)),
    addTask: (task) => setTasks((current) => [task, ...current]),
    updateTask: (id, updater) => setTasks((current) => current.map(
      (task) => task.id === id ? updater(task) : task,
    )),
    addCompany: (company) => setCompanies((current) => [
      {
        ...company,
        id: company.id ?? createId("company"),
        createdAt: company.createdAt ?? new Date().toISOString(),
      },
      ...current,
    ]),
    updateCompany: (id, updater) => setCompanies((current) => current.map(
      (company) => company.id === id ? updater(company) : company,
    )),
    deleteCompany: (id) => setCompanies((current) => current.filter((company) => company.id !== id)),
    addCalendarEvent: (event) => setCalendarEvents((current) => [
      { ...event, id: event.id ?? createId("event") },
      ...current,
    ]),
    updateCalendarEvent: (id, updater) => setCalendarEvents((current) => current.map(
      (event) => event.id === id ? updater(event) : event,
    )),
    deleteCalendarEvent: (id) => setCalendarEvents((current) => current.filter((event) => event.id !== id)),
    updateEmailMonth: (month, updater) => setEmailStats((current) => current.map((item) => {
      if (item.month !== month) return item;
      const updated = typeof updater === "function" ? updater(item) : { ...item, ...updater };
      const sent = Math.max(0, Math.floor(Number(updated.sent) || 0));
      const delivered = Math.min(sent, Math.max(0, Math.floor(Number(updated.delivered) || 0)));
      const opened = Math.min(delivered, Math.max(0, Math.floor(Number(updated.opened) || 0)));
      return { ...updated, sent, delivered, opened };
    })),
  }), [calendarEvents, companies, contacts, emailStats, tasks]);

  return (
    <CRMDataContext.Provider value={value}>
      {children}
    </CRMDataContext.Provider>
  );
}
