"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-xl px-4 py-3 border border-border shadow-xl">
        <p className="text-sm font-medium text-foreground">
          {payload[0].name}
        </p>
        <p className="text-lg font-bold mt-1" style={{ color: payload[0].payload.color }}>
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

export default function ExpenseChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-text-secondary text-sm">
        No expense data to display
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            animationBegin={200}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="transparent"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-text-secondary">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
