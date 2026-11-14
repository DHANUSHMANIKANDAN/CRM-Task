import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUp, CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";
import { useCRMData } from "./CRMDataContext.jsx";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const activityFactors = [0.58, 1, 0.88, 1.12, 0.77, 0.64, 0.5, 0.91, 1.04, 1.25, 0.62, 0.95];
const companyColors = ["#111827", "#4b5563", "#9ca3af", "#d1d5db", "#737373", "#a3a3a3"];

function getCompanyYear(company, fallbackYear) {
  const date = company.createdAt ? new Date(company.createdAt) : null;
  return date && !Number.isNaN(date.getTime()) ? date.getFullYear() : fallbackYear;
}

function formatMonthRange(year) {
  return `January, ${year} - December, ${year}`;
}

function MetricCard({ title, value, suffix, action, icon: Icon }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium text-gray-900">{title}</h2>
          <p className="mt-2 text-2xl font-semibold leading-none text-gray-950">
            {Number(value).toLocaleString()} <span className="text-base font-medium">{suffix}</span>
          </p>
        </div>
        {Icon && <span className="flex size-8 items-center justify-center rounded-md bg-gray-50 text-gray-500"><Icon size={15} /></span>}
      </div>
      {action && <div className="mt-3">{action}</div>}
    </section>
  );
}

