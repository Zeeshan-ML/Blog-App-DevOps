@echo off
REM Blog App Deployment Script for Windows
REM This script automates the deployment process

echo ========================================
echo Blog App Deployment Script (Windows)
echo ========================================
echo.

REM Check if Docker is installed
echo Checking Docker installation...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)
echo [SUCCESS] Docker is installed

REM Check if Docker Compose is installed
echo Checking Docker Compose installation...
docker compose version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed.
    pause
    exit /b 1
)
echo [SUCCESS] Docker Compose is installed

REM Get Docker Hub username
echo.
set /p DOCKER_USERNAME="Enter your Docker Hub username: "
if "%DOCKER_USERNAME%"=="" (
    echo [ERROR] Docker Hub username is required
    pause
    exit /b 1
)

REM Get EC2 Public IP (optional)
echo.
set /p EC2_IP="Enter your EC2 Public IP (press Enter to skip for local deployment): "

REM Create necessary directories
echo.
echo Creating required directories...
if not exist "data" mkdir data
if not exist "backups" mkdir backups
echo [SUCCESS] Directories created

REM Build Docker image
echo.
echo Building Docker image...
docker build -t %DOCKER_USERNAME%/blog-app:latest .
if errorlevel 1 (
    echo [ERROR] Failed to build Docker image
    pause
    exit /b 1
)
echo [SUCCESS] Docker image built successfully

REM Ask if user wants to push to Docker Hub
echo.
set /p PUSH_IMAGE="Do you want to push the image to Docker Hub? (y/n): "
if /i "%PUSH_IMAGE%"=="y" (
    echo Logging in to Docker Hub...
    docker login
    
    echo Pushing image to Docker Hub...
    docker push %DOCKER_USERNAME%/blog-app:latest
    if errorlevel 1 (
        echo [ERROR] Failed to push image
        pause
        exit /b 1
    )
    echo [SUCCESS] Image pushed to Docker Hub
)

REM Start containers
echo.
set /p START_APP="Do you want to start the application now? (y/n): "
if /i "%START_APP%"=="y" (
    echo Starting containers...
    docker compose up -d
    if errorlevel 1 (
        echo [ERROR] Failed to start containers
        pause
        exit /b 1
    )
    echo [SUCCESS] Containers started successfully
    
    echo.
    echo ========================================
    echo Deployment Complete!
    echo ========================================
    echo.
    if "%EC2_IP%"=="" (
        echo Access your application at: http://localhost:3000
    ) else (
        echo Access your application at: http://%EC2_IP%:3000
    )
    echo.
    echo Useful commands:
    echo   View logs:    docker compose logs -f
    echo   Stop app:     docker compose down
    echo   Restart app:  docker compose restart
    echo.
)

echo [SUCCESS] Script completed successfully!
pause
