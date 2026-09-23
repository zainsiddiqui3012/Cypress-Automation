@echo off
REM Dynamic Report Zipping Script
REM Usage: This script dynamically updates paths based on Jenkins environment variables.

REM Set the source path dynamically using Jenkins environment variables
SET "source_path=%WORKSPACE%\cypress\reports"

REM Use quotes to preserve spaces in path
SET "destination_path=%WORKSPACE% Email Job\mochawesome-report.zip"

REM Print the paths for debugging
echo Source Path: "%source_path%"
echo Destination Path: "%destination_path%"

REM Compress the reports folder into a zip file
powershell -Command "Compress-Archive -Path '%source_path%' -DestinationPath '%destination_path%' -Update"
IF %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to compress the folder.
    exit /b 1
)

echo Report successfully zipped from "%source_path%" to "%destination_path%".
exit /b 0