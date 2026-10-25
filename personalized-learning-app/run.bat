@echo off
setlocal
title SmartLearn AI - Personalized Learning Engine

echo =================================================================
echo        SMARTLEARN AI - PERSONALIZED LEARNING APPLICATION
echo =================================================================
echo.

where javac >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Java SDK (javac) not found in PATH.
    echo Please install Java or add JDK bin directory to your PATH.
    pause
    exit /b 1
)

if not exist "bin" mkdir "bin"

echo [1/2] Compiling Java Cognitive Engine...
javac -encoding UTF-8 -d bin src/com/hitam/pbl/learningengine/dto/*.java src/com/hitam/pbl/learningengine/service/*.java src/com/hitam/pbl/learningengine/StandaloneServer.java

if %errorlevel% neq 0 (
    echo [ERROR] Compilation failed!
    pause
    exit /b 1
)

echo [2/2] Starting server at http://localhost:8080...
echo.
java -cp bin com.hitam.pbl.learningengine.StandaloneServer 8080

pause

