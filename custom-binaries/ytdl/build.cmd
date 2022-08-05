@echo off
call rollup -c rollup.config.js ytdl-audio.js
call rollup -c rollup.config.js ytdl-video.js
call node build.cjs
set ogpath=%cd%
cd ..
cd ..
cd libraries
cd publishing
call node sign.cjs "%ogpath%\release\ytdl.unsigned"
cd %ogpath%\release
move ytdl.signed.menu ytdl.menu