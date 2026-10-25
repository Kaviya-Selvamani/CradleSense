// =============================================================
// Sidebar.jsx — CradleSense
// Navigation sidebar with CradleSense branding and alert badge.
// =============================================================

import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  LineChart,
  Bell,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Baby,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const NAV_ITEMS = [
  { to: "/",         icon: LayoutDashboard, label: "Dashboard",       end: true },
  { to: "/live",     icon: Activity,        label: "Live Monitoring"            },
  { to: "/graphs",   icon: LineChart,       label: "Graphs"                     },
  { to: "/alerts",   icon: Bell,            label: "Alerts",          alertKey: true },
  { to: "/history",  icon: History,         label: "History"                    },
  { to: "/settings", icon: Settings,        label: "Settings"                   },
];

function Sidebar({ onWidthChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const { totalActiveAlerts } = useApp();

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    onWidthChange?.(!next);
  };

  return (
    <aside
      className="sidebar-transition fixed left-0 bottom-0 z-40 flex flex-col"
      style={{
        top:        "80px", // below header (54px main + 26px disclaimer)
        width:      collapsed ? 60 : 218,
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
    >
      {/* CradleSense Identity */}
      <div
        className="flex items-center gap-3 px-3.5 py-4"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-xl"
          style={{ width: 32, height: 32, background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.22)" }}
        >
          <Baby size={16} className="text-sky-500" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-bold leading-tight truncate" style={{ fontSize: 12, color: "var(--text-primary)", letterSpacing: "0.03em" }}>
              CradleSense
            </div>
            <div className="mono leading-tight truncate mt-0.5" style={{ fontSize: 9, color: "var(--text-muted)" }}>
              6-Bed NICU Monitor
            </div>
          </div>
        )}
      </div>

      {/* Section label */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-1.5 uppercase tracking-widest font-semibold" style={{ fontSize: 8.5, color: "var(--text-faint)" }}>
          Navigation
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-1 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end, alertKey }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="block"
            style={{ textDecoration: "none" }}
          >
            {({ isActive }) => (
              <div
                className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl mb-0.5 relative group"
                style={{
                  background: isActive ? "rgba(56,189,248,0.12)" : "transparent",
                  cursor: "pointer",
                  transition: "background 0.18s ease",
                  userSelect: "none",
                }}
              >
                {/* Active left bar */}
                {isActive && (
                  <span
                    className="absolute left-0 top-2 bottom-2 rounded-r-full"
                    style={{ width: 2.5, background: "var(--blue-accent)" }}
                  />
                )}

                {/* Icon */}
                <span
                  className="flex-shrink-0 flex items-center justify-center rounded-lg relative"
                  style={{ width: 30, height: 30, color: isActive ? "var(--blue-accent)" : "var(--text-muted)", transition: "color 0.18s ease" }}
                  title={collapsed ? label : undefined}
                >
                  <Icon size={16} />
                  {/* Alert badge on bell icon when collapsed */}
                  {alertKey && totalActiveAlerts > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full mono font-bold"
                      style={{ width: 14, height: 14, background: "var(--red-alert)", fontSize: 7.5, color: "#fff" }}
                    >
                      {totalActiveAlerts > 9 ? "9+" : totalActiveAlerts}
                    </span>
                  )}
                </span>

                {/* Label */}
                {!collapsed && (
                  <span
                    className="font-medium leading-none truncate flex-1"
                    style={{ fontSize: 12.5, color: isActive ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: isActive ? 600 : 500, transition: "color 0.18s ease" }}
                  >
                    {label}
                  </span>
                )}

                {/* Alert count badge in expanded mode */}
                {!collapsed && alertKey && totalActiveAlerts > 0 && (
                  <span
                    className="flex items-center justify-center rounded-full mono font-bold"
                    style={{ width: 18, height: 18, background: "var(--red-alert)", fontSize: 8.5, color: "#fff", flexShrink: 0 }}
                  >
                    {totalActiveAlerts > 9 ? "9+" : totalActiveAlerts}
                  </span>
                )}

                {/* Hover overlay */}
                {!isActive && (
                  <span
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                    style={{ background: "rgba(56,189,248,0.05)", transition: "opacity 0.15s ease" }}
                  />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Hardware info strip */}
      {!collapsed && (
        <div
          className="px-4 py-3 mono"
          style={{ borderTop: "1px solid var(--sidebar-border)", fontSize: 9, color: "var(--text-faint)", lineHeight: 1.5 }}
        >
          ESP32-S3 · MAX30102 · MLX90614
          <br />
          HTTP POST / Node.js Backend
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={toggleCollapse}
        className="flex items-center justify-center py-3 w-full cursor-pointer"
        style={{
          border: "none",
          borderTop: "1px solid var(--sidebar-border)",
          background: "transparent",
          color: "var(--text-muted)",
          transition: "color 0.15s ease",
        }}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}

export default Sidebar;
