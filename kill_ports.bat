@echo off
echo Killing all ports...
taskkill /f /im node.exe
taskkill /f /im python.exe
netstat -ano | findstr :3000 > nul && (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /f /pid %%a
)
netstat -ano | findstr :5001 > nul && (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001') do taskkill /f /pid %%a
)
echo Ports killed!
pause