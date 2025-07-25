import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint } from '@/types/memory';

interface CPUChartProps {
  data: ChartDataPoint[];
  height?: number;
}

export const CPUChart = ({ data, height = 200 }: CPUChartProps) => {
  // Convert CPU usage to relative values for better visualization
  const processedData = data.map(point => ({
    ...point,
    cpuUserRelative: Math.round((point.cpuUser % 1000000) / 10000),
    cpuSystemRelative: Math.round((point.cpuSystem % 1000000) / 10000),
  }));

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--chart-text))"
            fontSize={12}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="hsl(var(--chart-text))"
            fontSize={12}
            label={{ value: 'CPU Usage', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
              color: 'hsl(var(--card-foreground))',
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="cpuUserRelative" 
            stackId="1"
            stroke="hsl(var(--chart-cpu-user))" 
            fill="hsl(var(--chart-cpu-user))"
            fillOpacity={0.6}
            name="User CPU"
          />
          <Area 
            type="monotone" 
            dataKey="cpuSystemRelative" 
            stackId="1"
            stroke="hsl(var(--chart-cpu-system))" 
            fill="hsl(var(--chart-cpu-system))"
            fillOpacity={0.6}
            name="System CPU"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};