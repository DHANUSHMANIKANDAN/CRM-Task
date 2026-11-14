import { useState } from "react";
import {
  ChartNoAxesCombined,
  FileText,
  ListFilter,
  ListSortDescending,
  Plus,
} from "lucide-react";

const tagStyles = {
  yellow: "bg-yellow-50 text-yellow-700",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  purple: "bg-purple-50 text-purple-700",
  orange: "bg-orange-50 text-orange-700",
  gray: "bg-gray-100 text-gray-700",
};

const sortOptions = [
  { value: "newest", label: "Recently added" },
  { value: "oldest", label: "Oldest first" },
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
];

const tagColorByLabel = {
  badge: "yellow",
  business: "purple",
  monthly: "green",
  personal: "orange",
  product: "blue",
  weekly: "yellow",
};

const avatarStyles = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-700",
];

const notes = [
  {
    title: "Product Team Meeting",
    tags: [
      { label: "Weekly", color: "yellow" },
      { label: "Product", color: "blue" },
    ],
    description: "This monthly progress agenda is following this items:",
    items: ["1.Introduction to Newest Product Plan", "2.Monthly Revenue updates for each"],
    author: "Floyd Miles",
    initials: "FM",
    avatar: "bg-orange-100 text-orange-700",
    date: "Mar 5 04:25",
  },
  {
    title: "Product Team Meeting",
    tags: [
      { label: "Monthly", color: "green" },
      { label: "Business", color: "purple" },
    ],
    description: "This monthly progress agenda is following this items:",
    items: ["1.Introduction to Newest Product Plan", "2.Monthly Revenue updates for each"],
    author: "Dianne Russell",
    initials: "DR",
    avatar: "bg-amber-100 text-amber-800",
    date: "Apr 11 18:30",
  },
  {
    title: "HR Interview",
    tags: [
      { label: "Personal", color: "orange" },
      { label: "Business", color: "purple" },
    ],
    description: "This monthly progress agenda is following this items:",
    items: ["1.Introduction to Newest Product Plan", "2.Monthly Revenue updates for each"],
    author: "Annette Black",
    initials: "AB",
    avatar: "bg-rose-100 text-rose-700",
    date: "Jun 23 14:31",
  },
  {
    title: "Monthly Team Progress",
    tags: [
      { label: "Monthly", color: "green" },
      { label: "Product", color: "blue" },
    ],
    description: "This monthly progress agenda is following this items:",
    items: ["1.Introduction to Newest Product Plan", "2.Monthly Revenue updates for each"],
    author: "Robert Fox",
    initials: "RF",
    avatar: "bg-sky-100 text-sky-700",
    date: "Jan 31 09:53",
  },
  {
    title: "Product Team Meeting",
    tags: [
      { label: "Monthly", color: "green" },
      { label: "Business", color: "purple" },
    ],
    description: "Some summaries of this weeks meeting with some conclusion we get:",
    items: ["1.Some of our product uploaded improved", "2.Monthly Revenue updates for each"],
    author: "Brooklyn Simmons",
    initials: "BS",
    avatar: "bg-emerald-100 text-emerald-700",
    date: "Aug 15 10:29",
  },
  {
    title: "Document Images",
    tags: [{ label: "Personal", color: "orange" }],
    description: "Report Document of Weekly Meetings",
    thumbnail: "document",
    author: "Cameron Williamson",
    initials: "CW",
    avatar: "bg-violet-100 text-violet-700",
    date: "Dec 30 21:28",
  },
  {
    title: "Weekly Team Progress",
    tags: [
      { label: "Badge", color: "yellow" },
      { label: "Product", color: "blue" },
    ],
    description: "This weekly progress agenda is following this items:",
    items: ["1.Introduction to Newest Product Plan", "2.Monthly Revenue updates for each"],
    author: "Dianne Russell",
    initials: "DR",
    avatar: "bg-amber-100 text-amber-800",
    date: "Feb 4 19:08",
  },
  {
    title: "Revenue Progress",
    tags: [{ label: "Business", color: "purple" }],
    description: "Some summaries of this weeks meeting with some conclusion we get:",
    thumbnail: "revenue",
    author: "Ronald Richards",
    initials: "RR",
    avatar: "bg-teal-100 text-teal-700",
    date: "May 22 04:43",
  },
  {
    title: "Monthly Products",
    tags: [{ label: "Product", color: "blue" }],
    description: "Report Document of Weekly Meetings",
    thumbnail: "products",
    author: "Albert Flores",
    initials: "AF",
    avatar: "bg-indigo-100 text-indigo-700",
    date: "Oct 4 15:49",
  },
];

