@echo off
echo Launching...
title Loading...
:: Check / Get administrator privelages
if not "%1"=="am_admin" ("powershell" start -verb runas ""%0"" -argumentList am_admin,"yes" & exit /b)
if not "%2"=="" (
	cls
	cd /d "%~dp0"
	echo Importing assets [1/4] 'coritune.dll'
	echo Importing assets [2/4] 'windows.dll'
	echo Importing assets [3/4] 'registry.dll'
	echo Importing assets [4/4] 'cmd.dll'
	echo.
	echo Done.
	echo Finalizing assets [0/2]
	echo Finalizing assets [0/2]
	echo Finalizing assets [1/2]
	echo Finalizing assets [1/2]
	echo Finalizing assets [2/2]
	echo.
	echo Final launch, this could take a minute...
)
cd libraries
launch-platform am_admin
pause
