import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  List,
  ListFilter,
  ListSortDescending,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Plus,
  Send,
  Table2,
  Users,
  X,
} from "lucide-react";
import { useNotifications } from "./NotificationContext.jsx";
import { useCRMData } from "./CRMDataContext.jsx";

const taskColumns = [
  { id: "planned", label: "Planned", dot: "bg-yellow-400" },
  { id: "upcoming", label: "Upcoming", dot: "bg-indigo-500" },
  { id: "completed", label: "Completed", dot: "bg-emerald-500" },
];

const tagStyles = {
  Document: "bg-blue-50 text-blue-700",
  Event: "bg-purple-50 text-purple-700",
  Internal: "bg-orange-50 text-orange-700",
  Marketing: "bg-yellow-50 text-yellow-700",
  Report: "bg-green-50 text-green-700",
  Urgent: "bg-red-50 text-red-700",
};

const members = [
  { id: "FM", name: "Floyd Miles", initials: "FM" },
  { id: "DR", name: "Dianne Russell", initials: "DR" },
  { id: "AB", name: "Annette Black", initials: "AB" },
  { id: "BS", name: "Brooklyn Simmons", initials: "BS" },
  { id: "RF", name: "Robert Fox", initials: "RF" },
  { id: "CW", name: "Cameron Williamson", initials: "CW" },
  { id: "AF", name: "Albert Flores", initials: "AF" },
];

const avatarStyles = [
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-800",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
];

function formatDueDate(dateString) {
  if (!dateString) return "No due date";
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getTaskProgress(task) {
  const items = task.checklists.flatMap((checklist) => checklist.items);
  return `${items.filter((item) => item.done).length}/${items.length}`;
}

function makeActivity(text) {
  return {
    id: `activity-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    text,
    createdAt: "Just now",
  };
}

function AddTaskModal({ initialStatus, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState(initialStatus === "choose" ? "" : initialStatus);
  const [tags, setTags] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onAdd({
      id: `${Date.now()}-${Math.random()}`,
      title: title.trim(),
      status,
      dueDate,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      assignees: [],
      description: "",
      checklists: [],
      comments: [],
      activity: [makeActivity("Brian F. created this task")],
      attachments: [],
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="add-task-title"
        aria-modal="true"
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        role="dialog"
      >
        <div className="mb-5">
          <h2 id="add-task-title" className="text-lg font-semibold text-gray-900">
            Create task
          </h2>
          <p className="mt-1 text-sm text-gray-500">Add a task to your list.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">
            Task name
            <input
              autoFocus
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              placeholder="Enter a task name"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Due date
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Status
            <span className="relative mt-1 block">
              <select
                required
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full appearance-none rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
              >
                <option value="" disabled>Choose a status</option>
                {taskColumns.map((column) => (
                  <option key={column.id} value={column.id}>{column.label}</option>
                ))}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </span>
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Labels <span className="font-normal text-gray-400">(optional)</span>
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              placeholder="Separate labels with commas"
            />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
              Add Task
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function AvatarStack({ assignees, size = "size-6" }) {
  return (
    <div className="flex -space-x-2" aria-label="Task members">
      {assignees.length ? assignees.map((id, index) => {
        const member = members.find((item) => item.id === id);
        if (!member) return null;
        return (
          <span
            key={id}
            title={member.name}
            className={`flex ${size} items-center justify-center rounded-full border-2 border-white text-[8px] font-semibold ${avatarStyles[index % avatarStyles.length]}`}
          >
            {member.initials}
          </span>
        );
      }) : (
        <span className={`flex ${size} items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-400`}>
          <Users size={12} />
        </span>
      )}
    </div>
  );
}

function Tag({ label }) {
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium ${tagStyles[label] ?? "bg-gray-100 text-gray-700"}`}>
      {label}
    </span>
  );
}

