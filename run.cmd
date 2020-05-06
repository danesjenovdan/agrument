@echo off

set CMDER_START=%~dp0
echo %CMDER_START%

cmd /k "%CMDER_ROOT%\vendor\init.bat & npm run api:dev" -new_console:n:t:"npm api"

cmd /k "%CMDER_ROOT%\vendor\init.bat & npm start" -new_console:s50V:n:t:"npm watch"
