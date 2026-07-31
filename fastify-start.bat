@echo off
node server &&(
    echo start.bat complete. Press any key to continue...
    pause > nul
)||(
    echo start.bat failed. Press any key to continue...
    pause > nul
)