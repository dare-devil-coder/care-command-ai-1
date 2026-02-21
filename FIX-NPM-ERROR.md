# ⚠️ IMPORTANT: How to Fix "Missing script: dev" Error

## ❌ The Problem
You're running `npm run dev` from the WRONG directory:
```
❌ WRONG: c:\Users\LENOVO\Desktop\Sample
✅ RIGHT: c:\Users\LENOVO\Desktop\Sample\Frontend
```

## ✅ Solutions (Choose One)

### Method 1: Use the PowerShell Script (Easiest)
```powershell
cd "c:\Users\LENOVO\Desktop\Sample"
.\start-dev.ps1
```

### Method 2: Use the Batch File
```cmd
cd "c:\Users\LENOVO\Desktop\Sample"
start-dev.bat
```

### Method 3: Manual Command
```powershell
cd "c:\Users\LENOVO\Desktop\Sample\Frontend"
npm run dev
```

## 🚫 NEVER Run This
```powershell
cd "c:\Users\LENOVO\Desktop\Sample"
npm run dev  # ❌ THIS WILL FAIL
```

## 📁 Directory Structure
```
Sample/
├── start-dev.ps1          # ✅ Use this
├── start-dev.bat          # ✅ Or this
├── Frontend/             # ✅ Commands must be run from here
│   ├── package.json       # ✅ Contains "dev" script
│   └── ...
└── ...
```

## 🎯 Quick Fix
1. Close your current terminal
2. Open new terminal
3. Run: `cd "c:\Users\LENOVO\Desktop\Sample\Frontend"`
4. Run: `npm run dev`

## ✅ Current Status
Development server is running on: http://localhost:3000

The Hospital Workload Heatmap is now ready to test in the Admin dashboard!
