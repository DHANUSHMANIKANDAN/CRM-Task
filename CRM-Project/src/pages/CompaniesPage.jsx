import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Building2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useCRMData } from "./CRMDataContext.jsx";

const fieldClass = "mt-1 h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-500";

function CompanyForm({ company, onCancel, onSave }) {
  const [name, setName] = useState(company?.name ?? "");
  const [industry, setIndustry] = useState(company?.industry ?? "");
  const [location, setLocation] = useState(company?.location ?? "");
  const [status, setStatus] = useState(company?.status ?? "Lead");

  function submit(event) {
    event.preventDefault();
    onSave({
      name: name.trim(),
      industry: industry.trim(),
      location: location.trim(),
      status,
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
      <label className="font-medium text-gray-700">
        Company name
        <input required autoFocus value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} />
      </label>
      <label className="text-xs font-medium text-gray-700">
        Industry
        <input required value={industry} onChange={(event) => setIndustry(event.target.value)} className={fieldClass} placeholder="e.g. Marketing" />
      </label>
      <label className="text-xs font-medium text-gray-700">
        Location
        <input required value={location} onChange={(event) => setLocation(event.target.value)} className={fieldClass} placeholder="City, State" />
      </label>
      <label className="text-xs font-medium text-gray-700">
        Status
        <select value={status} onChange={(event) => setStatus(event.target.value)} className={fieldClass}>
          <option value="Active">Active</option>
          <option value="Lead">Lead</option>
        </select>
      </label>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" onClick={onCancel} className="rounded border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-white">Cancel</button>
        <button type="submit" className="rounded bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-700">{company ? "Save changes" : "Add company"}</button>
      </div>
    </form>
  );
}

function CompaniesPage() {
  const { companies, addCompany, updateCompany, deleteCompany } = useCRMData();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedId, setSelectedId] = useState(location.state?.openCompanyId ?? null);
  const industries = [...new Set(companies.map((company) => company.industry).filter(Boolean))].sort();
  const locations = [...new Set(companies.map((company) => company.location).filter(Boolean))].sort();
  const visibleCompanies = useMemo(() => companies
    .filter((company) => industryFilter === "all" || company.industry === industryFilter)
    .filter((company) => locationFilter === "all" || company.location === locationFilter)
    .filter((company) => statusFilter === "all" || company.status === statusFilter)
    .filter((company) => [company.name, company.industry, company.location, company.status]
      .some((value) => String(value ?? "").toLowerCase().includes(search.trim().toLowerCase())))
    .sort((a, b) => String(a[sortField] ?? "").localeCompare(String(b[sortField] ?? "")) * sortDirection),
  [companies, industryFilter, locationFilter, search, sortDirection, sortField, statusFilter]);
  const selectedCompany = companies.find((company) => company.id === selectedId);

  function resetFilters() {
    setSearch("");
    setIndustryFilter("all");
    setLocationFilter("all");
    setStatusFilter("all");
    setSortField("name");
    setSortDirection(1);
  }

  function saveCompany(company) {
    if (editing) {
      updateCompany(editing.id, (current) => ({ ...current, ...company }));
      setEditing(null);
    } else {
      addCompany(company);
      setShowForm(false);
    }
  }

  function removeCompany(company) {
    if (!window.confirm(`Delete ${company.name}?`)) return;
    deleteCompany(company.id);
    setSelectedId(null);
    setEditing(null);
  }

  function changeSort(field) {
    if (sortField === field) setSortDirection((direction) => direction * -1);
    else {
      setSortField(field);
      setSortDirection(1);
    }
  }

  return (
    <section className="min-h-full bg-gray-50/50">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Companies</h1>
          <p className="mt-1 text-sm text-gray-500">{companies.length} records · company categories update the dashboard automatically</p>
        </div>
        <button type="button" onClick={() => { setEditing(null); setShowForm((open) => !open); }} className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700">
          {showForm ? <X size={14} /> : <Plus size={14} />}{showForm ? "Close" : "Add company"}
        </button>
      </header>
      <div className="space-y-4 p-4 sm:p-6">
        {showForm && <CompanyForm onCancel={() => setShowForm(false)} onSave={saveCompany} />}
        {editing && <CompanyForm company={editing} onCancel={() => setEditing(null)} onSave={saveCompany} />}
        {selectedCompany && !editing && (
          <section className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700"><Building2 size={18} /></span>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedCompany.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">{selectedCompany.industry} · {selectedCompany.location}</p>
                  <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${selectedCompany.status === "Active" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>{selectedCompany.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setEditing(selectedCompany)} className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"><Pencil size={13} />Edit</button>
                <button type="button" onClick={() => removeCompany(selectedCompany)} className="inline-flex items-center gap-1.5 rounded border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50"><Trash2 size={13} />Delete</button>
                <button type="button" aria-label="Close company details" onClick={() => setSelectedId(null)} className="rounded p-2 text-gray-500 hover:bg-gray-100"><X size={15} /></button>
              </div>
            </div>
          </section>
        )}
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4">
            <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input aria-label="Search companies" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, industry, or location" className="h-9 w-full rounded-md border border-gray-200 pl-9 pr-3 text-xs outline-none focus:border-gray-400" />
            </div>
            <div className="flex flex-wrap gap-2">
              <select aria-label="Filter companies by industry" value={industryFilter} onChange={(event) => setIndustryFilter(event.target.value)} className="h-9 rounded-md border border-gray-200 bg-white px-2 text-xs">
                <option value="all">All industries</option>
                {industries.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
              </select>
              <select aria-label="Filter companies by location" value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)} className="h-9 rounded-md border border-gray-200 bg-white px-2 text-xs">
                <option value="all">All locations</option>
                {locations.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <select aria-label="Filter companies by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 rounded-md border border-gray-200 bg-white px-2 text-xs">
                <option value="all">All statuses</option>
                <option value="Active">Active</option>
                <option value="Lead">Lead</option>
              </select>
              <button type="button" onClick={resetFilters} className="inline-flex h-9 items-center gap-1 rounded-md border border-gray-200 px-2.5 text-xs text-gray-600 hover:bg-gray-50"><X size={13} />Reset</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  {[
                    ["name", "Company Name"], ["industry", "Industry"], ["location", "Location"], ["status", "Status"],
                  ].map(([field, label]) => (
                    <th key={field} className="px-4 py-3">
                      <button type="button" onClick={() => changeSort(field)} className="hover:text-gray-900">{label} {sortField === field ? (sortDirection > 0 ? "↑" : "↓") : "↕"}</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleCompanies.map((company) => (
                  <tr key={company.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3"><button type="button" onClick={() => setSelectedId(company.id)} className="font-medium text-gray-900 hover:underline">{company.name}</button></td>
                    <td className="px-4 py-3 text-gray-600">{company.industry}</td>
                    <td className="px-4 py-3 text-gray-600">{company.location}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${company.status === "Active" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>{company.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleCompanies.length === 0 && <p className="p-8 text-center text-sm text-gray-500">No companies match your search or filters.</p>}
          </div>
          <footer className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500">Showing {visibleCompanies.length} of {companies.length} companies</footer>
        </section>
      </div>
    </section>
  );
}

export default CompaniesPage;
