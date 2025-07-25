import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint } from '@/types/memory';

interface MemoryChartProps {
  data: ChartDataPoint[];
  height?: number;
}

export const MemoryChart = ({ data, height = 300 }: MemoryChartProps) => {
  const formatTooltip = (value: any, name: string) => {
    if (name.includes('memory')) {
      return [`${value} MB`, name];
    }
    return [value, name];
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            label={{ value: 'Memory (MB)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={formatTooltip}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
              color: 'hsl(var(--card-foreground))',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="memoryRSS" 
            stroke="hsl(var(--chart-memory-rss))" 
            strokeWidth={2}
            dot={false}
            name="RSS Memory"
          />
          <Line 
            type="monotone" 
            dataKey="memoryHeapUsed" 
            stroke="hsl(var(--chart-memory-heap-used))" 
            strokeWidth={2}
            dot={false}
            name="Heap Used"
          />
          <Line 
            type="monotone" 
            dataKey="memoryHeapTotal" 
            stroke="hsl(var(--chart-memory-heap-total))" 
            strokeWidth={2}
            dot={false}
            name="Heap Total"
          />
          <Line 
            type="monotone" 
            dataKey="memoryExternal" 
            stroke="hsl(var(--chart-memory-external))" 
            strokeWidth={2}
            dot={false}
            name="External Memory"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};