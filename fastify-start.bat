@echo off
npm run server &&(
    echo start.bat complete. Press any key to continue...
    pause
)||(
    echo start.bat failed. Press any key to continue...
    pause > nul
)