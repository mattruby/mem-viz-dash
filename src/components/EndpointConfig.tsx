import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Check, AlertCircle } from 'lucide-react';

interface EndpointConfigProps {
  currentUrl: string;
  onUrlChange: (url: string) => void;
  isConnected: boolean;
  lastError?: string;
}

export const EndpointConfig = ({ 
  currentUrl, 
  onUrlChange, 
  isConnected,
  lastError 
}: EndpointConfigProps) => {
  const [inputUrl, setInputUrl] = useState(currentUrl);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    onUrlChange(inputUrl);
    setIsExpanded(false);
  };

  const handleReset = () => {
    setInputUrl('/mem-check');
    onUrlChange('/mem-check');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Endpoint Configuration
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isConnected ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {isConnected ? (
                <>
                  <Check className="w-3 h-3" />
                  Connected
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" />
                  Using Mock Data
                </>
              )}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide' : 'Configure'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Memory Check Endpoint URL</label>
            <div className="flex gap-2">
              <Input
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter your memory endpoint URL (e.g., https://api.example.com/mem-check)"
                className="flex-1"
              />
              <Button onClick={handleSave} size="sm">
                Save
              </Button>
              <Button onClick={handleReset} variant="outline" size="sm">
                Reset
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Current URL:</strong> <code className="bg-muted px-1 rounded">{currentUrl}</code></p>
            {lastError && (
              <p className="text-destructive">
                <strong>Last Error:</strong> {lastError}
              </p>
            )}
            <div className="bg-muted p-3 rounded-md">
              <p className="font-medium mb-1">Expected JSON format:</p>
              <pre className="text-xs overflow-auto">
{`{
  "success": true,
  "data": {
    "memoryUsage": {
      "rss": 248168448,
      "rssFormatted": "237 MB",
      "heapUsed": 119239952,
      "heapUsedFormatted": "114 MB",
      "heapTotal": 134086656,
      "heapTotalFormatted": "128 MB",
      "external": 5557201,
      "externalFormatted": "5 MB"
    },
    "process": {
      "uptime": 35.971356125,
      "uptimeFormatted": "36 seconds"
    },
    "cpuUsage": {
      "user": 2884297,
      "system": 531100
    },
    "timestamp": "2025-07-25T17:09:40.634Z"
  }
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};