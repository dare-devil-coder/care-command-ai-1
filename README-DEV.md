# CareCommand AI Development Setup

## Quick Start

### Method 1: Use the Batch File (Recommended)
Double-click on `start-dev.bat` in the Sample folder to start the development server.

### Method 2: Manual Command
Open Command Prompt and run:
```bash
cd "c:\Users\LENOVO\Desktop\Sample\Frontend"
npm run dev
```

## Important Notes

- **Always run commands from the `Frontend` folder**, not the `Sample` folder
- The `package.json` with the "dev" script is located in: `Sample\Frontend\package.json`
- Development server will start on http://localhost:3000 (or 3001 if 3000 is busy)

## Directory Structure
```
Sample/
├── start-dev.bat          # <-- Use this to start dev server
├── Frontend/             # <-- All commands must be run from here
│   ├── package.json       # <-- Contains the "dev" script
│   └── ...
└── ...
```

## Troubleshooting

If you get "Missing script: dev" error:
1. Make sure you're in the `Frontend` directory
2. Or simply double-click `start-dev.bat`

## Port Issues
If port 3000 is busy, the server will automatically use port 3001.
