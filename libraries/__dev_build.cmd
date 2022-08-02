@echo off
echo Starting build...
set bd=%date:~4%
set bd=%bd:/=-%

set filename=menuify-installer-build-%bd%.exe
set thisScript=%~nx0%

set zip_files=libraries/node_modules libraries/runtime libraries/src libraries/launch-platform.cmd libraries/main.js libraries/package.json README.txt menuify.cmd
echo Compiling '%filename%'...

cd ..
7z a -t7z -mx9 -mmt -sfx %filename% %zip_files%>nul

echo Preparing build folder...
rmdir /S /Q _build
if not exist "_build" (
	mkdir _build
)
echo Exporting contents...
move %filename% _build/%filename% >nul
echo Build complete.