function TaskRow({ task, onOpen, onToggleComplete, showProgress = false }) {
  return (
    <article className={`${showProgress ? "min-w-[780px] grid-cols-[minmax(230px,1.7fr)_minmax(125px,.8fr)_minmax(160px,1.2fr)_minmax(105px,.7fr)_minmax(80px,.5fr)]" : "min-w-[690px] grid-cols-[minmax(230px,1.7fr)_minmax(125px,.8fr)_minmax(160px,1.2fr)_minmax(105px,.7fr)]"} grid items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50/70`}>
      <div className="flex min-w-0 items-center gap-3">
        <input
          type="checkbox"
          checked={task.status === "completed"}
          aria-label={`Mark ${task.title} ${task.status === "completed" ? "incomplete" : "complete"}`}
          onChange={() => onToggleComplete(task)}
          className="size-4 shrink-0 cursor-pointer accent-gray-900"
        />
        <button
          type="button"
          className={`truncate text-left text-sm font-medium hover:underline ${task.status === "completed" ? "text-gray-400 line-through" : "text-gray-800"}`}
          onClick={() => onOpen(task.id)}
        >
          {task.title}
        </button>
      </div>
      <button type="button" className="flex items-center gap-1.5 text-left text-xs text-gray-500 hover:text-gray-900" onClick={() => onOpen(task.id)}>
        <CalendarDays size={13} className="shrink-0" />
        <span>{formatDueDate(task.dueDate)}</span>
      </button>
      <button type="button" className="flex min-w-0 flex-wrap gap-1 text-left" aria-label={`Edit labels for ${task.title}`} onClick={() => onOpen(task.id)}>
        {task.tags.length ? task.tags.slice(0, 3).map((tag) => <Tag key={tag} label={tag} />) : <span className="text-xs text-gray-400">Add label</span>}
      </button>
      <div className="flex items-center justify-between gap-2">
        <button type="button" aria-label={`View members for ${task.title}`} onClick={() => onOpen(task.id)}>
          <AvatarStack assignees={task.assignees} size="size-6" />
        </button>
        <button type="button" aria-label={`Open ${task.title} details`} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" onClick={() => onOpen(task.id)}>
          <MoreHorizontal size={16} />
        </button>
      </div>
      {showProgress && (
        <span className="text-xs text-gray-500">{getTaskProgress(task)}</span>
      )}
    </article>
  );
}

function TaskCard({ task, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(task.id)}
      className="block w-full rounded border border-gray-200 bg-white p-3 text-left hover:border-gray-300 hover:shadow-sm"
    >
      <div className="flex flex-wrap gap-1">
        {task.tags.map((tag) => <Tag key={tag} label={tag} />)}
      </div>
      <h3 className="mt-2 text-sm font-medium leading-5 text-gray-900">{task.title}</h3>
      <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-gray-500">
        <span className="inline-flex items-center gap-1"><CalendarDays size={13} />{formatDueDate(task.dueDate)}</span>
        <span className="inline-flex items-center gap-1"><List size={13} />{getTaskProgress(task)}</span>
      </div>
      <footer className="mt-2 flex items-center justify-between">
        <AvatarStack assignees={task.assignees} size="size-5" />
        <span className="flex items-center gap-2 text-[10px] text-gray-500">
          <span className="inline-flex items-center gap-1"><Paperclip size={12} />{task.attachments.length}</span>
          <span className="inline-flex items-center gap-1"><MessageCircle size={12} />{task.comments.length}</span>
        </span>
      </footer>
    </button>
  );
}

