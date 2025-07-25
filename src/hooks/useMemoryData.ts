import { useQuery } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { MemoryCheckResponse, ChartDataPoint } from '@/types/memory';
import { fetchWithProxy } from '@/utils/proxy';

const MAX_DATA_POINTS = 100; // Keep last 100 points for performance

// Mock data generator for demo purposes
const generateMockData = (): MemoryCheckResponse => {
  const now = new Date();
  const baseMemory = 200000000;
  const variation = Math.random() * 50000000;
  
  return {
    success: true,
    data: {
      memoryUsage: {
        rss: baseMemory + variation,
        rssFormatted: `${Math.round((baseMemory + variation) / 1024 / 1024)} MB`,
        heapUsed: baseMemory * 0.5 + variation * 0.3,
        heapUsedFormatted: `${Math.round((baseMemory * 0.5 + variation * 0.3) / 1024 / 1024)} MB`,
        heapTotal: baseMemory * 0.6 + variation * 0.4,
        heapTotalFormatted: `${Math.round((baseMemory * 0.6 + variation * 0.4) / 1024 / 1024)} MB`,
        external: baseMemory * 0.02 + variation * 0.1,
        externalFormatted: `${Math.round((baseMemory * 0.02 + variation * 0.1) / 1024 / 1024)} MB`,
        arrayBuffers: 1945007,
        arrayBuffersFormatted: "2 MB"
      },
      process: {
        pid: 93996,
        ppid: 93922,
        platform: "darwin",
        arch: "arm64",
        nodeVersion: "v22.14.0",
        uptime: Date.now() / 1000,
        uptimeFormatted: `${Math.round(Date.now() / 1000)} seconds`
      },
      cpuUsage: {
        user: 2884297 + Math.random() * 1000000,
        system: 531100 + Math.random() * 200000
      },
      resourceUsage: {
        userCPUTime: 2884309,
        systemCPUTime: 531109,
        maxRSS: 410048,
        sharedMemorySize: 0,
        unsharedDataSize: 0,
        unsharedStackSize: 0,
        minorPageFault: 26622,
        majorPageFault: 0,
        swappedOut: 0,
        fsRead: 0,
        fsWrite: 0,
        ipcSent: 26612,
        ipcReceived: 77,
        signalsCount: 0,
        voluntaryContextSwitches: 10700,
        involuntaryContextSwitches: 8033
      },
      environment: {
        timezone: "America/Chicago",
        locale: "en-US"
      },
      hrtime: "611104358808250",
      timestamp: now.toISOString()
    },
    meta: {
      requestDuration: `${(Math.random() * 2).toFixed(2)}ms`,
      endpoint: "/mem-check"
    }
  };
};

export const useMemoryData = (endpoint: string = '/mem-check') => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [lastError, setLastError] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ['memory-check', endpoint],
    queryFn: async (): Promise<MemoryCheckResponse> => {
      try {
        setLastError('');
        const response = await fetchWithProxy(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        const jsonData = await response.json();
        setIsConnected(true);
        return jsonData;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setLastError(errorMessage);
        setIsConnected(false);
        console.warn('Using mock data:', errorMessage);
        return generateMockData();
      }
    },
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 4000, // Consider data stale after 4 seconds
  });

  const updateChartData = useCallback((newData: MemoryCheckResponse) => {
    const timestamp = new Date(newData.data.timestamp);
    const timeString = timestamp.toLocaleTimeString();
    
    const newPoint: ChartDataPoint = {
      timestamp: newData.data.timestamp,
      time: timeString,
      memoryRSS: Math.round(newData.data.memoryUsage.rss / 1024 / 1024), // Convert to MB
      memoryHeapUsed: Math.round(newData.data.memoryUsage.heapUsed / 1024 / 1024),
      memoryHeapTotal: Math.round(newData.data.memoryUsage.heapTotal / 1024 / 1024),
      memoryExternal: Math.round(newData.data.memoryUsage.external / 1024 / 1024),
      cpuUser: newData.data.cpuUsage.user,
      cpuSystem: newData.data.cpuUsage.system,
      uptime: newData.data.process.uptime,
    };

    setChartData(prev => {
      const updated = [...prev, newPoint];
      // Keep only the last MAX_DATA_POINTS for performance
      return updated.slice(-MAX_DATA_POINTS);
    });
  }, []);

  // Update chart data when new data arrives - moved to useEffect to prevent infinite renders
  useEffect(() => {
    if (data) {
      updateChartData(data);
    }
  }, [data, updateChartData]);

  return {
    currentData: data,
    chartData,
    error,
    isLoading,
    lastError,
    isConnected,
  };
};
