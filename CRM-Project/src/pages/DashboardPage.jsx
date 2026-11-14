import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownUp,
  Building2,
  ChevronRight,
  Clock3,
  Filter,
  Mail,
  MapPin,
  Phone,
  Search,
  Users,
  X,
} from "lucide-react";
import { useCRMData } from "./CRMDataContext.jsx";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const categoryColors = ["#111827", "#6b7280", "#a3a3a3", "#d4d4d4", "#737373", "#9ca3af"];
const inputClass = "h-9 rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none focus:border-gray-400";

function formatEventDate(dateString) {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

function SummaryCard({ title, value, suffix, icon: Icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group min-w-0 rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-gray-400 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-8 items-center justify-center rounded-md bg-gray-50 text-gray-600">
          <Icon size={16} />
        </span>
        <ChevronRight size={15} className="text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-gray-900" />
      </div>
      <p className="mt-3 text-xs text-gray-500">{title}</p>
      <p className="mt-1 truncate text-xl font-semibold text-gray-950">
        {Number(value).toLocaleString()}
        {suffix && <span className="ml-1 text-sm font-medium text-gray-500">{suffix}</span>}
      </p>
    </button>
  );
}

function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`min-w-0 rounded-lg border border-gray-200 bg-white ${className}`}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-4 py-3.5">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function UpcomingAgenda({ events, onOpenEvent, onSeeCalendar }) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    const timerId = window.setTimeout(() => setNow(Date.now()), 0);
    const intervalId = window.setInterval(() => setNow(Date.now()), 60000);
    return () => {
      window.clearTimeout(timerId);
      window.clearInterval(intervalId);
    };
  }, []);
  const upcoming = useMemo(() => events
    .filter((event) => new Date(event.startAt).getTime() >= now)
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
    .slice(0, 5), [events, now]);

  return (
    <Panel
      title="Upcoming Agenda"
      action={(
        <button type="button" className="text-xs font-medium text-gray-500 hover:text-gray-900" onClick={onSeeCalendar}>
          View calendar
        </button>
      )}
      className="h-full"
    >
      <div className="divide-y divide-gray-100">
        {upcoming.map((event) => {
          const date = formatEventDate(event.startAt);
          return (
            <button
              type="button"
              key={event.id}
              onClick={() => onOpenEvent(event)}
              className="block w-full px-4 py-3 text-left transition hover:bg-gray-50"
            >
              <span className="inline-flex rounded bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700">
                {date.date} · {date.time}
              </span>
              <span className="mt-2 block text-xs font-semibold text-gray-900">{event.title}</span>
              <span className="mt-1 block line-clamp-2 text-[11px] leading-4 text-gray-500">{event.description}</span>
            </button>
          );
        })}
        {upcoming.length === 0 && (
          <p className="px-4 py-8 text-center text-xs text-gray-500">No upcoming events. Add one in Calendar.</p>
        )}
      </div>
    </Panel>
  );
}