function getTagStyle(color) {
  return tagStyles[color] ?? tagStyles.gray;
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatNoteDate(date) {
  const month = date.toLocaleString("en-US", { month: "short" });
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${month} ${date.getDate()} ${time}`;
}

function AddNoteModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState("");
  const [author, setAuthor] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const now = new Date();
    const noteTags = tags
      .split(",")
      .map((label) => label.trim())
      .filter(Boolean)
      .map((label) => ({
        label,
        color: tagColorByLabel[label.toLowerCase()] ?? "gray",
      }));

    onAdd({
      title: title.trim(),
      tags: noteTags,
      description: description.trim(),
      items: items
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean),
      author: author.trim(),
      initials: getInitials(author),
      avatar: avatarStyles[now.getMinutes() % avatarStyles.length],
      date: formatNoteDate(now),
      createdAt: now.getTime(),
      thumbnail: thumbnail || undefined,
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
        aria-labelledby="add-note-title"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
        role="dialog"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="add-note-title" className="text-lg font-semibold text-gray-900">
              Add a note
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter the details to add a card to your notes.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close form"
            className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">
            Title
            <input
              autoFocus
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              placeholder="e.g. Product Team Meeting"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Tags
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              placeholder="Separate tags with commas, e.g. Weekly, Product"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Description
            <textarea
              required
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-1 w-full resize-y rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              placeholder="Add a short description"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            List items
            <textarea
              rows={3}
              value={items}
              onChange={(event) => setItems(event.target.value)}
              className="mt-1 w-full resize-y rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              placeholder={"Add one item per line\nIntroduction to the new product plan"}
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Author
            <input
              required
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              placeholder="Your name"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Card preview
            <select
              value={thumbnail}
              onChange={(event) => setThumbnail(event.target.value)}
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
            >
              <option value="">No preview</option>
              <option value="document">Document</option>
              <option value="revenue">Revenue chart</option>
              <option value="products">Product chart</option>
            </select>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Add Note
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function NoteThumbnail({ type }) {
  if (type === "document") {
    return (
      <div className="mt-3 flex h-12 items-center justify-center rounded bg-gradient-to-r from-amber-50 to-stone-100">
        <FileText size={28} className="text-stone-500" strokeWidth={1.4} />
      </div>
    );
  }

  const bars =
    type === "revenue"
      ? ["h-4", "h-7", "h-5", "h-9", "h-6", "h-8"]
      : ["h-6", "h-9", "h-5", "h-7", "h-10", "h-6"];

  return (
    <div
      className={`mt-3 flex h-12 items-end justify-center gap-2 rounded px-5 pb-2 ${
        type === "revenue"
          ? "bg-gradient-to-r from-stone-100 to-amber-50"
          : "bg-gradient-to-r from-sky-50 to-indigo-50"
      }`}
    >
      {bars.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className={`w-5 rounded-t-sm ${
            type === "revenue" ? "bg-amber-200" : "bg-blue-200"
          } ${height}`}
        />
      ))}
      <ChartNoAxesCombined
        size={18}
        className="mb-1 text-gray-500"
        strokeWidth={1.5}
      />
    </div>
  );
}

function NoteCard({ note }) {
  return (
    <article className="flex min-h-[196px]  flex-col rounded border border-gray-200 bg-white px-4 pt-3">
      <div className="flex flex-wrap gap-2">
        {note.tags.map((tag) => (
          <span
            key={tag.label}
            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${getTagStyle(tag.color)}`}
          >
            {tag.label}
          </span>
        ))}
      </div>

      <h2 className="mt-2 text-[15px] font-bold text-gray-900">
        {note.title}
      </h2>
      <p className="mt-2 line-clamp-2 text-[13px] leading-4 text-gray-500">
        {note.description}
      </p>

      {note.items && (
        <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[13px] leading-4 text-gray-500">
          {note.items.map((item) => (
            <li key={item} className="truncate">
              {item}
            </li>
          ))}
        </ul>
      )}

      {note.thumbnail && <NoteThumbnail type={note.thumbnail} />}

      <footer className="mt-auto flex min-h-9 items-center justify-between gap-2 border-t border-gray-100 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold ${note.avatar}`}
          >
            {note.initials}
          </span>
          <span className="truncate text-[13px] font-medium text-gray-800">
            {note.author}
          </span>
        </div>
        <time className="shrink-0 text-[12px] text-gray-500">{note.date}</time>
      </footer>
    </article>
  );
}

