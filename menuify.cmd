@echo off
echo Launching...
title Loading...
:: Check / Get administrator privelages
if not "%1"=="am_admin" ("powershell" start -verb runas ""%0"" -argumentList am_admin,"yes" & exit /b)
if not "%2"=="" (
	cls
	cd /d "%~dp0"
	echo If this is your first launch, this could take a minute...
)
cd libraries
launch-platform am_admin
pause
