@echo off
REM Dynamic File Copy Script for reports.zip
REM Automatically constructs source and destination paths based on Jenkins %WORKSPACE%

REM Define the base job folder using WORKSPACE
SET "job_folder=%WORKSPACE% Email Job"

REM Define the source and destination paths
SET "source_path=%job_folder%\mochawesome-report.zip""
SET "destination_path=%job_folder%"

REM Print paths for debugging
echo Source Path: "%source_path%"
echo Destination Path: "%destination_path%"

REM Copy the file
xcopy /S "%source_path%" "%destination_path%"

echo File successfully copied to "%destination_path%"
exit /b 0
