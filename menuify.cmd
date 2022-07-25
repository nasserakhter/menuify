@echo off
echo Launching...
title Loading...
:: Check / Get administrator privelages
if not "%1"=="am_admin" ("C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" start -verb runas '%0' -argumentList am_admin,"%cd%" & exit /b)
if not "%2"=="" (
	set newdir = %2%
	cd /d %2%
)
cd libraries
launch-platform am_admin
pause