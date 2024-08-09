@echo off&cls
:: Created by: raingart

:: AFTER build in vscode
:: 1. clear comments. regex - "//\s.*|/\*[\s\S\n]*?\*/"
:: 2. For clear spaces use "Format Document".
:: 3. replace "\n^\n+" to"\n"

set outFile="%temp%\nova-tube.user.js"
del /q %outFile%

:: alt
:: copy *.js %outFile%
(

type .\Userscript\meta.js
type .\Userscript\compatibility.js
:: add plugins container
type .\Userscript\plugin-container.js

::for /f "delims=" %%a in ('dir /s/b/a-d *.js') do (echo %%~na | find "-" && echo %%~na [Excluded] || echo %%~na [OK])
for /f "delims=" %%i in ('dir /b /s .\plugins\*.js ^| findstr /i /v "\\-"') do type "%%i

type .\js\plugins.js
type .\Userscript\user.js

)>%outFile%

start notepad %outFile%

pause
exit
