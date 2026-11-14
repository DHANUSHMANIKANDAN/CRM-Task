import NotificationCenter from "./NotificationCenter.jsx";

function NotificationPage() {
  return (
    <section className="min-h-full bg-gray-50/50">
      <div className="border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
        <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review task updates, mentions, and requests in one place.
        </p>
      </div>
      <div className="mx-auto max-w-5xl p-4 sm:p-7">
        <NotificationCenter />
      </div>
    </section>
  );
}

export default NotificationPage;
