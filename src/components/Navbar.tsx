import React from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./UI/Button";
import { LayoutDashboard } from "lucide-react";
export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 text-green-600">
            <LayoutDashboard className="h-5 w-5 " />
            <h2 className="text-xl  ">Admin Dashboard</h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">
                {user?.name}
              </span>
            </div>
            <Button
              onClick={logout}
              variant="primary"
              size="sm"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
