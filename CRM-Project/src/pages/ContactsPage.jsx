import { useState } from "react";
import {
  Columns3,
  LayoutGrid,
  List,
  ListFilter,
  ListSortDescending,
  Mail,
  MapPin,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Table2,
  Trash2,
  X,
} from "lucide-react";
import { useCRMData } from "./CRMDataContext.jsx";

const categories = ["Employees", "Partners"];
const avatarStyles = [
  "bg-sky-100 text-sky-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-800",
];

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function AddContactModal({ initialCategory = "Employees", initialContact, onClose, onSave }) {
  const [name, setName] = useState(initialContact?.name ?? "");
  const [email, setEmail] = useState(initialContact?.email ?? "");
  const [phone, setPhone] = useState(initialContact?.phone ?? "");
  const [location, setLocation] = useState(initialContact?.location ?? "");
  const [category, setCategory] = useState(initialContact?.category ?? initialCategory);
  const [gender, setGender] = useState(initialContact?.gender ?? "Not specified");

  function handleSubmit(event) {
    event.preventDefault();
    const contact = {
      id: initialContact?.id ?? `contact-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim() || "Austin",
      category,
      gender,
      avatar: getInitials(name),
      avatarStyle: avatarStyles[Date.now() % avatarStyles.length],
      createdAt: initialContact?.createdAt ?? Date.now(),
    };
    onSave(contact);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="add-contact-title"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
        role="dialog"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="add-contact-title" className="text-lg font-semibold text-gray-900">{initialContact ? "Edit Contact" : "Add Contact"}</h2>
            <p className="mt-1 text-sm text-gray-500">Add a team member or partner to your contacts.</p>
          </div>
          <button type="button" aria-label="Close add contact form" className="rounded p-1 text-gray-500 hover:bg-gray-100" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">
            Name
            <input autoFocus required value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" placeholder="e.g. Alex Morgan" />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" placeholder="name@example.com" />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Phone
            <input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" placeholder="+1 (555) 555-0100" />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Location <span className="font-normal text-gray-400">(optional)</span>
            <input value={location} onChange={(event) => setLocation(event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" placeholder="Austin" />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Contact group
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500">
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Gender
            <select value={gender} onChange={(event) => setGender(event.target.value)} className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500">
              {["Not specified", "Female", "Male", "Non-binary"].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={onClose}>Cancel</button>
            <button type="submit" className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">{initialContact ? "Save Contact" : "Add Contact"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ContactCard({ contact, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className="relative rounded-md border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${contact.avatarStyle}`}>
            {contact.avatar}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-gray-900">{contact.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={12} />
              {contact.location}
            </p>
          </div>
        </div>
        <div className="relative">
          <button type="button" aria-label={`More options for ${contact.name}`} aria-expanded={menuOpen} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" onClick={() => setMenuOpen((open) => !open)}>
            <MoreHorizontal size={17} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-10 w-32 rounded border border-gray-200 bg-white p-1 shadow-lg">
              <button type="button" className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-xs text-gray-700 hover:bg-gray-50" onClick={() => { onEdit(contact); setMenuOpen(false); }}>
                <Pencil size={13} />Edit
              </button>
              <button type="button" className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-xs text-red-600 hover:bg-red-50" onClick={() => { onDelete(contact); setMenuOpen(false); }}>
                <Trash2 size={13} />Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <a href={`mailto:${contact.email}`} className="mt-4 flex min-w-0 items-center gap-2 text-xs text-gray-600 hover:text-gray-900">
        <Mail size={14} className="shrink-0 text-gray-500" />
        <span className="truncate">{contact.email}</span>
      </a>
      <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="mt-2 flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900">
        <Phone size={14} className="shrink-0 text-gray-500" />
        <span>{contact.phone}</span>
      </a>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center justify-center gap-2 rounded border border-gray-300 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
          <Phone size={13} />Call
        </a>
        <a href={`mailto:${contact.email}`} className="inline-flex items-center justify-center gap-2 rounded border border-gray-300 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
          <Mail size={13} />Mail
        </a>
      </div>
    </article>
  );
}

