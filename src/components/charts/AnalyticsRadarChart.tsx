import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import questionsData from "../../data/questions.json";

// Get operational diagnostic sub-axes data
const getOperationalData = () => {
  const categories = questionsData.Questions;
  const operationalCategory = categories.find((cat) =>
    Object.keys(cat)[0].includes("Opérationnel")
  );

  if (!operationalCategory) return [];

  // Extract sub-axes from the Scales
  const subAxes =
    questionsData.Scales.Axes["Diagnostic Opérationnel"].sous_axes;

  // Count questions per sub-axis (simulated data for demonstration)
  return subAxes.map((axis, index) => ({
    subject: axis,
    score: Math.floor(Math.random() * 5) + 1, // Random score 1-5 for demo
    fullMark: 5,
  }));
};

const AnalyticsRadarChart = () => {
  const data = getOperationalData();

  return (
    <div className="p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Operational Diagnostic Performance
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={90} domain={[0, 5]} />
          <Radar
            name="Performance Score"
            dataKey="score"
            stroke="#16a34a"
            fill="#16a34a"
            fillOpacity={0.6}
          />
          <Legend />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                    <p className="font-semibold text-gray-800">
                      {payload[0].payload.subject}
                    </p>
                    <p className="text-green-600">
                      Score: {payload[0].value} / 5
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsRadarChart;
