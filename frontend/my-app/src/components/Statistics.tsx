import { Box, Card, CardContent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#FF8042'];

interface WorkerData {
  totalWorkers: number;
  clicked: number;
}

const Statistics: React.FC = () => {
  const [data, setData] = useState<WorkerData | null>(null);

  useEffect(() => {
    // Mock fetch function, replace with actual API call
    const fetchWorkerData = async () => {
      const response = await fetch('/api/statistics');
      const result = await response.json();
      setData(result);
    };

    fetchWorkerData();
  }, []);

  if (!data) {
    return <Typography>There is no data yet...</Typography>;
  }

  const chartData = [
    { name: 'Clicked', value: data.clicked },
    { name: 'Not Clicked', value: data.totalWorkers - data.clicked },
  ];

  const totalPercentage = ((data.clicked / data.totalWorkers) * 100).toFixed(2);

  return (
    <Card sx={{ maxWidth: 600, margin: '20px auto', backgroundColor: '#f5f5f5', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
      <CardContent>
        <Typography sx={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: '20px' }}>
          Phishing Simulation Statistics
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary">
          {totalPercentage}% of workers clicked the suspicious link.
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Statistics;
