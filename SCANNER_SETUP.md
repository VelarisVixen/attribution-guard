# 🛡️ Real-Time Scanner Setup

To enable **real-time cookie stuffing detection** with Playwright browser automation:

## 🚀 Quick Setup

### 1. Install Python Dependencies
```bash
# Install Playwright
pip3 install playwright

# Install browser binaries (Chrome, Firefox, Safari)
playwright install
```

### 2. Alternative: Use Installation Script
```bash
chmod +x install-scanner-deps.sh
./install-scanner-deps.sh
```

### 3. Restart Development Server
```bash
# Stop current server (Ctrl+C)
# Then restart
cd server && npm start
```

## ✅ Verification

You should see this message when the server starts:
```
✅ Real scanner loaded successfully
```

If you see this instead:
```
⚠️ Real scanner not available: No module named 'playwright'
```

Run the installation commands above.

## 🔍 Real-Time Features

With the real scanner enabled, you get:

- **🎭 Playwright Browser Automation**: Real browser instances for deep analysis
- **🍪 Cookie Stuffing Detection**: Actual cookie analysis and tracking
- **📸 Screenshot Capture**: Visual evidence of threats
- **🕵️ Hidden Element Detection**: Find invisible tracking pixels
- **🔗 Network Monitoring**: Real HTTP request/response analysis
- **⚡ Concurrent Processing**: Multiple URLs scanned in parallel

## 🐛 Troubleshooting

### Missing Browsers
```bash
playwright install  # Downloads Chrome, Firefox, Safari
```

### Permission Issues
```bash
sudo pip3 install playwright
playwright install
```

### WSL/Linux Issues
```bash
# Install additional dependencies
sudo apt-get update
sudo apt-get install -y libglib2.0-0 libnss3 libnspr4 libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libgtk-3-0 libgbm1
```

## 🎯 Mock vs Real Scanner

| Feature | Mock Scanner | Real Scanner |
|---------|-------------|--------------|
| Speed | ⚡ Fast | 🐌 Realistic (2-5s per URL) |
| Detection | 🎲 Random | 🎯 Accurate |
| Browser | ❌ None | ✅ Playwright |
| Screenshots | ❌ No | ✅ Yes |
| Network Analysis | ❌ No | ✅ Yes |
| Production Ready | ❌ No | ✅ Yes |

The app will automatically use the real scanner when available, falling back to mock if dependencies are missing.
