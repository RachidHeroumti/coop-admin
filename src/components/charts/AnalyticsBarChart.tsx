import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import questionsData from "../../data/questions.json";

// Calculate questions count per category
const getCategoryData = () => {
  const categories = questionsData.Questions;
  return categories.map((category) => {
    const categoryName = Object.keys(category)[0];
    const questions = category[categoryName as keyof typeof category] as any[];
    return {
      name: categoryName.replace("Diagnostic ", "").substring(0, 20),
      questions: questions.length,
      fullName: categoryName,
    };
  });
};

const AnalyticsBarChart = () => {
  const data = getCategoryData();

  return (
    <div className="p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Questions Distribution by Category
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                    <p className="font-semibold text-gray-800">
                      {payload[0].payload.fullName}
                    </p>
                    <p className="text-green-600">
                      Questions: {payload[0].value}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="questions" fill="#16a34a" name="Number of Questions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsBarChart;
