@echo off

if not "%1"=="am_admin" (
	echo Menuify requires administrator privelages to run
	pause >nul
	exit /b
)

:: Node Config
set NODE_ENV=production
set NODE_PATH=%cd%\runtime\node.exe

:: App basic config
set APP_KEY=JOlxGXenjTcrKajKHTvJxzmYkmLWScAcG
set APP_ID=34066f5e-9c5f-48e6-ac6c-a32c233631ec
set APP_LICENSE_VERIFICATION=wTrMaloBCiqOGVQXOv

:: App constants
set USE_ONLINE_SERVICE=true
set ALLOW_IMPORTING=true
set ENCRYPT_INFO=false & :: Encryption is not yet added, line present for futureproofing
set SCRIPT_LANG=powershell

:: Launch control
set GPU=false
set CPU=false
set MAX_MEMORY=
set MAX_STORAGE=
set REG_EDIT_ACCESS_TYPE=1

:: Misbehaviour
set REG_FIX=false
set BUF_FIX=false
set MEM_FIX=false
set INPUT_FIX=false
set OUTPUT_FIX=false

:: Resize windows
mode con: cols=150 lines=45

:: Launch with arguments

:run
"%NODE_PATH%" --no-warnings main.js
echo Press any key to relaunch: 
pause >nul
cls
echo Reloading...
goto run