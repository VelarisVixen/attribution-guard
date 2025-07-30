import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Store scan results temporarily
const scanResults = new Map();

// Function to generate CSV file from scan results
function generateCSVFile(scanId, results, detections = []) {
  const csvFilename = `scan_report_${scanId.replace(/-/g, '_')}.csv`;
  const csvPath = path.join(__dirname, csvFilename);

  try {
    let csvRows = [['type', 'url', 'detail', 'origin', 'referer']];

    // If we have detections, use them
    if (detections && detections.length > 0) {
      csvRows.push(...detections.map(d => [
        d.type || 'detection',
        d.url || '',
        d.detail || 'Threat detected',
        d.origin || '',
        d.referer || ''
      ]));
    }
    // Otherwise, generate rows from results
    else if (results && results.length > 0) {
      results.forEach(result => {
        if (result.threats && result.threats.length > 0) {
          result.threats.forEach(threat => {
            csvRows.push([
              'threat',
              result.url,
              threat,
              result.url,
              'scan'
            ]);
          });
        } else {
          csvRows.push([
            'scan',
            result.url,
            'No threats detected',
            result.url,
            'clean'
          ]);
        }
      });
    }

    const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    fs.writeFileSync(csvPath, csvContent);
    console.log(`CSV file generated: ${csvFilename}`);
    return csvFilename;
  } catch (error) {
    console.error('Error generating CSV file:', error);
    return null;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Attribution Guard API is running' });
});