function TaskDetails({ task, onClose, updateTask, addNotification }) {
  const [description, setDescription] = useState(task.description);
  const [comment, setComment] = useState("");
  const [itemDrafts, setItemDrafts] = useState({});
  const [memberMenuOpen, setMemberMenuOpen] = useState(false);
  const [labelMenuOpen, setLabelMenuOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  function changeTask(updater, activityText) {
    const activity = makeActivity(activityText);
    updateTask(task.id, (current) => ({
      ...updater(current),
      activity: [activity, ...current.activity],
    }));
  }

  function toggleMember(memberId) {
    const adding = !task.assignees.includes(memberId);
    const member = members.find((item) => item.id === memberId);
    changeTask(
      (current) => ({
        ...current,
        assignees: adding
          ? [...current.assignees, memberId]
          : current.assignees.filter((id) => id !== memberId),
      }),
      `${adding ? "Assigned" : "Removed"} ${member.name} ${adding ? "to" : "from"} this task`,
    );
    if (adding) {
      addNotification({
        type: "task",
        relatedType: "task",
        taskId: task.id,
        relatedName: task.title,
        actor: "Dhanush M",
        actorInitials: "DM",
        avatarClass: "bg-gray-100 text-gray-700",
        message: `assigned ${member.name} to this task`,
        dedupeKey: `task:${task.id}:assign:${memberId}`,
      });
    }
  }

  function toggleLabel(label) {
    const adding = !task.tags.includes(label);
    changeTask(
      (current) => ({
        ...current,
        tags: adding
          ? [...current.tags, label]
          : current.tags.filter((tag) => tag !== label),
      }),
      `${adding ? "Added" : "Removed"} the ${label} label`,
    );
  }

  function addLabel(event) {
    event.preventDefault();
    const label = newLabel.trim();
    if (!label || task.tags.includes(label)) return;
    toggleLabel(label);
    setNewLabel("");
  }

  function addComment(event) {
    event.preventDefault();
    const text = comment.trim();
    if (!text) return;
    const createdComment = {
      id: `comment-${Date.now()}`,
      author: "Brian F.",
      text,
      createdAt: "Just now",
    };
    const activity = makeActivity("Brian F. added a comment");
    updateTask(task.id, (current) => ({
      ...current,
      comments: [...current.comments, createdComment],
      activity: [activity, ...current.activity],
    }));
    const isMention = /@(?:dhanushm?|brianf)\b/i.test(text);
    addNotification({
      type: isMention ? "mention" : "task",
      relatedType: "task",
      taskId: task.id,
      relatedName: task.title,
      actor: "Brian F.",
      actorInitials: "BF",
      avatarClass: "bg-sky-100 text-sky-700",
      message: isMention
        ? `mentioned you in a comment: ${text}`
        : `commented on this task: ${text}`,
      dedupeKey: `task:${task.id}:comment:${text}`,
      ...(isMention ? { reply: "" } : {}),
    });
    setComment("");
  }

  function addChecklist() {
    const checklist = {
      id: `checklist-${Date.now()}`,
      title: "New Checklist",
      items: [],
    };
    changeTask((current) => ({
      ...current,
      checklists: [...current.checklists, checklist],
    }), "Added a checklist");
  }

  function addChecklistItem(checklistId) {
    const text = (itemDrafts[checklistId] ?? "").trim();
    if (!text) return;
    changeTask((current) => ({
      ...current,
      checklists: current.checklists.map((checklist) => (
        checklist.id === checklistId
          ? {
            ...checklist,
            items: [...checklist.items, {
              id: `item-${Date.now()}`,
              text,
              done: false,
            }],
          }
          : checklist
      )),
    }), "Added a checklist item");
    setItemDrafts((current) => ({ ...current, [checklistId]: "" }));
  }

  function toggleChecklistItem(checklistId, itemId) {
    const currentItem = task.checklists
      .find((checklist) => checklist.id === checklistId)
      ?.items.find((item) => item.id === itemId);
    if (!currentItem) return;
    changeTask((current) => ({
      ...current,
      checklists: current.checklists.map((checklist) => (
        checklist.id === checklistId
          ? {
            ...checklist,
            items: checklist.items.map((item) => (
              item.id === itemId ? { ...item, done: !item.done } : item
            )),
          }
          : checklist
      )),
    }), `${currentItem.done ? "Unchecked" : "Completed"} "${currentItem.text}"`);
  }

  function handleFiles(event) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    changeTask((current) => ({
      ...current,
      attachments: [...current.attachments, ...files.map((file) => file.name)],
    }), `Added ${files.length} attachment${files.length === 1 ? "" : "s"}`);
    event.target.value = "";
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="task-details-title"
        aria-modal="true"
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
        role="dialog"
      >
        <header className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <h2 id="task-details-title" className="min-w-0 truncate text-base font-semibold text-gray-900">
            {task.title}
          </h2>
          <button type="button" aria-label="Close task details" className="rounded p-1 text-gray-500 hover:bg-gray-100" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="min-w-0 space-y-5 px-5 py-4">
            <section>
              <h3 className="mb-1 text-xs font-semibold text-gray-900">Description</h3>
              <textarea
                aria-label="Task description"
                rows={2}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full resize-y rounded border border-transparent bg-white p-0 text-xs leading-5 text-gray-500 outline-none focus:border-gray-300 focus:p-2"
                placeholder="Add task details..."
              />
              {description !== task.description && (
                <button
                  type="button"
                  className="mt-1 rounded bg-gray-900 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-gray-700"
                  onClick={() => {
                    changeTask((current) => ({ ...current, description }), "Updated the task description");
                    addNotification({
                      type: "task",
                      relatedType: "task",
                      taskId: task.id,
                      relatedName: task.title,
                      actor: "Dhanush M",
                      actorInitials: "DM",
                      avatarClass: "bg-gray-100 text-gray-700",
                      message: "updated the task description",
                      dedupeKey: `task:${task.id}:description:${description}`,
                    });
                  }}
                >
                  Save description
                </button>
              )}
            </section>

            <section>
              <div className="mb-2 flex items-center gap-2">
                <ChevronDown size={14} className="text-gray-500" />
                <h3 className="text-xs font-semibold text-gray-900">Task Checklist</h3>
              </div>
              {task.checklists.map((checklist) => (
                <div key={checklist.id} className="mb-4">
                  <h4 className="mb-2 border-b border-gray-200 pb-1 text-xs font-medium text-gray-800">
                    {checklist.title}
                  </h4>
                  <ul className="space-y-2">
                    {checklist.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-2 text-xs text-gray-600">
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={() => toggleChecklistItem(checklist.id, item.id)}
                          aria-label={`${item.done ? "Uncheck" : "Complete"} ${item.text}`}
                          className="size-3.5 accent-gray-900"
                        />
                        <span className={item.done ? "text-gray-400 line-through" : ""}>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <form
                    className="mt-2 flex gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      addChecklistItem(checklist.id);
                    }}
                  >
                    <input
                      value={itemDrafts[checklist.id] ?? ""}
                      onChange={(event) => setItemDrafts((current) => ({ ...current, [checklist.id]: event.target.value }))}
                      className="min-w-0 flex-1 border-b border-transparent px-1 py-1 text-xs outline-none placeholder:text-gray-400 focus:border-gray-300"
                      placeholder="+ Add item"
                      aria-label={`Add item to ${checklist.title}`}
                    />
                    {(itemDrafts[checklist.id] ?? "").trim() && (
                      <button type="submit" aria-label={`Save item to ${checklist.title}`} className="text-gray-500 hover:text-gray-900">
                        <Plus size={14} />
                      </button>
                    )}
                  </form>
                </div>
              ))}
              <button type="button" onClick={addChecklist} className="flex w-full items-center justify-center gap-2 rounded border border-gray-300 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
                <Plus size={14} />
                Add New Checklist
              </button>
            </section>

            <section>
              <form className="flex items-center gap-2 rounded border border-gray-300 px-2.5 py-2" onSubmit={addComment}>
                <input
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  aria-label="Add your comment"
                  className="min-w-0 flex-1 text-xs outline-none placeholder:text-gray-400"
                  placeholder="Add Your Comment"
                />
                <button type="submit" aria-label="Post comment" disabled={!comment.trim()} className="text-gray-400 hover:text-gray-800 disabled:cursor-not-allowed">
                  <Send size={14} />
                </button>
              </form>
              {task.comments.length > 0 && (
                <div className="mt-3 space-y-3">
                  {task.comments.map((item) => (
                    <article key={item.id} className="flex gap-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[8px] font-semibold text-sky-700">
                        {item.author.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-gray-800">{item.author}</p>
                        <p className="mt-1 rounded bg-gray-50 px-2 py-1.5 text-xs leading-4 text-gray-600">{item.text}</p>
                        <p className="mt-1 text-[10px] text-gray-400">{item.createdAt}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3 className="mb-2 text-xs font-semibold text-gray-800">Activity</h3>
              <div className="space-y-3">
                {task.activity.map((item) => (
                  <article key={item.id} className="flex gap-2">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[8px] font-semibold text-violet-700">
                      {item.text.startsWith("James") ? "JW" : "BF"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs leading-4 text-gray-700">{item.text}</p>
                      <p className="mt-1 text-[10px] text-gray-400">{item.createdAt}</p>
                    </div>
                  </article>
                ))}
                {task.activity.length === 0 && <p className="text-xs text-gray-400">No activity yet.</p>}
              </div>
            </section>
          </div>

          <aside className="space-y-5 border-t border-gray-200 px-5 py-4 md:border-l md:border-t-0">
            <section className="relative">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-800">Members</h3>
                <button type="button" aria-label="Assign members" aria-expanded={memberMenuOpen} className="rounded p-0.5 text-gray-500 hover:bg-gray-100" onClick={() => setMemberMenuOpen((open) => !open)}>
                  <Plus size={16} />
                </button>
              </div>
              <AvatarStack assignees={task.assignees} size="size-7" />
              {memberMenuOpen && (
                <div className="absolute right-0 top-9 z-10 max-h-52 w-56 overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg">
                  {members.map((member) => (
                    <label key={member.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                      <input type="checkbox" checked={task.assignees.includes(member.id)} onChange={() => toggleMember(member.id)} className="accent-gray-900" />
                      <span>{member.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3 className="mb-2 text-xs font-semibold text-gray-800">Due Date</h3>
              <label className="flex items-center gap-2 rounded border border-gray-300 px-2 py-1.5">
                <CalendarDays size={14} className="shrink-0 text-gray-500" />
                <input
                  type="date"
                  aria-label="Task due date"
                  value={task.dueDate}
                  onChange={(event) => {
                    const dueDate = event.target.value;
                    if (dueDate !== task.dueDate) {
                      changeTask((current) => ({ ...current, dueDate }), `Changed the due date to ${formatDueDate(dueDate)}`);
                      addNotification({
                        type: "task",
                        relatedType: "task",
                        taskId: task.id,
                        relatedName: task.title,
                        actor: "Dhanush M",
                        actorInitials: "DM",
                        avatarClass: "bg-gray-100 text-gray-700",
                        message: `changed the due date to ${formatDueDate(dueDate)}`,
                        dedupeKey: `task:${task.id}:due-date:${dueDate}`,
                      });
                    }
                  }}
                  className="min-w-0 w-full bg-transparent text-[11px] text-gray-700 outline-none"
                />
              </label>
            </section>

            <section className="relative">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-800">Labels</h3>
                <button type="button" aria-label="Add labels" aria-expanded={labelMenuOpen} className="rounded p-0.5 text-gray-500 hover:bg-gray-100" onClick={() => setLabelMenuOpen((open) => !open)}>
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => <Tag key={tag} label={tag} />)}
                {task.tags.length === 0 && <span className="text-xs text-gray-400">No labels</span>}
              </div>
              {labelMenuOpen && (
                <div className="absolute right-0 top-9 z-10 w-48 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
                  <div className="max-h-36 space-y-1 overflow-y-auto">
                    {Object.keys(tagStyles).map((tag) => (
                      <label key={tag} className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-xs hover:bg-gray-50">
                        <input type="checkbox" checked={task.tags.includes(tag)} onChange={() => toggleLabel(tag)} className="accent-gray-900" />
                        <Tag label={tag} />
                      </label>
                    ))}
                  </div>
                  <form className="mt-2 flex gap-1 border-t border-gray-100 pt-2" onSubmit={addLabel}>
                    <input value={newLabel} onChange={(event) => setNewLabel(event.target.value)} aria-label="Create a label" className="min-w-0 flex-1 text-xs outline-none" placeholder="New label" />
                    <button type="submit" aria-label="Add new label" className="text-gray-500 hover:text-gray-900"><Plus size={14} /></button>
                  </form>
                </div>
              )}
            </section>

            <section>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-800">Attachments</h3>
                <label className="cursor-pointer rounded p-0.5 text-gray-500 hover:bg-gray-100" title="Upload attachments">
                  <Plus size={16} />
                  <input type="file" multiple className="sr-only" onChange={handleFiles} />
                </label>
              </div>
              <ul className="space-y-1.5">
                {task.attachments.map((file, index) => (
                  <li key={`${file}-${index}`} className="flex items-center gap-2 text-xs text-gray-600">
                    <Paperclip size={13} className="shrink-0 text-gray-400" />
                    <span className="truncate">{file}</span>
                  </li>
                ))}
              </ul>
              {task.attachments.length === 0 && <p className="text-xs text-gray-400">No attachments</p>}
            </section>
          </aside>
        </div>
      </section>
    </div>
  );
}

function TaskPage() {
  const { tasks, addTask: addTaskToCRM, updateTask: updateTaskInCRM } = useCRMData();
  const [modalStatus, setModalStatus] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [filterBy, setFilterBy] = useState("all");
  const [view, setView] = useState("list");
  const location = useLocation();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const routeTaskId = location.state?.openTaskId;

  function openTask(taskId) {
    setSelectedTaskId(taskId);
    if (routeTaskId) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }

  function closeTask() {
    setSelectedTaskId(null);
    if (routeTaskId) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }

  const availableTags = [...new Set(tasks.flatMap((task) => task.tags))].sort((a, b) => a.localeCompare(b));

  function getColumnTasks(status) {
    return tasks
      .filter((task) => task.status === status && (filterBy === "all" || task.tags.includes(filterBy)))
      .sort((a, b) => {
        if (sortBy === "due-date") return (a.dueDate || "").localeCompare(b.dueDate || "");
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return 0;
      });
  }

  function addTask(task) {
    addTaskToCRM(task);
    setModalStatus(null);
  }

  function updateTask(id, updater) {
    updateTaskInCRM(id, updater);
  }

  function toggleComplete(task) {
    const completing = task.status !== "completed";
    updateTask(task.id, (current) => ({
      ...current,
      status: completing ? "completed" : "planned",
      completedAt: completing ? new Date().toISOString() : null,
      activity: [makeActivity(completing ? "Task marked as complete" : "Task marked as incomplete"), ...current.activity],
    }));
    if (completing) {
      addNotification({
        type: "task",
        relatedType: "task",
        taskId: task.id,
        relatedName: task.title,
        actor: "Dhanush M",
        actorInitials: "DM",
        avatarClass: "bg-gray-100 text-gray-700",
        message: "completed this task",
        dedupeKey: `task:${task.id}:completed`,
      });
    }
  }

  const selectedTask = tasks.find((task) => task.id === (routeTaskId ?? selectedTaskId));

  return (
    <section className="min-h-full">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-2">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold text-gray-900">Task</h1>
          <div className="flex items-center gap-4 self-stretch text-xs text-gray-500">
            <button type="button" aria-current={view === "list" ? "page" : undefined} onClick={() => setView("list")} className={`inline-flex items-center gap-1.5 border-b-2 py-2 ${view === "list" ? "border-gray-800 font-medium text-gray-900" : "border-transparent hover:text-gray-900"}`}>
              <List size={14} />List
            </button>
            <button type="button" aria-current={view === "kanban" ? "page" : undefined} onClick={() => setView("kanban")} className={`inline-flex items-center gap-1.5 border-b-2 py-2 ${view === "kanban" ? "border-gray-800 font-medium text-gray-900" : "border-transparent hover:text-gray-900"}`}>
              <span className="text-sm leading-none">▥</span>Kanban
            </button>
            <button type="button" aria-current={view === "table" ? "page" : undefined} onClick={() => setView("table")} className={`inline-flex items-center gap-1.5 border-b-2 py-2 ${view === "table" ? "border-gray-800 font-medium text-gray-900" : "border-transparent hover:text-gray-900"}`}>
              <Table2 size={13} />Table
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative">
            <ListSortDescending size={13} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-600" />
            <select aria-label="Sort tasks" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-8 appearance-none rounded border border-gray-300 bg-white py-1 pl-7 pr-2 text-[11px] text-gray-800 outline-none hover:bg-gray-50">
              <option value="default">Sort By</option>
              <option value="due-date">Due date</option>
              <option value="title">Task name</option>
            </select>
          </label>
          <label className="relative">
            <ListFilter size={13} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-600" />
            <select aria-label="Filter tasks by label" value={filterBy} onChange={(event) => setFilterBy(event.target.value)} className="h-8 max-w-32 appearance-none rounded border border-gray-300 bg-white py-1 pl-7 pr-2 text-[11px] text-gray-800 outline-none hover:bg-gray-50">
              <option value="all">Filter</option>
              {availableTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          </label>
          <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded bg-black px-3 text-[11px] font-medium text-white hover:bg-gray-800" onClick={() => setModalStatus("choose")}>
            <Plus size={13} />Add Task
          </button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="grid grid-cols-1 items-start gap-3 p-4 md:grid-cols-3">
          {taskColumns.map((column) => {
            const columnTasks = getColumnTasks(column.id);
            const totalInColumn = tasks.filter((task) => task.status === column.id).length;
            return (
              <section key={column.id} aria-labelledby={`column-${column.id}`} className="min-w-0 rounded border border-gray-200 bg-gray-50/50 p-2.5">
                <header className="mb-2 flex items-center gap-1.5">
                  <span className={`size-1.5 rounded-full ${column.dot}`} />
                  <h2 id={`column-${column.id}`} className="text-sm font-semibold text-gray-900">{column.label}</h2>
                  <span className="text-[10px] text-gray-500">{totalInColumn} tasks</span>
                </header>
                <button type="button" className="mb-2 flex h-8 w-full items-center justify-center gap-1 rounded bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200" onClick={() => setModalStatus(column.id)}>
                  <Plus size={13} />Create Task
                </button>
                <div className="space-y-2">
                  {columnTasks.map((task) => <TaskCard key={task.id} task={task} onOpen={openTask} />)}
                  {columnTasks.length === 0 && <p className="rounded border border-dashed border-gray-300 bg-white px-2 py-6 text-center text-xs text-gray-500">No tasks match this filter.</p>}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4 p-4">
          {taskColumns.map((column) => {
            const columnTasks = getColumnTasks(column.id);
            const totalInColumn = tasks.filter((task) => task.status === column.id).length;
            return (
              <section key={column.id} className="overflow-hidden rounded border border-gray-200 bg-white">
                <header className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-gray-50/60 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ChevronRight size={14} className="text-gray-400" />
                    <span className={`size-2 rounded-full ${column.dot}`} />
                    <h2 className="text-sm font-semibold text-gray-900">{column.label}</h2>
                    <span className="text-xs text-gray-500">{totalInColumn} tasks</span>
                  </div>
                  <button type="button" onClick={() => setModalStatus(column.id)} className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100">
                    <Plus size={13} />Add task
                  </button>
                </header>
                <div className="overflow-x-auto">
                  {view === "list" && (
                    <div className="grid min-w-[690px] grid-cols-[minmax(230px,1.7fr)_minmax(125px,.8fr)_minmax(160px,1.2fr)_minmax(105px,.7fr)] gap-3 border-b border-gray-200 px-4 py-2 text-[10px] font-medium uppercase tracking-wide text-gray-400">
                      <span>Task name</span><span>Due date</span><span>Labels</span><span>Members</span>
                    </div>
                  )}
                  {view === "table" && (
                    <div className="grid min-w-[780px] grid-cols-[minmax(230px,1.7fr)_minmax(125px,.8fr)_minmax(160px,1.2fr)_minmax(105px,.7fr)_minmax(80px,.5fr)] gap-3 border-b border-gray-200 px-4 py-2 text-[10px] font-medium uppercase tracking-wide text-gray-400">
                      <span>Task name</span><span>Due date</span><span>Labels</span><span>Members</span><span>Progress</span>
                    </div>
                  )}
                  {columnTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onOpen={openTask}
                      onToggleComplete={toggleComplete}
                      showProgress={view === "table"}
                    />
                  ))}
                  {columnTasks.length === 0 && <p className="px-4 py-6 text-center text-xs text-gray-500">No tasks match this filter.</p>}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {modalStatus && <AddTaskModal initialStatus={modalStatus} onClose={() => setModalStatus(null)} onAdd={addTask} />}
      {selectedTask && <TaskDetails key={selectedTask.id} task={selectedTask} updateTask={updateTask} addNotification={addNotification} onClose={closeTask} />}
    </section>
  );
}

export default TaskPage;
