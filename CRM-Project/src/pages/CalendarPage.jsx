import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { CalendarDays, Clock3, Pencil, Plus, Trash2, X } from "lucide-react";
import { useCRMData } from "./CRMDataContext.jsx";

const fieldClass = "mt-1 h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-500";

function CalendarEventForm({ event, onCancel, onSave }) {
  const [title, setTitle] = useState(event?.title ?? "");
  const [startAt, setStartAt] = useState(event?.startAt ?? "");
  const [description, setDescription] = useState(event?.description ?? "");

  function submit(formEvent) {
    formEvent.preventDefault();
    onSave({ title: title.trim(), startAt, description: description.trim() });
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:grid-cols-2">
      <label className="text-xs font-medium text-gray-700">
        Event title
        <input required autoFocus value={title} onChange={(event) => setTitle(event.target.value)} className={fieldClass} />
      </label>
      <label className="text-xs font-medium text-gray-700">
        Date and time
        <input required type="datetime-local" value={startAt} onChange={(event) => setStartAt(event.target.value)} className={fieldClass} />
      </label>
      <label className="text-xs font-medium text-gray-700 sm:col-span-2">
        Description
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
      </label>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" onClick={onCancel} className="rounded border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" className="rounded bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-700">{event ? "Save changes" : "Add event"}</button>
      </div>
    </form>
  );
}

function formatEventDate(startAt) {
  const date = new Date(startAt);
  return {
    date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
    time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

function CalendarPage() {
  const { calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useCRMData();
  const location = useLocation();
  const [now, setNow] = useState(0);
  const [selectedId, setSelectedId] = useState(location.state?.openEventId ?? null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const sortedEvents = useMemo(() => [...calendarEvents].sort(
    (a, b) => new Date(a.startAt) - new Date(b.startAt),
  ), [calendarEvents]);
  const selectedEvent = calendarEvents.find((event) => event.id === selectedId);

  useEffect(() => {
    const timerId = window.setTimeout(() => setNow(Date.now()), 0);
    const intervalId = window.setInterval(() => setNow(Date.now()), 60000);
    return () => {
      window.clearTimeout(timerId);
      window.clearInterval(intervalId);
    };
  }, []);

  function saveEvent(event) {
    if (editing) {
      updateCalendarEvent(editing.id, (current) => ({ ...current, ...event }));
      setEditing(null);
    } else {
      addCalendarEvent(event);
      setShowForm(false);
    }
  }

  function removeEvent(event) {
    if (!window.confirm(`Delete "${event.title}"?`)) return;
    deleteCalendarEvent(event.id);
    setSelectedId(null);
    setEditing(null);
  }

  return (
    <section className="min-h-full bg-gray-50/50">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Calendar</h1>
          <p className="mt-1 text-sm text-gray-500">Meetings and events appear on your Dashboard agenda.</p>
        </div>
        <button type="button" onClick={() => { setEditing(null); setShowForm((open) => !open); }} className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700">
          {showForm ? <X size={14} /> : <Plus size={14} />}{showForm ? "Close" : "Add event"}
        </button>
      </header>
      <div className="mx-auto max-w-4xl space-y-4 p-4 sm:p-6">
        {showForm && <CalendarEventForm onCancel={() => setShowForm(false)} onSave={saveEvent} />}
        {editing && <CalendarEventForm event={editing} onCancel={() => setEditing(null)} onSave={saveEvent} />}
        {selectedEvent && !editing && (
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selectedEvent.title}</h2>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays size={15} />{formatEventDate(selectedEvent.startAt).date}
                  <Clock3 size={15} />{formatEventDate(selectedEvent.startAt).time}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">{selectedEvent.description || "No description provided."}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setEditing(selectedEvent)} className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"><Pencil size={13} />Edit</button>
                <button type="button" onClick={() => removeEvent(selectedEvent)} className="inline-flex items-center gap-1.5 rounded border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50"><Trash2 size={13} />Delete</button>
                <button type="button" aria-label="Close event details" onClick={() => setSelectedId(null)} className="rounded p-2 text-gray-500 hover:bg-gray-100"><X size={15} /></button>
              </div>
            </div>
          </section>
        )}
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <header className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">Scheduled events</h2>
          </header>
          <div className="divide-y divide-gray-100">
            {sortedEvents.map((event) => {
              const date = formatEventDate(event.startAt);
              const past = new Date(event.startAt).getTime() < now;
              return (
                <div key={event.id} className={`flex flex-wrap items-center justify-between gap-3 px-4 py-4 ${selectedId === event.id ? "bg-blue-50/50" : "hover:bg-gray-50"}`}>
                  <button type="button" onClick={() => setSelectedId(event.id)} className="min-w-0 flex-1 text-left">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-gray-900">{event.title}</span>
                      {past && <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">Past</span>}
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">{date.date} at {date.time}</span>
                    <span className="mt-1 block truncate text-xs text-gray-400">{event.description}</span>
                  </button>
                  <button type="button" aria-label={`Edit ${event.title}`} onClick={() => { setShowForm(false); setEditing(event); }} className="rounded p-2 text-gray-500 hover:bg-gray-100"><Pencil size={14} /></button>
                </div>
              );
            })}
            {sortedEvents.length === 0 && <p className="px-4 py-10 text-center text-sm text-gray-500">No events scheduled yet.</p>}
          </div>
        </section>
      </div>
    </section>
  );
}

export default CalendarPage;
