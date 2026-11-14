
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import WelcomePage from "./components/WelcomePage";
import Layout from "./components/common/AppLayout.jsx";
import NotesPage from "./pages/NotesPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import { NotificationProvider } from "./pages/NotificationProvider.jsx";
import { CRMDataProvider } from "./pages/CRMDataProvider.jsx";
import ContactsPage from "./pages/ContactsPage.jsx";
import TaskPage from "./pages/TaskPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import CompaniesPage from "./pages/CompaniesPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import EmailsPage from "./pages/EmailsPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <CRMDataProvider>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route element={<Layout />}>
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/notifications" element={<NotificationPage />} />
              <Route path="/tasks" element={<TaskPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/emails" element={<EmailsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Route>
          </Routes>
        </CRMDataProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