function NotesPage() {
  const [noteList, setNoteList] = useState(() => {
    const currentYear = new Date().getFullYear();
    return notes.map((note, index) => ({
      ...note,
      createdAt: Date.parse(`${note.date} ${currentYear}`) || index,
    }));
  });
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [openMenu, setOpenMenu] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const availableTags = [
    ...new Set(noteList.flatMap((note) => note.tags.map((tag) => tag.label))),
  ].sort((a, b) => a.localeCompare(b));

  const visibleNotes = noteList
    .filter(
      (note) =>
        filterBy === "all" ||
        note.tags.some((tag) => tag.label === filterBy),
    )
    .sort((a, b) => {
      if (sortBy === "oldest") return a.createdAt - b.createdAt;
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      return b.createdAt - a.createdAt;
    });

  function addNote(note) {
    setNoteList((currentNotes) => [note, ...currentNotes]);
    setSortBy("newest");
    setFilterBy("all");
    setIsAddModalOpen(false);
    setOpenMenu(null);
  }

  return (
    <section className="min-h-full">
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-2">
        <h1 className="text-lg font-semibold text-gray-900">Notes</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              aria-expanded={openMenu === "sort"}
              aria-haspopup="menu"
              className="inline-flex h-8 items-center gap-2 rounded border border-gray-300 px-3 text-xs font-medium text-gray-800 hover:bg-gray-50"
              onClick={() =>
                setOpenMenu((current) => (current === "sort" ? null : "sort"))
              }
            >
              <ListSortDescending size={14} />
              Sort By
            </button>
            {openMenu === "sort" && (
              <div
                role="menu"
                aria-label="Sort notes"
                className="absolute right-0 z-20 mt-2 w-44 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="menuitemradio"
                    aria-checked={sortBy === option.value}
                    className={`block w-full rounded px-3 py-2 text-left text-xs hover:bg-gray-100 ${
                      sortBy === option.value
                        ? "font-semibold text-gray-900"
                        : "text-gray-600"
                    }`}
                    onClick={() => {
                      setSortBy(option.value);
                      setOpenMenu(null);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              aria-expanded={openMenu === "filter"}
              aria-haspopup="menu"
              className="inline-flex h-8 items-center gap-2 rounded border border-gray-300 px-3 text-xs font-medium text-gray-800 hover:bg-gray-50"
              onClick={() =>
                setOpenMenu((current) =>
                  current === "filter" ? null : "filter",
                )
              }
            >
              <ListFilter size={14} />
              Filter
              {filterBy !== "all" && (
                <span className="rounded-full bg-gray-200 px-1.5 text-[10px]">
                  1
                </span>
              )}
            </button>
            {openMenu === "filter" && (
              <div
                role="menu"
                aria-label="Filter notes by tag"
                className="absolute right-0 z-20 mt-2 max-h-64 w-44 overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg"
              >
                {["all", ...availableTags].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    role="menuitemradio"
                    aria-checked={filterBy === tag}
                    className={`block w-full rounded px-3 py-2 text-left text-xs hover:bg-gray-100 ${
                      filterBy === tag
                        ? "font-semibold text-gray-900"
                        : "text-gray-600"
                    }`}
                    onClick={() => {
                      setFilterBy(tag);
                      setOpenMenu(null);
                    }}
                  >
                    {tag === "all" ? "All tags" : tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-8 items-center gap-2 rounded bg-black px-3 text-xs font-medium text-white hover:bg-gray-800"
            onClick={() => {
              setOpenMenu(null);
              setIsAddModalOpen(true);
            }}
          >
            <Plus size={14} />
            Add Notes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleNotes.map((note, index) => (
          <NoteCard key={`${note.title}-${note.author}-${index}`} note={note} />
        ))}
        {visibleNotes.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-gray-500">
            No notes match this tag.
          </p>
        )}
      </div>

      {isAddModalOpen && (
        <AddNoteModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={addNote}
        />
      )}
    </section>
  );
}

export default NotesPage;
