import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Building2, Users } from "lucide-react";
export const Sidebar: React.FC = () => {
  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/cooperatives", label: "Cooperatives", icon: Building2 },
    { to: "/users", label: "Users", icon: Users },
  ];

  return (
    <div className="bg-white h-full shadow-lg border-r border-gray-200 flex flex-col w-64">
      {/* Header */}
      <div className="p-4 flex items-center justify-start border-b border-gray-200">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-green-600 tracking-wide">
          <span> Cooperatives </span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto mt-4">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex  items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-green-100 text-green-800 shadow-sm"
                        : "text-green-700 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <div
                    className={`p-2 rounded-md flex items-center justify-center transition-colors duration-300 ${
                      item.to === window.location.pathname
                        ? "bg-green-200"
                        : "bg-gray-100 group-hover:bg-gray-200"
                    }`}
                  >
                    <IconComponent className="h-5 w-5 text-green-700" />
                  </div>
                  <span className="text-lg">{item.label}</span>
                  {item.to === window.location.pathname && (
                    <span className="w-1 h-6 bg-green-700 rounded-full ml-auto" />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
