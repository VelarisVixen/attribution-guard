# 🛡️ Attribution Guard - Local Setup

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 2. Start Both Servers

**Option A: Manual (Recommended for development)**
```bash
# Terminal 1: Start backend
cd server
npm start

# Terminal 2: Start frontend
npm run dev
```

**Option B: Automated script**
```bash
chmod +x run-local.sh
./run-local.sh
```

### 3. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## ✅ Verify It's Working

1. **Frontend**: Should show the Attribution Guard interface
2. **Backend**: Visit http://localhost:3001/health - should return `{"status":"ok"}`
3. **Proxy**: The frontend can access backend APIs through Vite proxy

## 🐛 Troubleshooting

### "HTTP error! status: 404"
- **Problem**: Backend server not running
- **Solution**: Start backend with `cd server && npm start`

### Port Already in Use
```bash
# Find and kill process using port 3001
lsof -ti:3001 | xargs kill -9

# Find and kill process using port 5173  
lsof -ti:5173 | xargs kill -9
```

### CORS Errors
- The Vite proxy should handle CORS automatically
- Check `vite.config.js` proxy configuration

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules server/node_modules
npm install
cd server && npm install
```

## 🔍 Testing the Scanner

1. Enter test URLs in the interface:
   ```
   https://example.com/affiliate?ref=test
   https://tracking-site.com/pixel
   https://normal-site.com
   ```

2. Click "Start Scan"

3. Should see results with threat detection

## 📊 Expected Behavior

- **Clean URLs**: Show as "Clean" with green indicators
- **Suspicious URLs**: Show threats with risk levels
- **CSV Download**: Always works regardless of scanner type
- **Real-time Updates**: Progress shown during scanning

## 🔧 Development Mode

The app automatically detects available scanners:
- ⚡ **JavaScript Fallback**: Always available (no dependencies)
- 🐍 **Python Scanner**: If Python is available  
- 🎭 **Playwright Scanner**: If Playwright is installed

For real-time scanning with full features:
```bash
pip3 install playwright
playwright install
```

## 🆘 Still Having Issues?

1. Check both servers are running:
   ```bash
   curl http://localhost:3001/health
   curl http://localhost:5173
   ```

2. Check browser console for errors

3. Check server logs in terminal

4. Restart both servers:
   ```bash
   # Kill all processes
   pkill -f "npm"
   pkill -f "node"
   
   # Restart
   cd server && npm start &
   npm run dev
   ```
