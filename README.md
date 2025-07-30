# 🛡️ Attribution Guard

**A powerful cybersecurity tool for detecting affiliate fraud and cookie stuffing attacks**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.x-blue.svg)](https://python.org/)

---

## 🎯 Problem Statement

**Cookie stuffing** and **affiliate fraud** are serious threats in the digital advertising ecosystem that cost businesses millions of dollars annually:

- **Cookie Stuffing**: Malicious placement of tracking cookies without user consent to steal affiliate commissions
- **Hidden Tracking**: Invisible pixels and iframes that track users across websites
- **Fraudulent Redirects**: Unauthorized redirect chains that manipulate affiliate attribution
- **Commission Theft**: Fraudsters stealing legitimate affiliate commissions through technical exploits

Attribution Guard solves these problems by providing **real-time detection**, **comprehensive analysis**, and **detailed reporting** of suspicious activities across your affiliate ecosystem.

---

## 🏗️ Architecture Overview

```
┌─────────────────────┐    HTTP/REST API    ┌─────────────────────┐    Python Subprocess    ┌──────────────────────┐
│                     │ ◄─────────────────► │                     │ ◄─────────────────────► │                      │
│   React Frontend    │                     │  Node.js Backend    │                         │  Python Scanner      │
│                     │                     │                     │                         │                      │
│ • Modern UI/UX      │                     │ • Express Server    │                         │ • Playwright Browser │
│ • Real-time Updates │                     │ • RESTful API       │                         │ • Deep Web Analysis  │
│ • Interactive Forms │                     │ • Scan Management   │                         │ • Cookie Detection   │
│ • CSV Downloads     │                     │ • Error Handling    │                         │ • Screenshot Capture │
│ • Progress Tracking │                     │ • Proxy Support     │                         │ • CSV Generation     │
└─────────────────────┘                     └─────────────────────┘                         └──────────────────────┘
           │                                           │                                                │
           │                                           │                                                │
           ▼                                           ▼                                                ▼
┌─────────────────────┐                     ┌─────────────────────┐                         ┌──────────────────────┐
│   Client Browser    │                     │   Server Storage    │                         │   Detection Engine   │
│                     │                     │                     │                         │                      │
│ • Responsive Design │                     │ • In-Memory Cache   │                         │ • Suspicious Keywords│
│ • Dark/Light Theme  │                     │ • Scan Results      │                         │ • Network Monitoring │
│ • Toast Notifications│                    │ • File Management   │                         │ • DOM Analysis       │
│ • Smooth Animations │                     │ • Session Handling  │                         │ • Traffic Inspection │
└─────────────────────┘                     └─────────────────────┘                         └──────────────────────┘
```

### 🔄 Data Flow

1. **Input Phase**: User submits URLs via web interface (manual entry or file upload)
2. **Processing Phase**: Backend validates URLs and spawns Python scanner process
3. **Scanning Phase**: Python script uses Playwright to analyze each URL for threats
4. **Detection Phase**: Advanced algorithms identify suspicious patterns and behaviors
5. **Reporting Phase**: Results are formatted and CSV reports are generated
6. **Display Phase**: Frontend displays interactive results with threat classifications

---

## 🚀 Tech Stack

### **Frontend Stack**
- **⚛️ React 18.2.0** - Modern UI library with hooks and concurrent features
- **⚡ Vite 4.4.5** - Lightning-fast build tool and dev server
- **🎨 TailwindCSS 3.3.3** - Utility-first CSS framework for rapid styling
- **🧩 Radix UI** - Accessible, unstyled UI components
- **✨ Framer Motion 10.16.4** - Production-ready motion library for animations
- **🎯 Lucide React** - Beautiful & consistent icon library
- **📱 Responsive Design** - Mobile-first approach with breakpoints

### **Backend Stack**
- **🟢 Node.js 20.x** - JavaScript runtime for server-side development
- **🚀 Express.js 4.18.2** - Fast, minimalist web framework
- **🔄 CORS Support** - Cross-origin resource sharing configuration
- **📁 File Management** - CSV generation and download handling
- **🔍 UUID Generation** - Unique scan ID management
- **⚙️ Process Management** - Python subprocess orchestration

### **Security & Scanning Engine**
- **🐍 Python 3.x** - Core scanning logic and detection algorithms
- **🎭 Playwright** - Browser automation for deep web analysis
- **📊 CSV Processing** - Structured data export and reporting
- **🔍 Pattern Matching** - Advanced keyword and behavior detection
- **📸 Screenshot Capture** - Visual evidence collection
- **🕷️ Web Crawling** - Comprehensive site analysis

### **Development & Deployment**
- **📦 npm/Node Package Manager** - Dependency management
- **🔄 Hot Module Replacement** - Instant development feedback
- **🛠️ ES Modules** - Modern JavaScript module system
- **🔧 Development Proxy** - Seamless frontend-backend integration
- **📋 Error Handling** - Comprehensive error boundaries and logging

---

## 🎯 Key Features

### 🔍 **Advanced Threat Detection**
- **Cookie Stuffing Detection**: Identifies unauthorized affiliate cookies
- **Hidden Element Analysis**: Discovers invisible tracking pixels and iframes
- **Network Traffic Monitoring**: Analyzes suspicious HTTP requests
- **JavaScript Injection Detection**: Finds malicious script insertions
- **Redirect Chain Analysis**: Tracks suspicious redirect patterns

### 🎨 **Modern User Experience**
- **Intuitive Interface**: Clean, professional cybersecurity-themed design
- **Real-time Scanning**: Live progress updates and status tracking
- **Interactive Results**: Detailed threat analysis with visual indicators
- **Responsive Design**: Seamless experience across all devices
- **Dark/Light Themes**: User preference customization

### 📊 **Comprehensive Reporting**
- **Risk Classification**: High, Medium, Low, and Clean threat levels
- **CSV Export**: Detailed reports in industry-standard format
- **Visual Summaries**: At-a-glance threat statistics and charts
- **Screenshot Evidence**: Visual proof of detected threats
- **Historical Tracking**: Scan history and trend analysis

### ⚡ **Performance & Reliability**
- **Concurrent Scanning**: Parallel processing for faster results
- **Error Recovery**: Graceful fallbacks and error handling
- **Memory Efficient**: Optimized resource usage and cleanup
- **Scalable Architecture**: Handles large URL datasets
- **Cross-platform Support**: Works on Windows, macOS, and Linux

---

## 📁 Project Structure

```
attribution-guard/
├── 📁 src/                          # Frontend source code
│   ├── 📁 components/               # React components
│   │   ├── 📁 ui/                   # Reusable UI components
│   │   │   ├── badge.jsx            # Status badges
│   │   │   ├── button.jsx           # Interactive buttons
│   │   │   ├── card.jsx             # Content containers
│   │   │   ├── input.jsx            # Form inputs
│   │   │   ├── switch.jsx           # Toggle switches
│   │   │   ├── textarea.jsx         # Text areas
│   │   │   ├── toast.jsx            # Notification toasts
│   │   │   └── toaster.jsx          # Toast provider
│   │   ├── WelcomePage.jsx          # Landing page
│   │   ├── UploadPage.jsx           # URL input interface
│   │   ├── ResultsPage.jsx          # Scan results display
│   │   └── ThemeToggle.jsx          # Dark/light theme switcher
│   ├── 📁 lib/                      # Utility libraries
│   │   ├── api.js                   # Backend API client
│   │   └── utils.js                 # Helper functions
│   ├── App.jsx                      # Main application component
│   ├── main.jsx                     # Application entry point
│   └── index.css                    # Global styles
├── 📁 server/                       # Backend source code
│   ├── server.js                    # Express server
│   ├── scanner_adapter.py           # Python integration layer
│   └── package.json                 # Backend dependencies
├── 📁 public/                       # Static assets
├── cookie_stuffing_scanner.py       # Core Python scanner
├── package.json                     # Frontend dependencies
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # TailwindCSS configuration
├── postcss.config.js                # PostCSS configuration
└── README.md                        # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 20.x or higher**
- **Python 3.8 or higher**
- **npm or yarn package manager**

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/attribution-guard.git
cd attribution-guard
```

### 2️⃣ Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Install Python dependencies
pip install playwright asyncio
playwright install
```

### 3️⃣ Start Development Environment
```bash
# Option 1: Manual startup (recommended for development)
# Terminal 1: Start backend
cd server && npm start

# Terminal 2: Start frontend
npm run dev

# Option 2: Automated startup
chmod +x start-dev.sh
./start-dev.sh
```

### 4️⃣ Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

---

## 🔍 Usage Guide

### **Step 1: Submit URLs for Scanning**
1. Navigate to the Upload page
2. Enter URLs manually (one per line) or upload a .txt file
3. Click "Start Scan" to begin analysis

### **Step 2: Monitor Scan Progress**
- Real-time updates show scanning progress
- Live status indicators for each URL
- Estimated completion time display

### **Step 3: Review Results**
- **Risk Summary**: High-level threat statistics
- **Detailed Analysis**: Individual URL results with threat details
- **Filter Options**: View all results, suspicious only, or clean URLs
- **Interactive Elements**: Click to view screenshots or visit URLs

### **Step 4: Export Reports**
- Download comprehensive CSV reports
- Industry-standard format compatible with security tools
- Includes all detection details and metadata

---

## 🛡️ Security Features

### **Detection Capabilities**
- ✅ **Cookie Stuffing**: Unauthorized affiliate cookie placement
- ✅ **Hidden Tracking**: Invisible pixels, iframes, and tracking elements
- ✅ **Malicious Redirects**: Suspicious redirect chains and URL manipulation
- ✅ **Script Injection**: Malicious JavaScript code insertion
- ✅ **Network Anomalies**: Unusual HTTP requests and traffic patterns
- ✅ **Affiliate Fraud**: Commission theft and attribution manipulation

### **Advanced Analysis**
- **Deep DOM Inspection**: Comprehensive HTML/CSS/JS analysis
- **Network Traffic Monitoring**: Real-time request/response analysis
- **Behavioral Detection**: Pattern recognition for fraudulent activities
- **Screenshot Evidence**: Visual proof of detected threats
- **Metadata Extraction**: Detailed technical information gathering

---

## 📊 API Documentation

### **POST /api/scan**
Start a new security scan
```json
{
  "urls": ["https://example.com", "https://test.com"]
}
```

### **GET /api/scan/:scanId**
Get scan status and results
```json
{
  "success": true,
  "status": "completed",
  "results": [...],
  "totalThreats": 5
}
```

### **GET /api/scan/:scanId/csv**
Download CSV report
- Returns downloadable CSV file
- Standard format compatible with security tools

---

## 🔧 Configuration

### **Environment Variables**
```bash
# Backend Configuration
PORT=3001                    # API server port
NODE_ENV=development         # Environment mode

# Python Scanner Configuration
PYTHON_PATH=python3          # Python executable path
SCANNER_TIMEOUT=30000        # Scan timeout in milliseconds
SCREENSHOT_DIR=screenshots   # Screenshot storage directory
```

### **Vite Proxy Configuration**
```javascript
// vite.config.js
server: {
  proxy: {
    '/api': 'http://localhost:3001',
    '/health': 'http://localhost:3001'
  }
}
```

---

## 🧪 Testing

### **Manual Testing**
1. Submit test URLs with known affiliate links
2. Verify threat detection accuracy
3. Check CSV report generation
4. Test error handling scenarios

### **Test URLs**
```
https://example.com/affiliate?ref=test
https://tracking-site.com/pixel.gif
https://redirect-chain.com/link
```

---

## 🚀 Deployment

### **Production Build**
```bash
# Build frontend
npm run build

# Start production server
npm run preview
```

### **Docker Deployment**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Guidelines**
- Follow existing code style and conventions
- Add comprehensive comments for complex logic
- Test all changes thoroughly
- Update documentation as needed

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

### **Getting Help**
- 📖 **Documentation**: Check this README and inline code comments
- 🐛 **Bug Reports**: Open an issue on GitHub
- 💡 **Feature Requests**: Submit enhancement proposals
- 💬 **Discussions**: Join our community discussions

### **Common Issues**
- **Python Dependencies**: Ensure Playwright is properly installed
- **Port Conflicts**: Check that ports 3001 and 5173 are available
- **CORS Errors**: Verify proxy configuration in vite.config.js
- **CSV Downloads**: Ensure backend has write permissions

---

## 🔮 Roadmap

### **Upcoming Features**
- 🔍 **Enhanced Detection**: Advanced ML-based threat recognition
- 📱 **Mobile App**: Native mobile application
- 🌐 **Multi-language**: Internationalization support
- 📧 **Email Alerts**: Automatic threat notifications
- 📈 **Analytics Dashboard**: Historical trend analysis
- 🔗 **API Integrations**: Third-party security tool connections

---

**Built with ❤️ for cybersecurity professionals and affiliate marketers**

*Last updated: $(date)*
