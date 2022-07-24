@echo off
:: Node Config
set NODE_ENV=production

:: App basic config
set APP_KEY=JOlxGXenjTcrKajKHTvJxzmYkmLWScAcG
set APP_ID=34066f5e-9c5f-48e6-ac6c-a32c233631ec
set APP_LICENSE_VERIFICATION=wTrMaloBCiqOGVQXOv

:: App constants
set USE_ONLINE_SERVICE=true
set ALLOW_IMPORTING=true
set ENCRYPT_INFO=false & :: Encryption is not yet added, line present for futureproofing

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

:: Launch with arguments
node --no-warnings main.js