function EmailOpenRate({ emailStats }) {
  const firstMonth = emailStats[0];
  const lastMonth = emailStats[emailStats.length - 1];
  const [rangeStart, setRangeStart] = useState(firstMonth ? `${firstMonth.year}-${String(firstMonth.month + 1).padStart(2, "0")}` : "");
  const [rangeEnd, setRangeEnd] = useState(lastMonth ? `${lastMonth.year}-${String(lastMonth.month + 1).padStart(2, "0")}` : "");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const rangeStats = useMemo(() => emailStats.filter((item) => {
    const key = `${item.year}-${String(item.month + 1).padStart(2, "0")}`;
    return (!rangeStart || key >= rangeStart) && (!rangeEnd || key <= rangeEnd);
  }), [emailStats, rangeEnd, rangeStart]);
  const summaryStats = selectedMonth === "all"
    ? rangeStats
    : rangeStats.filter((item) => item.month === Number(selectedMonth));
  const delivered = summaryStats.reduce((total, item) => total + item.delivered, 0);
  const opened = summaryStats.reduce((total, item) => total + item.opened, 0);
  const average = delivered ? (opened / delivered) * 100 : 0;
  const availableMonths = [...new Map(emailStats.map((item) => [`${item.year}-${item.month}`, item])).values()];

  return (
    <Panel
      title="Average Email Open Rate"
      subtitle="Opened emails divided by delivered emails"
      action={(
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="email-range-start">Start month</label>
          <input
            id="email-range-start"
            aria-label="Email statistics start month"
            type="month"
            value={rangeStart}
            max={rangeEnd || undefined}
            onChange={(event) => setRangeStart(event.target.value)}
            className={inputClass}
          />
          <span className="text-xs text-gray-400">to</span>
          <label className="sr-only" htmlFor="email-range-end">End month</label>
          <input
            id="email-range-end"
            aria-label="Email statistics end month"
            type="month"
            value={rangeEnd}
            min={rangeStart || undefined}
            onChange={(event) => setRangeEnd(event.target.value)}
            className={inputClass}
          />
          <label className="sr-only" htmlFor="email-month">Select month</label>
          <select id="email-month" aria-label="Select email month" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} className={inputClass}>
            <option value="all">All months</option>
            {availableMonths.map((item) => (
              <option key={`${item.year}-${item.month}`} value={item.month}>{item.monthName} {item.year}</option>
            ))}
          </select>
        </div>
      )}
    >
      <div className="px-4 pb-4 pt-3">
        <div className="flex items-end gap-2">
          <p className="text-3xl font-semibold tracking-tight text-gray-950">{average.toFixed(2)}%</p>
          <p className="pb-1 text-xs text-gray-500">{opened.toLocaleString()} of {delivered.toLocaleString()} delivered</p>
        </div>
        <div className="-mx-4 overflow-x-auto px-4">
          <div className="relative mt-5 flex h-48 min-w-[560px] items-end justify-between gap-2 pl-9">
            <div className="absolute inset-0 bottom-6 left-9 flex flex-col justify-between" aria-hidden="true">
              {[100, 75, 50, 25, 0].map((value) => (
                <div key={value} className="relative border-t border-dashed border-gray-200">
                  <span className="absolute -left-9 -top-2.5 w-7 text-right text-[10px] text-gray-400">{value}%</span>
                </div>
              ))}
            </div>
            {monthNames.map((name, month) => {
              const item = emailStats.find((entry) => entry.month === month);
              const monthKey = item ? `${item.year}-${String(item.month + 1).padStart(2, "0")}` : "";
              const inRange = Boolean(item && (!rangeStart || monthKey >= rangeStart) && (!rangeEnd || monthKey <= rangeEnd));
              const rate = item?.delivered ? (item.opened / item.delivered) * 100 : 0;
              const isSelected = selectedMonth === "all" || Number(selectedMonth) === month;
              const visibleRate = inRange ? rate : 0;
              return (
                <div key={name} className="group relative z-10 flex h-full min-w-0 flex-1 flex-col items-center justify-end">
                  <div
                    title={`${name}: ${rate.toFixed(2)}% (${item?.opened ?? 0}/${item?.delivered ?? 0} delivered)`}
                    aria-label={`${name} open rate ${rate.toFixed(2)} percent`}
                    className={`w-full max-w-7 rounded-t-sm transition-colors ${isSelected ? "bg-gray-800 hover:bg-blue-700" : "bg-gray-300 hover:bg-gray-500"}`}
                    style={{ height: `${Math.max(visibleRate, inRange && rate > 0 ? 2 : 0)}%` }}
                  />
                  <span className={`mt-2 text-[10px] ${isSelected ? "text-gray-700" : "text-gray-400"}`}>{name.slice(0, 3)}</span>
                  <span role="tooltip" className="pointer-events-none absolute bottom-8 hidden whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[10px] text-white group-hover:block group-focus-within:block">
                    {name}: {rate.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function PeopleTable({ contacts, onOpenContacts }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [gender, setGender] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const categories = [...new Set(contacts.map((contact) => contact.category).filter(Boolean))].sort();
  const genders = [...new Set(contacts.map((contact) => contact.gender || "Not specified"))].sort();
  const visibleContacts = contacts
    .filter((contact) => category === "all" || contact.category === category)
    .filter((contact) => gender === "all" || (contact.gender || "Not specified") === gender)
    .filter((contact) => [contact.name, contact.email, contact.phone, contact.category, contact.location, contact.gender]
      .some((value) => String(value ?? "").toLowerCase().includes(search.trim().toLowerCase())))
    .sort((a, b) => String(a[sortField] ?? "").localeCompare(String(b[sortField] ?? "")) * sortDirection);

  function sortBy(field) {
    if (sortField === field) setSortDirection((direction) => direction * -1);
    else {
      setSortField(field);
      setSortDirection(1);
    }
  }

  function toggleContact(id) {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((selectedId) => selectedId !== id)
      : [...current, id]);
  }

  function toggleVisible() {
    const visibleIds = visibleContacts.map((contact) => contact.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds((current) => allSelected
      ? current.filter((id) => !visibleIds.includes(id))
      : [...new Set([...current, ...visibleIds])]);
  }

  function reset() {
    setSearch("");
    setCategory("all");
    setGender("all");
    setSortField("name");
    setSortDirection(1);
    setSelectedIds([]);
  }

  const selectedVisible = visibleContacts.length > 0 && visibleContacts.every((contact) => selectedIds.includes(contact.id));
  const columns = [
    ["name", "Name"], ["email", "Email"], ["phone", "Phone"], ["category", "Category"],
    ["location", "Location"], ["gender", "Gender"],
  ];

  return (
    <Panel
      title="People"
      subtitle={`${contacts.length} contacts`}
      action={(
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input aria-label="Search people" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search contacts" className={`${inputClass} pl-8`} />
          </label>
          <label className="sr-only" htmlFor="people-category">Filter by category</label>
          <select id="people-category" aria-label="Filter people by category" value={category} onChange={(event) => setCategory(event.target.value)} className={inputClass}>
            <option value="all">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <label className="sr-only" htmlFor="people-gender">Filter by gender</label>
          <select id="people-gender" aria-label="Filter people by gender" value={gender} onChange={(event) => setGender(event.target.value)} className={inputClass}>
            <option value="all">All genders</option>
            {genders.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button type="button" aria-label="Reset people filters" onClick={reset} className="inline-flex h-9 items-center gap-1 rounded-md border border-gray-200 px-2.5 text-xs text-gray-600 hover:bg-gray-50">
            <X size={13} />Reset
          </button>
        </div>
      )}
    >
      <div className="border-b border-gray-100 px-4 py-2 text-[11px] text-gray-500">
        {selectedIds.length} selected
        <button type="button" onClick={onOpenContacts} className="ml-3 font-medium text-gray-700 hover:text-black">Open Contacts</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-xs">
          <thead className="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500">
            <tr>
              <th className="w-10 px-4 py-3"><input aria-label="Select all visible contacts" type="checkbox" checked={selectedVisible} onChange={toggleVisible} /></th>
              {columns.map(([field, label]) => (
                <th key={field} className="px-3 py-3">
                  <button type="button" onClick={() => sortBy(field)} className="inline-flex items-center gap-1 hover:text-gray-900">
                    {label}<ArrowDownUp size={11} />
                  </button>
                </th>
              ))}
              <th className="px-3 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleContacts.map((contact) => (
              <tr key={contact.id} className="border-t border-gray-100 text-gray-600 hover:bg-gray-50/70">
                <td className="px-4 py-3"><input aria-label={`Select ${contact.name}`} type="checkbox" checked={selectedIds.includes(contact.id)} onChange={() => toggleContact(contact.id)} /></td>
                <td className="px-3 py-3 font-medium text-gray-900">{contact.name}</td>
                <td className="px-3 py-3"><a className="hover:underline" href={`mailto:${contact.email}`}>{contact.email}</a></td>
                <td className="px-3 py-3">{contact.phone || "—"}</td>
                <td className="px-3 py-3">{contact.category || "—"}</td>
                <td className="px-3 py-3"><span className="inline-flex items-center gap-1"><MapPin size={12} />{contact.location || "—"}</span></td>
                <td className="px-3 py-3">{contact.gender || "Not specified"}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <a aria-label={`Call ${contact.name}`} href={`tel:${(contact.phone || "").replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1 rounded border border-gray-200 px-2 py-1 hover:bg-white"><Phone size={12} />Call</a>
                    <a aria-label={`Mail ${contact.name}`} href={`mailto:${contact.email}`} className="inline-flex items-center gap-1 rounded border border-gray-200 px-2 py-1 hover:bg-white"><Mail size={12} />Mail</a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibleContacts.length === 0 && <p className="px-4 py-8 text-center text-xs text-gray-500">No contacts match these filters.</p>}
      </div>
    </Panel>
  );
}

function CompanyTable({ companies, onOpenCompany, selectedIndustry, onSelectIndustry }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [location, setLocation] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState(1);
  const industries = [...new Set(companies.map((company) => company.industry).filter(Boolean))].sort();
  const locations = [...new Set(companies.map((company) => company.location).filter(Boolean))].sort();
  const visibleCompanies = companies
    .filter((company) => !selectedIndustry || company.industry === selectedIndustry)
    .filter((company) => status === "all" || company.status === status)
    .filter((company) => location === "all" || company.location === location)
    .filter((company) => [company.name, company.industry, company.location, company.status]
      .some((value) => String(value ?? "").toLowerCase().includes(search.trim().toLowerCase())))
    .sort((a, b) => String(a[sortBy] ?? "").localeCompare(String(b[sortBy] ?? "")) * sortDirection);

  function reset() {
    setSearch("");
    setStatus("all");
    setLocation("all");
    setSortBy("name");
    setSortDirection(1);
    onSelectIndustry("");
  }

  return (
    <Panel  
      title="Companies" 
      subtitle={`${companies.length} companies`}
      action={(
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input aria-label="Search companies" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" className={`${inputClass} w-36 pl-8`} />
          </label>
          <label className="sr-only" htmlFor="company-industry">Filter by industry</label>
          <select id="company-industry" aria-label="Filter companies by industry" value={selectedIndustry} onChange={(event) => onSelectIndustry(event.target.value)} className={inputClass}>
            <option value="">All industries</option>
            {industries.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
          </select>
          <label className="sr-only" htmlFor="company-location">Filter by location</label>
          <select id="company-location" aria-label="Filter companies by location" value={location} onChange={(event) => setLocation(event.target.value)} className={inputClass}>
            <option value="all">All locations</option>
            {locations.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <label className="sr-only" htmlFor="company-status">Filter by status</label>
          <select id="company-status" aria-label="Filter companies by status" value={status} onChange={(event) => setStatus(event.target.value)} className={inputClass}>
            <option value="all">All statuses</option>
            <option value="Active">Active</option>
            <option value="Lead">Lead</option>
          </select>
          <button type="button" aria-label="Reset company filters" onClick={reset} className="inline-flex h-9 items-center gap-1 rounded-md border border-gray-200 px-2.5 text-xs text-gray-600 hover:bg-gray-50">
            <X size={13} />Reset
          </button>
        </div>
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-xs">
          <thead className="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500">
            <tr>
              {[
                ["name", "Company Name"], ["industry", "Industry"], ["location", "Location"], ["status", "Status"],
              ].map(([field, label]) => (
                <th key={field} className="px-4 py-3">
                  <button type="button" onClick={() => {
                    if (sortBy === field) setSortDirection((direction) => direction * -1);
                    else {
                      setSortBy(field);
                      setSortDirection(1);
                    }
                  }} className="inline-flex items-center gap-1 hover:text-gray-900">{label}<ArrowDownUp size={11} /></button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleCompanies.map((company) => (
              <tr key={company.id} className="border-t border-gray-100 text-gray-600 hover:bg-gray-50/70">
                <td className="px-4 py-3">
                  <button type="button" onClick={() => onOpenCompany(company)} className="font-medium text-gray-900 hover:underline">{company.name}</button>
                </td>
                <td className="px-4 py-3">{company.industry}</td>
                <td className="px-4 py-3">{company.location}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-medium ${company.status === "Active" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>{company.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibleCompanies.length === 0 && <p className="px-4 py-8 text-center text-xs text-gray-500">No companies match these filters.</p>}
      </div>
      <button type="button" onClick={reset} className="m-4 inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900">
        <Filter size={13} />Clear filters
      </button>
    </Panel>
  );
}

function CompanyCategories({ companies, selectedIndustry, onSelectIndustry }) {
  const totals = new Map();
  for (const company of companies) {
    const industry = company.industry || "Uncategorized";
    totals.set(industry, (totals.get(industry) ?? 0) + 1);
  }
  const categories = [...totals.entries()].sort(([a], [b]) => a.localeCompare(b));
  const totalCompanies = companies.length;
  const slices = categories.map(([, count], index) => {
    const start = categories
      .slice(0, index)
      .reduce((sum, [, previousCount]) => sum + (totalCompanies ? (previousCount / totalCompanies) * 100 : 0), 0);
    const end = start + (totalCompanies ? (count / totalCompanies) * 100 : 0);
    return `${categoryColors[index % categoryColors.length]} ${start}% ${end}%`;
  });

  return (
    <Panel title="Company Categories" subtitle="Distribution by industry">
      <div className="flex flex-col items-center px-4 py-5">
        <div
          className="relative flex size-36 items-center justify-center rounded-full"
          style={{ background: slices.length ? `conic-gradient(${slices.join(", ")})` : "#e5e7eb" }}
          role="img"
          aria-label={`Company distribution across ${categories.length} industries`}
        >
          <div className="flex size-24 flex-col items-center justify-center rounded-full bg-white text-center">
            <strong className="text-xl font-semibold text-gray-900">{totalCompanies}</strong>
            <span className="text-[10px] text-gray-500">Companies</span>
          </div>
        </div>
        <ul className="mt-5 w-full space-y-2">
          {categories.map(([name, count], index) => (
            <li key={name}>
              <button
                type="button"
                aria-pressed={selectedIndustry === name}
                onClick={() => onSelectIndustry(selectedIndustry === name ? "" : name)}
                className={`flex w-full items-center justify-between gap-3 rounded px-1 py-1 text-left text-xs hover:bg-gray-50 ${selectedIndustry === name ? "font-semibold text-gray-950" : "text-gray-600"}`}
              >
                <span className="inline-flex min-w-0 items-center gap-2">
                  <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: categoryColors[index % categoryColors.length] }} />
                  <span className="truncate">{name}</span>
                </span>
                <span className="shrink-0">{count} <span className="text-gray-400">{totalCompanies ? Math.round((count / totalCompanies) * 100) : 0}%</span></span>
              </button>
            </li>
          ))}
          {categories.length === 0 && <li className="text-xs text-gray-500">No companies to categorize yet.</li>}
        </ul>
      </div>
    </Panel>
  );
}

function DashboardPage() {
  const { contacts, tasks, companies, calendarEvents, emailStats } = useCRMData();
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const sentCount = emailStats.reduce((total, item) => total + item.sent, 0);
  const activeCompanies = companies.filter((company) => company.status === "Active").length;
  const ongoingTasks = tasks.filter((task) => task.status !== "completed").length;

  function openEvent(event) {
    navigate("/calendar", { state: { openEventId: event.id } });
  }

  function openCompany(company) {
    navigate("/companies", { state: { openCompanyId: company.id } });
  }

  return (
    <section className="min-h-full bg-gray-50/50">
      <div className="border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="space-y-5 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard title="Email Sent" value={sentCount} suffix="emails" icon={Mail} onClick={() => navigate("/emails")} />
          <SummaryCard title="Active Company" value={activeCompanies} suffix="companies" icon={Building2} onClick={() => navigate("/companies")} />
          <SummaryCard title="Total Contact" value={contacts.length} suffix="contacts" icon={Users} onClick={() => navigate("/contacts")} />
          <SummaryCard title="Ongoing Task" value={ongoingTasks} suffix="tasks" icon={Clock3} onClick={() => navigate("/tasks")} />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(220px,0.7fr)_minmax(0,2fr)]">
          <UpcomingAgenda events={calendarEvents} onOpenEvent={openEvent} onSeeCalendar={() => navigate("/calendar")} />
          <EmailOpenRate emailStats={emailStats} />
        </div>

        <PeopleTable contacts={contacts} onOpenContacts={() => navigate("/contacts")} />

        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(260px,0.9fr)]">
          <CompanyTable
            companies={companies}
            onOpenCompany={openCompany}
            selectedIndustry={selectedIndustry}
            onSelectIndustry={setSelectedIndustry}
          />
          <CompanyCategories companies={companies} selectedIndustry={selectedIndustry} onSelectIndustry={setSelectedIndustry} />
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
