import { useMemo } from "react";
import { Mail, Send } from "lucide-react";
import { useCRMData } from "./CRMDataContext.jsx";

function EmailsPage() {
  const { emailStats, updateEmailMonth } = useCRMData();
  const totals = useMemo(() => emailStats.reduce((result, item) => ({
    sent: result.sent + item.sent,
    delivered: result.delivered + item.delivered,
    opened: result.opened + item.opened,
  }), { sent: 0, delivered: 0, opened: 0 }), [emailStats]);
  const openRate = totals.delivered ? (totals.opened / totals.delivered) * 100 : 0;

  function updateValue(item, field, value) {
    updateEmailMonth(item.month, (current) => ({ ...current, [field]: value }));
  }

  return (
    <section className="min-h-full bg-gray-50/50">
      <header className="border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
        <h1 className="text-xl font-semibold text-gray-900">Emails</h1>
        <p className="mt-1 text-sm text-gray-500">Local email delivery and engagement statistics.</p>
      </header>
      <div className="space-y-5 p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Emails sent", totals.sent.toLocaleString()],
            ["Delivered", totals.delivered.toLocaleString()],
            ["Average open rate", `${openRate.toFixed(2)}%`],
          ].map(([label, value]) => (
            <section key={label} className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-500">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
            </section>
          ))}
        </div>
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <header className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
            <Mail size={16} className="text-gray-500" />
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Monthly email statistics</h2>
              <p className="mt-0.5 text-xs text-gray-500">Edit a value and leave the field to update the Dashboard.</p>
            </div>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">Sent</th>
                  <th className="px-4 py-3">Delivered</th>
                  <th className="px-4 py-3">Opened</th>
                  <th className="px-4 py-3">Open rate</th>
                </tr>
              </thead>
              <tbody>
                {emailStats
                  .slice()
                  .sort((a, b) => a.year - b.year || a.month - b.month)
                  .map((item) => {
                    const rate = item.delivered ? (item.opened / item.delivered) * 100 : 0;
                    return (
                      <tr key={`${item.year}-${item.month}`} className="border-t border-gray-100 text-gray-700">
                        <td className="px-4 py-3 font-medium text-gray-900">{item.monthName} {item.year}</td>
                        {["sent", "delivered", "opened"].map((field) => (
                          <td key={field} className="px-4 py-3">
                            <label className="sr-only" htmlFor={`${field}-${item.year}-${item.month}`}>{`${item.monthName} ${field}`}</label>
                            <input
                              id={`${field}-${item.year}-${item.month}`}
                              type="number"
                              min="0"
                              defaultValue={item[field]}
                              onBlur={(event) => updateValue(item, field, Number(event.target.value))}
                              className="w-24 rounded border border-gray-200 px-2 py-1 text-sm outline-none focus:border-gray-400"
                            />
                          </td>
                        ))}
                        <td className="px-4 py-3">{rate.toFixed(2)}%</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <p className="flex items-center gap-1.5 border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
            <Send size={13} />Open rate is calculated as opened ÷ delivered × 100.
          </p>
        </section>
      </div>
    </section>
  );
}

export default EmailsPage;