function ContactsPage() {
  const {
    contacts,
    addContact: addContactToCRM,
    updateContact,
    deleteContact,
  } = useCRMData();
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("name-asc");
  const [filterBy, setFilterBy] = useState("all");
  const [modalCategory, setModalCategory] = useState(null);
  const [modalContact, setModalContact] = useState(null);

  function saveContact(contact) {
    if (modalContact) updateContact(modalContact.id, (current) => ({ ...current, ...contact }));
    else addContactToCRM(contact);
    setFilterBy("all");
    if (!modalContact) setSortBy("newest");
    setModalCategory(null);
    setModalContact(null);
  }

  function editContact(contact) {
    setModalContact(contact);
    setModalCategory(contact.category);
  }

  function removeContact(contact) {
    if (window.confirm(`Delete ${contact.name}?`)) deleteContact(contact.id);
  }

  function getVisibleContacts(category) {
    return contacts
      .filter((contact) => contact.category === category)
      .filter((contact) => filterBy === "all" || contact.category === filterBy)
      .sort((a, b) => {
        if (sortBy === "name-desc") return b.name.localeCompare(a.name);
        if (sortBy === "newest") return b.createdAt - a.createdAt;
        return a.name.localeCompare(b.name);
      });
  }

  const visibleContacts = contacts
    .filter((contact) => filterBy === "all" || contact.category === filterBy)
    .sort((a, b) => {
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "newest") return b.createdAt - a.createdAt;
      return a.name.localeCompare(b.name);
    });

  return (
    <section className="min-h-full">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-2">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold text-gray-900">Contacts</h1>
          <div className="flex items-center gap-3 self-stretch text-xs text-gray-500">
            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className={`inline-flex items-center gap-1.5 border-b-2 py-2 ${view === "list" ? "border-gray-800 font-medium text-gray-900" : "border-transparent hover:text-gray-900"}`}><List size={14} />List</button>
            <button type="button" aria-pressed={view === "kanban"} onClick={() => setView("kanban")} className={`inline-flex items-center gap-1.5 border-b-2 py-2 ${view === "kanban" ? "border-gray-800 font-medium text-gray-900" : "border-transparent hover:text-gray-900"}`}><Columns3 size={14} />Kanban</button>
            <button type="button" aria-pressed={view === "table"} onClick={() => setView("table")} className={`inline-flex items-center gap-1.5 border-b-2 py-2 ${view === "table" ? "border-gray-800 font-medium text-gray-900" : "border-transparent hover:text-gray-900"}`}><Table2 size={13} />Table</button>
            <button type="button" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={`inline-flex items-center gap-1.5 border-b-2 py-2 ${view === "grid" ? "border-gray-800 font-medium text-gray-900" : "border-transparent hover:text-gray-900"}`}><LayoutGrid size={14} />Grid</button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative">
            <ListSortDescending size={13} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-600" />
            <select aria-label="Sort contacts" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-8 appearance-none rounded border border-gray-300 bg-white py-1 pl-7 pr-2 text-[11px] text-gray-800 outline-none hover:bg-gray-50">
              <option value="name-asc">Sort By</option>
              <option value="name-desc">Name Z-A</option>
              <option value="newest">Recently added</option>
            </select>
          </label>
          <label className="relative">
            <ListFilter size={13} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-600" />
            <select aria-label="Filter contacts" value={filterBy} onChange={(event) => setFilterBy(event.target.value)} className="h-8 appearance-none rounded border border-gray-300 bg-white py-1 pl-7 pr-2 text-[11px] text-gray-800 outline-none hover:bg-gray-50">
              <option value="all">Filter</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded bg-black px-3 text-[11px] font-medium text-white hover:bg-gray-800" onClick={() => { setModalContact(null); setModalCategory("Employees"); }}>
            <Plus size={13} />Add Contact
          </button>
        </div>
      </div>

      {view === "table" ? (
        <div className="overflow-x-auto p-5">
          <table className="w-full min-w-[680px] border-collapse rounded border border-gray-200 bg-white text-left">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Group</th><th className="px-4 py-3">Action</th></tr>
            </thead>
            <tbody>
              {visibleContacts.map((contact) => (
                <tr key={contact.id} className="border-t border-gray-100 text-sm text-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-900">{contact.name}</td>
                  <td className="px-4 py-3"><a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a></td>
                  <td className="px-4 py-3">{contact.phone}</td>
                  <td className="px-4 py-3">{contact.category}</td>
                  <td className="px-4 py-3">
                    <button type="button" aria-label={`Edit ${contact.name}`} onClick={() => editContact(contact)} className="mr-2 text-gray-500 hover:text-gray-900"><Pencil size={14} /></button>
                    <button type="button" aria-label={`Delete ${contact.name}`} onClick={() => removeContact(contact)} className="text-gray-500 hover:text-red-600"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-5 p-5 sm:grid-cols-2">
          {categories
            .filter((category) => filterBy === "all" || filterBy === category)
            .map((category) => {
              const groupContacts = getVisibleContacts(category);
              return (
                <section key={category} className="rounded-md border border-gray-200 bg-white p-3">
                  <header className="mb-3 flex items-center justify-between gap-3 px-1">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${category === "Employees" ? "bg-purple-400" : "bg-orange-400"}`} />
                      <h2 className="text-sm font-semibold text-gray-900">{category}</h2>
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">{groupContacts.length}</span>
                    </div>
                    <button type="button" aria-label={`Add contact to ${category}`} className="rounded p-1 text-gray-500 hover:bg-gray-100" onClick={() => { setModalContact(null); setModalCategory(category); }}>
                      <Plus size={16} />
                    </button>
                  </header>
                  <div className={view === "list" ? "space-y-2" : "grid grid-cols-1 gap-2 2xl:grid-cols-2"}>
                    {groupContacts.map((contact) => <ContactCard key={contact.id} contact={contact} onEdit={editContact} onDelete={removeContact} />)}
                    {groupContacts.length === 0 && <p className="col-span-full rounded border border-dashed border-gray-200 px-3 py-8 text-center text-xs text-gray-400">No contacts in this group yet.</p>}
                  </div>
                </section>
              );
            })}
        </div>
      )}

      {visibleContacts.length === 0 && <p className="px-5 pb-8 text-center text-sm text-gray-500">No contacts match this filter.</p>}

      {modalCategory && (
        <AddContactModal
          initialCategory={modalCategory}
          initialContact={modalContact}
          onClose={() => { setModalCategory(null); setModalContact(null); }}
          onSave={saveContact}
        />
      )}
    </section>
  );
}

export default ContactsPage;
