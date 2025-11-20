import React from "react";
import { Layout } from "../components/Layout";

export const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to Cooperatives Management</p>
        </div>
      </div>
    </Layout>
  );
};
