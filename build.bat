@echo off
setlocal
set DIR=%~dp0
set MODE=debug
set TASK=assembleDebug
if /I "%1"=="release" (
  set MODE=release
  set TASK=assembleRelease
)
pushd "%DIR%"
if /I "%MODE%"=="release" (
  if not exist "%DIR%keystore.properties" (
    echo ERROR: keystore.properties not found. Release build requires fixed signing to avoid update conflicts.
    echo See README.md for release signing instructions.
    popd
    exit /b 1
  )
)
call "%DIR%gradlew.bat" --no-daemon %TASK%
popd
if errorlevel 1 exit /b 1

set APK_SRC=
set APK_DST=
if /I "%MODE%"=="release" (
  set APK_SRC=%DIR%app\build\outputs\apk\release\app-release.apk
  set APK_DST=%DIR%app\build\outputs\apk\release\nodeseek.apk
) else (
  set APK_SRC=%DIR%app\build\outputs\apk\debug\app-debug.apk
  set APK_DST=%DIR%app\build\outputs\apk\debug\nodeseek.apk
)

if exist "%APK_SRC%" (
  copy /y "%APK_SRC%" "%APK_DST%" >nul
  echo Build complete: %APK_DST%
) else (
  echo Build complete. Output in app\build\outputs\apk\
)
endlocal
