export interface MemoryCheckResponse {
  success: boolean;
  data: {
    memoryUsage: {
      rss: number;
      rssFormatted: string;
      heapUsed: number;
      heapUsedFormatted: string;
      heapTotal: number;
      heapTotalFormatted: string;
      external: number;
      externalFormatted: string;
      arrayBuffers: number;
      arrayBuffersFormatted: string;
    };
    process: {
      pid: number;
      ppid: number;
      platform: string;
      arch: string;
      nodeVersion: string;
      uptime: number;
      uptimeFormatted: string;
    };
    cpuUsage: {
      user: number;
      system: number;
    };
    resourceUsage: {
      userCPUTime: number;
      systemCPUTime: number;
      maxRSS: number;
      sharedMemorySize: number;
      unsharedDataSize: number;
      unsharedStackSize: number;
      minorPageFault: number;
      majorPageFault: number;
      swappedOut: number;
      fsRead: number;
      fsWrite: number;
      ipcSent: number;
      ipcReceived: number;
      signalsCount: number;
      voluntaryContextSwitches: number;
      involuntaryContextSwitches: number;
    };
    environment: {
      timezone: string;
      locale: string;
    };
    hrtime: string;
    timestamp: string;
  };
  meta: {
    requestDuration: string;
    endpoint: string;
  };
}

export interface ChartDataPoint {
  timestamp: string;
  time: string;
  memoryRSS: number;
  memoryHeapUsed: number;
  memoryHeapTotal: number;
  memoryExternal: number;
  cpuUser: number;
  cpuSystem: number;
  uptime: number;
}