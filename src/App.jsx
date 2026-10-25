import { useState, useCallback, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header     from "./components/Header";
import Sidebar    from "./components/Sidebar";

import Dashboard       from "./pages/Dashboard";
import LiveMonitoring  from "./pages/LiveMonitoring";
import GraphsPage      from "./pages/GraphsPage";
import AlertsPage      from "./pages/AlertsPage";
import HistoryPage     from "./pages/HistoryPage";
import SettingsPage    from "./pages/SettingsPage";

function App() {
  // Theme state: dark (default) or light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("nicu_theme") || "dark";
  });

  const [alertCount,  setAlertCount]  = useState(0);
  const [hasAlert,    setHasAlert]    = useState(false);
  const [lastUpdate,  setLastUpdate]  = useState("—");
  const [sidebarWide, setSidebarWide] = useState(true);

  // Sync data-theme attribute on document root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nicu_theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const handleAlertUpdate = useCallback((count, active, timestamp) => {
    setAlertCount(count);
    setHasAlert(active);
    if (timestamp) setLastUpdate(timestamp);
  }, []);

  return (
    <div
      className="min-h-screen bg-grid"
      style={{
        backgroundColor: "var(--navy-950)",
        color: "var(--text-primary)",
        transition: "background-color 0.25s ease, color 0.25s ease",
      }}
    >
      {/* Header with Theme Toggle */}
      <Header
        alertCount={alertCount}
        lastUpdate={lastUpdate}
        hasActiveAlert={hasAlert}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Sidebar with dynamic width */}
      <Sidebar onWidthChange={setSidebarWide} />

      {/* Main Content Area */}
      <main
        style={{
          marginLeft: sidebarWide ? 218 : 60,
          marginTop: 62,
          padding: "24px 24px 48px 24px",
          minHeight: "calc(100vh - 62px)",
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Routes>
          <Route
            index
            element={<Dashboard onAlertUpdate={handleAlertUpdate} />}
          />
          <Route path="/live"     element={<LiveMonitoring />} />
          <Route path="/graphs"   element={<GraphsPage />} />
          <Route path="/alerts"   element={<AlertsPage />} />
          <Route path="/history"  element={<HistoryPage />} />
          <Route
            path="/settings"
            element={<SettingsPage theme={theme} onToggleTheme={toggleTheme} />}
          />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
