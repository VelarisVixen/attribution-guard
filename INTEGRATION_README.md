# Attribution Guard - Cookie Stuffing Scanner Integration

## 🎯 Overview

This project integrates the Python `cookie_stuffing_scanner.py` script with a React web application, providing a user-friendly interface for scanning URLs and detecting affiliate fraud and cookie stuffing attacks.

## 🏗️ Architecture

```
┌─────────────────────┐    HTTP API     ┌─────────────────────┐    Python      ┌──────────────────────┐
│   React Frontend    │ ◄──────────────► │  Node.js Backend    │ ◄─────────────► │  Python Scanner      │
│                     │                 │                     │                │                      │
│ • Upload URLs       │                 │ • Express Server    │                │ • Playwright Browser │
│ • Display Results   │                 │ • Scan Management   │                │ • Cookie Detection   │
│ • Download CSV      │                 │ • API Endpoints     │                │ • CSV Generation     │
└─────────────────────┘                 └─────────────────────┘                └──────────────────────┘
```

## 🔧 Components

### Frontend (React)
- **WelcomePage**: Landing page with cybersecurity theme
- **UploadPage**: URL input via manual entry or file upload
- **ResultsPage**: Displays scan results with threat detection
- **API Service**: Handles communication with backend

### Backend (Node.js/Express)
- **server.js**: Main API server with endpoints:
  - `POST /api/scan` - Start new scan
  - `GET /api/scan/:id` - Check scan status
  - `GET /api/scan/:id/csv` - Download CSV report
- **scanner_adapter.py**: Python wrapper that calls the original scanner

### Scanner Integration
- Uses the original `cookie_stuffing_scanner.py` for detection
- Fallback mock scanner when Playwright dependencies unavailable
- Real-time scanning with progress tracking
- CSV report generation with proper formatting

## 🚀 Running the Application

### Option 1: Manual Startup
```bash
# Terminal 1: Start backend
cd server
npm install
npm start

# Terminal 2: Start frontend  
npm run dev
```

### Option 2: Development Script
```bash
# Run both frontend and backend together
./start-dev.sh
```

## 📊 Data Flow

1. **User Input**: URLs entered manually or uploaded via .txt file
2. **API Call**: Frontend sends URLs to backend `/api/scan` endpoint
3. **Python Execution**: Backend spawns Python scanner with URL list
4. **Real-time Scanning**: Python script analyzes each URL for threats:
   - Cookie stuffing detection
   - Suspicious network requests
   - Hidden malicious iframes
   - Screenshot capture
5. **Result Processing**: Scanner results formatted for web display
6. **CSV Generation**: Detailed report generated in standard format
7. **Frontend Display**: Results shown with risk levels and threat details

## 🔍 Detection Capabilities

The integrated scanner detects:
- **Cookie Stuffing**: Unauthorized affiliate cookies
- **Hidden Tracking**: Invisible tracking pixels and iframes
- **Suspicious Requests**: Malicious network calls
- **Affiliate Fraud**: Fraudulent affiliate links and redirects

## 📁 File Structure

```
├── src/
│   ├── components/
│   │   ├── WelcomePage.jsx      # Landing page
│   │   ├── UploadPage.jsx       # URL input interface
│   │   └── ResultsPage.jsx      # Scan results display
│   └── lib/
│       └── api.js               # Backend API client
├── server/
│   ├── server.js                # Express API server
│   ├── scanner_adapter.py       # Python wrapper
│   └── package.json             # Backend dependencies
├── cookie_stuffing_scanner.py   # Original Python scanner
└── start-dev.sh                 # Development startup script
```

## 🎨 Features

- **Modern UI**: Cybersecurity-themed interface with animations
- **Real-time Scanning**: Live progress updates during analysis
- **Threat Classification**: Risk levels (High, Medium, Low, Clean)
- **CSV Export**: Download detailed reports in standard format
- **Error Handling**: Graceful fallbacks and user feedback
- **Responsive Design**: Works on desktop and mobile devices

## 🛡️ Security Features

- CORS protection for API endpoints
- Input validation for URLs
- Secure file upload handling
- Error logging and monitoring
- Cleanup of temporary files

## 📈 CSV Report Format

The generated CSV reports include:
- **URL**: Scanned website URL
- **Risk Level**: Threat classification
- **Threats**: Detected security issues
- **Details**: Technical detection information
- **Timestamp**: Scan completion time

## 🔄 Development Notes

- Backend runs on port 3001 by default
- Frontend proxy configured for API communication
- Mock scanner available when Python dependencies missing
- Automatic cleanup of old scan results
- Screenshot capture for suspicious content