function MonthlyTrend({ year, points, metricName, selectedMonth, onSelectMonth }) {
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const maxValue = Math.max(1, ...points.map((point) => point.value));
  const scaleMax = Math.max(4, Math.ceil(maxValue / 4) * 4);
  const chart = { width: 1000, height: 245, left: 52, right: 24, top: 20, bottom: 34 };
  const plotWidth = chart.width - chart.left - chart.right;
  const plotHeight = chart.height - chart.top - chart.bottom;
  const coordinates = points.map((point, index) => ({
    ...point,
    x: chart.left + (points.length <= 1 ? 0 : (index / (points.length - 1)) * plotWidth),
    y: chart.top + ((scaleMax - point.value) / scaleMax) * plotHeight,
  }));
  const linePoints = coordinates.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPoints = `${chart.left},${chart.height - chart.bottom} ${linePoints} ${chart.width - chart.right},${chart.height - chart.bottom}`;
  const activePoint = coordinates.find((point) => point.month === (hoveredMonth ?? selectedMonth));

  return (
    <div className="relative min-w-[560px]">
      {activePoint && (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-[11px] shadow-lg"
          style={{
            left: `${(activePoint.x / chart.width) * 100}%`,
            top: `${Math.max(0, (activePoint.y / chart.height) * 100 - 18)}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="text-gray-500">{months[activePoint.month]} {year}</p>
          <p className="mt-1 font-medium text-gray-800">{metricName} <strong className="ml-1">{activePoint.value.toLocaleString()}</strong></p>
        </div>
      )}
      <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="block h-[230px] w-full overflow-visible" role="img" aria-label={`${metricName} monthly trend for ${year}`}>
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
          const y = chart.top + fraction * plotHeight;
          const label = Math.round(scaleMax * (1 - fraction));
          return (
            <g key={fraction}>
              <line x1={chart.left} y1={y} x2={chart.width - chart.right} y2={y} stroke="#d1d5db" strokeDasharray="3 5" />
              <text x={chart.left - 14} y={y + 4} textAnchor="end" fill="#6b7280" fontSize="18">{label}</text>
            </g>
          );
        })}
        <polygon points={areaPoints} fill="#f3f4f6" />
        <polyline points={linePoints} fill="none" stroke="#111827" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {coordinates.map((point) => (
          <circle
            key={point.month}
            cx={point.x}
            cy={point.y}
            r={point.month === (hoveredMonth ?? selectedMonth) ? 6 : 3.5}
            fill={point.month === (hoveredMonth ?? selectedMonth) ? "#111827" : "#ffffff"}
            stroke="#111827"
            strokeWidth="2"
            tabIndex="0"
            role="button"
            aria-label={`${months[point.month]} ${year}: ${metricName} ${point.value}`}
            onMouseEnter={() => setHoveredMonth(point.month)}
            onMouseLeave={() => setHoveredMonth(null)}
            onFocus={() => setHoveredMonth(point.month)}
            onBlur={() => setHoveredMonth(null)}
            onClick={() => onSelectMonth(point.month)}
          >
            <title>{`${months[point.month]} ${year}: ${metricName} ${point.value}`}</title>
          </circle>
        ))}
      </svg>
      <div className="grid grid-cols-12 pl-[5.2%] pr-[2.4%]">
        {months.map((month, index) => (
          <button
            key={month}
            type="button"
            aria-pressed={selectedMonth === index}
            onMouseEnter={() => setHoveredMonth(index)}
            onMouseLeave={() => setHoveredMonth(null)}
            onFocus={() => setHoveredMonth(index)}w
            onBlur={() => setHoveredMonth(null)}
            onClick={() => onSelectMonth(index)}
            className={`text-center text-[10px] ${selectedMonth === index ? "font-semibold text-gray-900" : "text-gray-600"}`}
          >
            {month.slice(0, 3)}
          </button>
        ))}
      </div>
    </div>
  );
}

function TrendChart({ tasks, emailStats, selectedYear, yearOptions, onYearChange }) {
  const [activeTab, setActiveTab] = useState("activity");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const activeProjects = tasks.filter((task) => task.status !== "completed").length;
  const latestEmailYear = Math.max(selectedYear, ...emailStats.map((item) => item.year));
  const monthlySales = months.map((_, month) => {
    const selectedYearStats = emailStats.find((item) => item.year === selectedYear && item.month === month);
    if (selectedYearStats) return selectedYearStats.sent;
    const latestYearStats = emailStats.find((item) => item.year === latestEmailYear && item.month === month);
    const yearScale = Math.max(0.7, 1 - (latestEmailYear - selectedYear) * 0.08);
    return Math.round((latestYearStats?.sent ?? 0) * yearScale);
  });
  const monthlyActivity = activityFactors.map((factor) => {
    const yearScale = Math.max(0.7, 1 - (latestEmailYear - selectedYear) * 0.06);
    return Math.round(activeProjects * factor * yearScale);
  });
  const values = activeTab === "activity" ? monthlyActivity : monthlySales;
  const metricName = activeTab === "activity" ? "Active Projects" : "Emails Sent";
  const currentValue = selectedMonth === null
    ? activeTab === "activity"
      ? activeProjects
      : monthlySales.reduce((sum, value) => sum + value, 0)
    : values[selectedMonth] ?? 0;
  const trendValue = activeTab === "activity"
    ? (monthlyActivity[11] / Math.max(1, monthlyActivity[0]) - 1) * 100
    : (monthlySales[11] / Math.max(1, monthlySales[0]) - 1) * 100;
  const points = values.map((value, month) => ({ month, value }));

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center gap-5 border-b border-gray-100 px-4">
        <button
          type="button"
          aria-pressed={activeTab === "sales"}
          onClick={() => { setActiveTab("sales"); setSelectedMonth(null); }}
          className={`border-b-2 py-3 text-xs ${activeTab === "sales" ? "border-gray-900 font-semibold text-gray-900" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          Sales
        </button>
        <button
          type="button"
          aria-pressed={activeTab === "activity"}
          onClick={() => { setActiveTab("activity"); setSelectedMonth(null); }}
          className={`border-b-2 py-3 text-xs ${activeTab === "activity" ? "border-gray-900 font-semibold text-gray-900" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          Activity
        </button>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-3 px-4 pb-2 pt-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{metricName}</h2>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-2xl font-semibold text-gray-950">{currentValue.toLocaleString()} {activeTab === "activity" ? "Projects" : "Emails"}</p>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${trendValue >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {trendValue >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{Math.abs(Math.round(trendValue))}%
            </span>
          </div>
          <p className="mt-1 text-[10px] text-gray-500">{selectedMonth === null ? "This Month" : months[selectedMonth]}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="analytics-range">Select analytics date range</label>
          <select
            id="analytics-range"
            aria-label="Select analytics date range"
            value={selectedYear}
            onChange={(event) => { setSelectedMonth(null); onYearChange(event.target.value); }}
            className="h-8 max-w-full rounded border border-gray-300 bg-white px-2 text-[10px] text-gray-700"
          >
            {yearOptions.map((year) => <option key={year} value={year}>{formatMonthRange(year)}</option>)}
          </select>
          <label className="sr-only" htmlFor="analytics-month">Select month</label>
          <select
            id="analytics-month"
            aria-label="Select month"
            value={selectedMonth ?? "all"}
            onChange={(event) => setSelectedMonth(event.target.value === "all" ? null : Number(event.target.value))}
            className="h-8 rounded border border-gray-300 bg-white px-2 text-[10px] text-gray-700"
          >
            <option value="all">Month</option>
            {months.map((month, index) => <option key={month} value={index}>{month}</option>)}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto px-3 pb-4">
        <MonthlyTrend
          year={selectedYear}
          points={points}
          metricName={metricName}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
        />
      </div>
    </section>
  );
}

function TopCompanies({ companies, onOpenCompany }) {
  const rankedCompanies = companies
    .slice()
    .sort((a, b) => Number(b.status === "Active") - Number(a.status === "Active") || a.name.localeCompare(b.name))
    .slice(0, 6);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-3">
      <h2 className="text-sm font-semibold text-gray-900">Top Companies</h2>
      <ol className="mt-3 space-y-1">
        {rankedCompanies.map((company, index) => (
          <li key={company.id}>
            <button type="button" onClick={() => onOpenCompany(company)} className="flex w-full items-center gap-2 rounded py-1 text-left hover:bg-gray-50">
              <span className="w-3 text-[10px] font-medium text-gray-500">{index + 1}.</span>
              <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${index % 2 ? "bg-gray-700" : "bg-orange-500"}`}>{company.name.slice(0, 1).toUpperCase()}</span>
              <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-gray-800">{company.name}</span>
              <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] ${company.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                {company.status === "Active" ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                {company.status === "Active" ? index + 1 : Math.max(1, index)}
              </span>
            </button>
          </li>
        ))}
        {rankedCompanies.length === 0 && <li className="py-5 text-center text-xs text-gray-500">No companies available.</li>}
      </ol>
    </section>
  );
}

function ActiveCompanies({ companies, selectedYear, yearOptions, onYearChange }) {
  const visibleCompanies = companies.filter((company) => (
    selectedYear === "all" || getCompanyYear(company, Number(yearOptions[0])) === Number(selectedYear)
  ));
  const activeCompanies = visibleCompanies.filter((company) => company.status === "Active");
  const categories = new Map();
  for (const company of activeCompanies) {
    const industry = company.industry || "Uncategorized";
    categories.set(industry, (categories.get(industry) ?? 0) + 1);
  }
  const items = [...categories.entries()].sort(([a], [b]) => a.localeCompare(b));
  const maxCount = Math.max(1, ...items.map(([, count]) => count));

  return (
    <section className="min-w-0 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Active Companies</h2>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-xl font-semibold text-gray-950">{activeCompanies.length} Companies</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-medium text-green-700"><TrendingUp size={11} />{visibleCompanies.length ? Math.round((activeCompanies.length / visibleCompanies.length) * 100) : 0}% active</span>
          </div>
          <p className="mt-1 text-[10px] text-gray-500">{selectedYear === "all" ? "All years" : `Companies added in ${selectedYear}`}</p>
        </div>
        <label className="sr-only" htmlFor="active-company-year">Filter companies by year</label>
        <select id="active-company-year" aria-label="Filter companies by year" value={selectedYear} onChange={(event) => onYearChange(event.target.value)} className="h-8 rounded border border-gray-300 bg-white px-2 text-[10px] text-gray-700">
          <option value="all">Year</option>
          {yearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
        </select>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(([industry, count], index) => (
          <div key={industry}>
            <div className="flex items-center justify-between gap-2 text-[10px] text-gray-700">
              <span className="truncate">{industry}</span>
              <span className="shrink-0">{count}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-gray-200">
              <div className="h-full rounded-full" style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: companyColors[index % companyColors.length] }} />
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-gray-500">No active companies for this year.</p>}
      </div>
    </section>
  );
}

function CompletedTarget({ tasks }) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setNow(Date.now()), 0);
    const intervalId = window.setInterval(() => setNow(Date.now()), 60000);
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const completedThisWeek = tasks.filter((task) => {
    if (task.status !== "completed") return false;
    const completedAt = task.completedAt ?? (task.dueDate ? `${task.dueDate}T12:00:00` : null);
    if (!completedAt) return false;
    const date = new Date(completedAt);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return date >= weekStart && date < weekEnd;
  });
  const dailyCounts = weekdays.map((_, day) => completedThisWeek.filter((task) => {
    const completedAt = task.completedAt ?? `${task.dueDate}T12:00:00`;
    return new Date(completedAt).getDay() === day;
  }).length);
  const targetPerDay = 3;

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} className="text-gray-500" />
        <h2 className="text-sm font-semibold text-gray-900">Completed Project Target This Week</h2>
      </div>
      <p className="mt-1 text-[10px] text-gray-500">{completedThisWeek.length} completed this week · target {targetPerDay} per day</p>
      <div className="mt-4 grid grid-cols-7 items-end gap-3">
        {weekdays.map((day, index) => {
          const count = dailyCounts[index];
          const percentage = Math.min(100, (count / targetPerDay) * 100);
          return (
            <div key={day} className="flex flex-col items-center gap-2">
              <div className="flex h-28 w-full max-w-7 items-end overflow-hidden rounded-t bg-gray-200" title={`${day}: ${count} tasks completed`}>
                <div className="w-full bg-black transition-all" style={{ height: `${percentage}%` }} />
              </div>
              <span className="text-[10px] text-gray-600">{day}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AnalyticsPage() {
  const { companies, tasks, emailStats } = useCRMData();
  const navigate = useNavigate();
  const availableYears = [...new Set([
    ...emailStats.map((item) => item.year),
    ...tasks.map((task) => task.dueDate ? Number(task.dueDate.slice(0, 4)) : null),
    ...companies.map((company) => company.createdAt ? getCompanyYear(company, null) : null),
  ].filter(Number.isFinite))].sort((a, b) => b - a);
  const latestYear = availableYears[0] ?? 2026;
  const firstYear = Math.min(2023, ...availableYears);
  const chartYearOptions = Array.from({ length: latestYear - firstYear + 1 }, (_, index) => firstYear + index);
  const companyYearOptions = [...new Set(companies.map((company) => getCompanyYear(company, latestYear)))]
    .sort((a, b) => b - a);
  const [chartYear, setChartYear] = useState(String(latestYear));
  const [companyYear, setCompanyYear] = useState("all");
  const completedTasks = tasks.filter((task) => task.status === "completed").length;

  function openCompany(company) {
    navigate("/companies", { state: { openCompanyId: company.id } });
  }

  return (
    <section className="min-h-full bg-gray-50/50">
      <header className="border-b border-gray-200 bg-white px-5 pt-4 sm:px-7">
        <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
      </header>
      <div className="space-y-4 p-4 sm:p-6">
        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[190px_minmax(0,1fr)]">
          <div className="space-y-4">
            <MetricCard
              title="Completed Task"
              value={completedTasks}
              suffix="Task"
              action={(
                <button type="button" onClick={() => navigate("/tasks")} className="rounded border border-gray-300 px-2.5 py-1 text-[10px] font-medium text-gray-700 hover:bg-gray-50">
                  View All
                </button>
              )}
              icon={CheckCircle2}
            />
            <TopCompanies companies={companies} onOpenCompany={openCompany} />
          </div>
          <TrendChart
            tasks={tasks}
            emailStats={emailStats}
            selectedYear={Number(chartYear)}
            yearOptions={chartYearOptions}
            onYearChange={setChartYear}
          />
        </div>
        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
          <ActiveCompanies
            companies={companies}
            selectedYear={companyYear}
            yearOptions={companyYearOptions}
            onYearChange={setCompanyYear}
          />
          <CompletedTarget tasks={tasks} />
        </div>
      </div>
    </section>
  );
}

export default AnalyticsPage;
