import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import questionsData from "../../data/questions.json";

// Calculate total questions by main diagnostic type
const getDiagnosticTypeData = () => {
  const categories = questionsData.Questions;
  const typeMap: { [key: string]: number } = {};

  categories.forEach((category) => {
    const categoryName = Object.keys(category)[0];
    const questions = category[categoryName as keyof typeof category] as any[];

    // Group by main diagnostic type
    let mainType = "Other";
    if (categoryName.includes("Marketing")) {
      mainType = "Marketing Digital";
    } else if (categoryName.includes("Opérationnel")) {
      mainType = "Operational";
    } else if (categoryName.includes("Stratégique")) {
      mainType = "Strategic";
    }

    typeMap[mainType] = (typeMap[mainType] || 0) + questions.length;
  });

  return Object.entries(typeMap).map(([name, value]) => ({ name, value }));
};

const COLORS = ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0"];

const AnalyticsPieChart = () => {
  const data = getDiagnosticTypeData();

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Diagnostic Types Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            label={({
              cx,
              cy,
              midAngle = 0,
              innerRadius,
              outerRadius,
              percent = 1,
              index,
            }) => {
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

              return (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                  className="font-semibold"
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                    <p className="font-semibold text-gray-800">
                      {payload[0].name}
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsPieChart;