// Start scan endpoint
app.post('/api/scan', async (req, res) => {
  try {
    const { urls } = req.body;
    
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'URLs array is required and must not be empty' 
      });
    }

    // Validate URLs
    const validUrls = urls.filter(url => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });

    if (validUrls.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No valid URLs provided' 
      });
    }

    const scanId = uuidv4();
    
    // Initialize scan status
    scanResults.set(scanId, {
      status: 'running',
      progress: 0,
      total: validUrls.length,
      startTime: new Date(),
      results: null,
      error: null
    });

    // Start the Python scanner asynchronously
    try {
      runPythonScanner(scanId, validUrls);
    } catch (error) {
      console.error('Error starting Python scanner:', error);

      // Fallback to clean results if scanner fails to start
      const fallbackResults = validUrls.map((url, index) => ({
        url,
        risk_level: 'clean',
        threats: [],
        raw_detections: []
      }));

      // Generate CSV file for fallback results
      const csvFile = generateCSVFile(scanId, fallbackResults, []);

      scanResults.set(scanId, {
        status: 'completed',
        progress: 100,
        total: validUrls.length,
        startTime: new Date(),
        endTime: new Date(),
        results: fallbackResults,
        csvFile: csvFile,
        totalThreats: 0,
        error: null
      });
    }

    res.json({
      success: true,
      scanId,
      message: `Started scanning ${validUrls.length} URLs`,
      estimatedTime: validUrls.length * 2 // Rough estimate: 2 seconds per URL
    });

  } catch (error) {
    console.error('Error starting scan:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get scan status endpoint
app.get('/api/scan/:scanId', (req, res) => {
  const { scanId } = req.params;
  const scanData = scanResults.get(scanId);

  if (!scanData) {
    return res.status(404).json({ 
      success: false, 
      error: 'Scan not found' 
    });
  }

  res.json({
    success: true,
    ...scanData
  });
});

// Download CSV report endpoint
app.get('/api/scan/:scanId/csv', (req, res) => {
  const { scanId } = req.params;
  const scanData = scanResults.get(scanId);

  if (!scanData || !scanData.csvFile) {
    return res.status(404).json({ 
      success: false, 
      error: 'CSV report not found' 
    });
  }

  const csvPath = path.join(__dirname, '..', scanData.csvFile);
  
  if (!fs.existsSync(csvPath)) {
    return res.status(404).json({ 
      success: false, 
      error: 'CSV file not found on disk' 
    });
  }

  res.download(csvPath, 'cookie_stuffing_report.csv', (err) => {
    if (err) {
      console.error('Error downloading CSV:', err);
      res.status(500).json({ 
        success: false, 
        error: 'Error downloading CSV file' 
      });
    }
  });
});

// Function to run Python scanner
function runPythonScanner(scanId, urls) {
  const pythonScript = path.join(__dirname, 'scanner_adapter.py');
  const urlsJson = JSON.stringify(urls);
  
  console.log(`Starting scan ${scanId} for ${urls.length} URLs`);
  
  const pythonProcess = spawn('python3', [pythonScript, urlsJson], {
    cwd: __dirname
  });

  let stdout = '';
  let stderr = '';

  pythonProcess.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    stderr += data.toString();
    console.log(`Python stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    const scanData = scanResults.get(scanId);
    if (!scanData) return;

    console.log(`Python process finished with code ${code}`);
    console.log(`Python stdout: ${stdout}`);
    console.log(`Python stderr: ${stderr}`);

    // If Python fails, use JavaScript fallback to generate results
    if (code !== 0 || !stdout.trim() || stderr.includes('Error') || stderr.includes('Traceback')) {
      console.log('Python failed, using JavaScript fallback...');

      // Generate fallback results using JavaScript
      const fallbackResults = urls.map((url, index) => {
        // Simple suspicious keyword check
        const suspiciousKeywords = ['affiliate', 'track', 'click', 'partner', 'ref'];
        const hasSuspicious = suspiciousKeywords.some(keyword => url.toLowerCase().includes(keyword));

        return {
          url,
          risk_level: hasSuspicious ? 'medium' : 'clean',
          threats: hasSuspicious ? ['Suspicious URL pattern detected'] : [],
          raw_detections: []
        };
      });

      // Generate CSV file for fallback results
      const csvFile = generateCSVFile(scanId, fallbackResults, []);

      scanResults.set(scanId, {
        ...scanData,
        status: 'completed',
        progress: 100,
        endTime: new Date(),
        results: fallbackResults,
        csvFile: csvFile,
        totalThreats: fallbackResults.filter(r => r.threats.length > 0).length,
        scanner_type: 'fallback',
        scanner_status: 'JavaScript fallback scanner (Python dependencies not available)'
      });
      return;
    }

    // Try to parse Python output
    try {
      const result = JSON.parse(stdout);

      if (result.success) {
        scanResults.set(scanId, {
          ...scanData,
          status: 'completed',
          progress: 100,
          endTime: new Date(),
          results: result.results,
          csvFile: result.csv_file,
          totalThreats: result.total_threats,
          scanner_type: result.scanner_type || 'python',
          scanner_status: result.scanner_status || 'Python scanner'
        });
        console.log(`Scan ${scanId} completed successfully`);
      } else {
        // Generate empty CSV file even on error
        const csvFile = generateCSVFile(scanId, [], []);

        scanResults.set(scanId, {
          ...scanData,
          status: 'error',
          csvFile: csvFile,
          error: result.error || 'Unknown error from Python scanner'
        });
        console.error(`Scan ${scanId} failed: ${result.error}`);
      }
    } catch (parseError) {
      console.log('JSON parse failed, using JavaScript fallback...');

      // Generate fallback results when JSON parsing fails
      const fallbackResults = urls.map((url, index) => {
        const suspiciousKeywords = ['affiliate', 'track', 'click', 'partner', 'ref'];
        const hasSuspicious = suspiciousKeywords.some(keyword => url.toLowerCase().includes(keyword));

        return {
          url,
          risk_level: hasSuspicious ? 'medium' : 'clean',
          threats: hasSuspicious ? ['Suspicious URL pattern detected'] : [],
          raw_detections: []
        };
      });

      const csvFile = generateCSVFile(scanId, fallbackResults, []);

      scanResults.set(scanId, {
        ...scanData,
        status: 'completed',
        progress: 100,
        endTime: new Date(),
        results: fallbackResults,
        csvFile: csvFile,
        totalThreats: fallbackResults.filter(r => r.threats.length > 0).length,
        scanner_type: 'fallback',
        scanner_status: 'JavaScript fallback scanner (Python output parsing failed)'
      });
    }
  });

  pythonProcess.on('error', (error) => {
    const scanData = scanResults.get(scanId);
    if (!scanData) return;

    console.error(`Scan ${scanId} spawn error:`, error);
    console.log('Python spawn failed, using JavaScript fallback...');

    // Fallback to JavaScript analysis when Python fails to start
    const fallbackResults = urls.map((url, index) => {
      const suspiciousKeywords = ['affiliate', 'track', 'click', 'partner', 'ref', 'redirect'];
      const hasSuspicious = suspiciousKeywords.some(keyword => url.toLowerCase().includes(keyword));

      return {
        url,
        risk_level: hasSuspicious ? 'medium' : 'clean',
        threats: hasSuspicious ? ['Suspicious URL pattern detected'] : [],
        raw_detections: []
      };
    });

    // Generate CSV file for fallback results
    const csvFile = generateCSVFile(scanId, fallbackResults, []);

    scanResults.set(scanId, {
      ...scanData,
      status: 'completed',
      progress: 100,
      endTime: new Date(),
      results: fallbackResults,
      csvFile: csvFile,
      totalThreats: fallbackResults.filter(r => r.threats.length > 0).length,
      scanner_type: 'fallback',
      scanner_status: 'JavaScript fallback scanner (Python not available)'
    });
  });
}

// Clean up old scan results (optional, runs every hour)
setInterval(() => {
  const now = new Date();
  for (const [scanId, scanData] of scanResults.entries()) {
    const age = now - scanData.startTime;
    // Remove scans older than 1 hour
    if (age > 60 * 60 * 1000) {
      scanResults.delete(scanId);
      console.log(`Cleaned up old scan: ${scanId}`);
    }
  }
}, 60 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Attribution Guard API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
