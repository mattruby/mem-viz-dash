import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMemoryData } from '@/hooks/useMemoryData';
import { MemoryChart } from './MemoryChart';
import { CPUChart } from './CPUChart';
import { MetricCard } from './MetricCard';
import { Activity, Server, Clock, Zap } from 'lucide-react';

export const MemoryMonitor = () => {
  const { currentData, chartData, error, isLoading } = useMemoryData();

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-destructive text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
              <p className="text-muted-foreground">
                Unable to connect to the memory endpoint. Using mock data for demonstration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading && !currentData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-pulse">
            <Activity className="w-8 h-8 mx-auto mb-4 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading memory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Memory Monitor</h1>
              <p className="text-muted-foreground">Real-time system performance tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-primary border-primary">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2" />
              Live
            </Badge>
            {currentData && (
              <Badge variant="secondary">
                {currentData.meta.requestDuration}
              </Badge>
            )}
          </div>
        </div>

        {/* Current Metrics */}
        {currentData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="RSS Memory"
              value={currentData.data.memoryUsage.rssFormatted}
              subtitle="Resident Set Size"
              trend="stable"
            />
            <MetricCard
              title="Heap Used"
              value={currentData.data.memoryUsage.heapUsedFormatted}
              subtitle="Active heap memory"
              trend="up"
            />
            <MetricCard
              title="Uptime"
              value={currentData.data.process.uptimeFormatted}
              subtitle="Process running time"
              trend="up"
            />
            <MetricCard
              title="Response Time"
              value={currentData.meta.requestDuration}
              subtitle="API latency"
              trend="stable"
            />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-chart-memory-rss" />
                Memory Usage Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MemoryChart data={chartData} height={350} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-chart-cpu-user" />
                CPU Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CPUChart data={chartData} height={350} />
            </CardContent>
          </Card>
        </div>

        {/* Process Information */}
        {currentData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Process Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PID:</span>
                  <span className="font-mono">{currentData.data.process.pid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform:</span>
                  <span className="font-mono">{currentData.data.process.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Architecture:</span>
                  <span className="font-mono">{currentData.data.process.arch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Node Version:</span>
                  <span className="font-mono">{currentData.data.process.nodeVersion}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Environment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timezone:</span>
                  <span className="font-mono">{currentData.data.environment.timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Locale:</span>
                  <span className="font-mono">{currentData.data.environment.locale}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-mono text-xs">
                    {new Date(currentData.data.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data Points:</span>
                  <span className="font-mono">{chartData.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};