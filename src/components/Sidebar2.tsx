import { useState, type ReactNode } from "react";
import { Home, Users, Settings, LogOut, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

type NavItem = {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: <Home /> },
  { id: "users", label: "Users", path: "/users", icon: <Users /> },
  { id: "reports", label: "Reports", path: "/reports", icon: <BarChart3 /> },
  { id: "settings", label: "Settings", path: "/settings", icon: <Settings /> },
];

const Sidebar2: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={{ width: 240 }}
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
      className="h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-lg flex flex-col"
    >
      {/* Logo / Header */}
      <div className="flex items-center justify-between p-4">
        <motion.h1
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          className="text-xl font-bold tracking-wide whitespace-nowrap"
        >
          MyApp
        </motion.h1>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-slate-700 transition"
        >
          {isCollapsed ? "»" : "«"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mx-2 mb-2 transition-colors
                ${
                  isActive
                    ? "bg-slate-700 text-white font-medium"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-700">
        <button className="flex items-center gap-3 w-full px-4 py-2 rounded-xl text-slate-300 hover:bg-red-600 hover:text-white transition">
          <LogOut className="text-xl" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar2;