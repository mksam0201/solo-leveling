@echo off
:: One-time setup: allow LAN (phone) access to port 3777
:: Self-elevates via UAC prompt
net session >nul 2>&1
if %errorlevel% neq 0 (
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)
netsh http add urlacl url=http://+:3777/ sddl=D:(A;;GX;;;WD)
netsh advfirewall firewall add rule name="SoloLeveling-3777" dir=in action=allow protocol=TCP localport=3777
echo.
echo [SYSTEM] 設定完成！之後雙擊「啟動.bat」，手機即可透過電腦 IP 連線。
pause
