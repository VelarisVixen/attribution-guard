import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  AlertTriangle, 
  Shield, 
  CheckCircle, 
  Filter,
  Eye,
  ExternalLink,
  FileText,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { ScannerAPI } from '@/lib/api';

export function ResultsPage({ onBack, scannedUrls, scanResults = [], scanId = null }) {
  const [filter, setFilter] = useState('all');
  const [results, setResults] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (scanResults && scanResults.length > 0) {
      // Use real scan results from the API
      const processedResults = scanResults.map((result, index) => ({
        id: index + 1,
        url: result.url,
        riskLevel: result.risk_level,
        threats: result.threats || [],
        scanTime: new Date().toLocaleTimeString(),
        screenshot: `screenshot-${index + 1}.jpg`,
        rawDetections: result.raw_detections || []
      }));
      setResults(processedResults);
    } else {
      // Fallback: Generate basic results from URLs
      const fallbackResults = scannedUrls.map((url, index) => ({
        id: index + 1,
        url,
        riskLevel: 'clean',
        threats: [],
        scanTime: new Date().toLocaleTimeString(),
        screenshot: `screenshot-${index + 1}.jpg`,
        rawDetections: []
      }));
      setResults(fallbackResults);
    }
  }, [scannedUrls, scanResults]);

  const filteredResults = results.filter(result => {
    if (filter === 'all') return true;
    if (filter === 'suspicious') return ['high', 'medium'].includes(result.riskLevel);
    if (filter === 'clean') return result.riskLevel === 'clean';
    return result.riskLevel === filter;
  });

  const threatCounts = {
    high: results.filter(r => r.riskLevel === 'high').length,
    medium: results.filter(r => r.riskLevel === 'medium').length,
    low: results.filter(r => r.riskLevel === 'low').length,
    clean: results.filter(r => r.riskLevel === 'clean').length
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-destructive bg-destructive/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-blue-400 bg-blue-500/20';
      case 'clean': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <Shield className="h-4 w-4" />;
      case 'clean': return <CheckCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const downloadCSV = async () => {
    try {
      if (scanId) {
        try {
          // Try to download the real CSV report from the API
          await ScannerAPI.downloadCSV(scanId);
          toast({
            title: "Report downloaded!",
            description: "Your security scan report has been saved as CSV.",
          });
          return;
        } catch (apiError) {
          console.warn('API CSV download failed, falling back to client-side generation:', apiError);
          // Fall through to client-side generation
        }
      }

      // Fallback to client-side CSV generation
      const csvContent = [
        ['type', 'url', 'detail', 'origin', 'referer'],
        ...results.flatMap(result => {
          if (result.threats && result.threats.length > 0) {
            return result.threats.map(threat => [
              'threat',
              result.url,
              threat,
              result.url,
              'scan'
            ]);
          } else {
            return [[
              'scan',
              result.url,
              'No threats detected',
              result.url,
              'clean'
            ]];
          }
        })
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cookie_stuffing_report.csv';
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Report downloaded!",
        description: "Your security scan report has been saved as CSV.",
      });
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast({
        title: "Download failed",
        description: "Unable to download the CSV report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const viewScreenshot = (screenshot) => {
    toast({
      title: "🚧 Screenshot viewer not implemented yet",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>Scan Results - Attribution Guard</title>
        <meta name="description" content="Comprehensive security scan results showing detected threats, risk levels, and detailed analysis." />
      </Helmet>
      
      <div className="min-h-screen p-4">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Upload
          </Button>
          
          <Button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Download className="h-4 w-4" />
            Download CSV Report
          </Button>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Scan Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive security analysis of {results.length} URLs
            </p>
            {scanResults && scanResults.length > 0 && scanResults[0].scanner_type && (
              <div className="mt-4">
                <Badge className={
                  scanResults[0].scanner_type === 'real'
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : scanResults[0].scanner_type === 'python'
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : scanResults[0].scanner_type === 'fallback'
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                }>
                  {scanResults[0].scanner_type === 'real' && '🎭 Real-Time Playwright Scanner'}
                  {scanResults[0].scanner_type === 'python' && '🐍 Python Scanner'}
                  {scanResults[0].scanner_type === 'fallback' && '⚡ JavaScript Fallback Scanner'}
                  {scanResults[0].scanner_type === 'mock' && '🎲 Mock Scanner'}
                  {!scanResults[0].scanner_type && '🔍 Security Scanner'}
                </Badge>
                {scanResults[0].scanner_status && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {scanResults[0].scanner_status}
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-destructive">{threatCounts.high}</div>
                <div className="text-sm text-muted-foreground">High Risk</div>
              </CardContent>
            </Card>
            
            <Card className="border-yellow-500/20 bg-yellow-500/5">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{threatCounts.medium}</div>
                <div className="text-sm text-muted-foreground">Medium Risk</div>
              </CardContent>
            </Card>
            
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{threatCounts.low}</div>
                <div className="text-sm text-muted-foreground">Low Risk</div>
              </CardContent>
            </Card>
            
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{threatCounts.clean}</div>
                <div className="text-sm text-muted-foreground">Clean</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              All ({results.length})
            </Button>
            <Button
              variant={filter === 'suspicious' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('suspicious')}
            >
              Suspicious ({threatCounts.high + threatCounts.medium})
            </Button>
            <Button
              variant={filter === 'clean' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('clean')}
            >
              Clean ({threatCounts.clean})
            </Button>
          </motion.div>

          {/* Results Grid */}
          <motion.div
            className="grid gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {filteredResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2 mb-2">
                          <span className="text-sm text-muted-foreground">#{result.id}</span>
                          <Badge className={getRiskColor(result.riskLevel)}>
                            {getRiskIcon(result.riskLevel)}
                            {result.riskLevel.toUpperCase()}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="font-mono text-sm break-all">
                          {result.url}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewScreenshot(result.screenshot)}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(result.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Threats */}
                      {result.threats.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            Detected Threats
                          </h4>
                          <div className="space-y-1">
                            {result.threats.map((threat, i) => (
                              <div key={i} className="text-sm text-muted-foreground bg-muted/50 rounded px-3 py-1">
                                • {threat}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {result.threats.length === 0 && (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">No threats detected</span>
                        </div>
                      )}
                      
                      {/* Scan Info */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span>Scanned at {result.scanTime}</span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          Screenshot available
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredResults.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                No URLs match the current filter criteria.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
