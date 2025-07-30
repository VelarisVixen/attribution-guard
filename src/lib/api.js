const API_BASE_URL = '';

export class ScannerAPI {
  static async startScan(urls) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error starting scan:', error);

      // Check if it's a network connectivity issue
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Unable to connect to scanning service. Please ensure the backend server is running.');
      }

      throw error;
    }
  }

  static async getScanStatus(scanId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scan/${scanId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting scan status:', error);
      throw error;
    }
  }

  static async downloadCSV(scanId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scan/${scanId}/csv`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob and create download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cookie_stuffing_report.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (error) {
      console.error('Error downloading CSV:', error);
      throw error;
    }
  }

  static async pollScanUntilComplete(scanId, onProgress = null) {
    const maxAttempts = 120; // 2 minutes with 1-second intervals
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getScanStatus(scanId);
          
          if (onProgress) {
            onProgress(status);
          }

          if (status.status === 'completed') {
            resolve(status);
            return;
          }

          if (status.status === 'error') {
            reject(new Error(status.error || 'Scan failed'));
            return;
          }

          attempts++;
          if (attempts >= maxAttempts) {
            reject(new Error('Scan timeout'));
            return;
          }

          // Continue polling
          setTimeout(poll, 1000);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }
}
