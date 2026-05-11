@echo off
chcp 65001 >nul
title 项目导出工具

:: 启用 ANSI 转义序列（Windows 10+）
for /f %%a in ('echo prompt $E ^| cmd') do set "ESC=%%a"

:: 颜色定义
set "GREEN=%ESC%[92m"
set "RED=%ESC%[91m"
set "YELLOW=%ESC%[93m"
set "CYAN=%ESC%[96m"
set "WHITE=%ESC%[97m"
set "GRAY=%ESC%[90m"
set "BOLD=%ESC%[1m"
set "RESET=%ESC%[0m"
set "BG_GREEN=%ESC%[42m"
set "BG_RED=%ESC%[41m"
set "BG_YELLOW=%ESC%[43m"

:: 分隔线
set "LINE=%CYAN%============================================%RESET%"

echo %LINE%
echo %CYAN%%BOLD%         项目结构与代码导出工具%RESET%
echo %LINE%
echo.

:: 获取当前批处理文件所在目录
cd /d "%~dp0"

echo %WHITE%[信息]%RESET% 当前目录: %CYAN%%cd%%RESET%
echo.

:: ========== 检查 Node.js ==========
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo %BG_RED%%WHITE%%BOLD% ❌ 错误 %RESET% %RED%未检测到 Node.js，请先安装！%RESET%
    echo.
    echo %YELLOW%   下载地址: https://nodejs.org/%RESET%
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do (
    echo %GREEN%[✓]%RESET% Node.js 版本: %GREEN%%%v%RESET%
)
echo.

:: ========== 检查脚本文件 ==========
if not exist "export-project.js" (
    echo.
    echo %BG_RED%%WHITE%%BOLD% ❌ 错误 %RESET% %RED%未找到 export-project.js 文件！%RESET%
    echo.
    echo %YELLOW%   请确保 run-export.bat 和 export-project.js 在同一目录下%RESET%
    echo.
    pause
    exit /b 1
)

echo %GREEN%[✓]%RESET% 已找到 export-project.js
echo.

:: ========== 执行脚本 ==========
echo %LINE%
echo %YELLOW%%BOLD%  ⏳ 正在执行导出脚本，请稍候...%RESET%
echo %LINE%
echo.

node export-project.js

echo.

:: ========== 判断结果 ==========
if %errorlevel% equ 0 (
    echo %LINE%
    echo.
    echo   %BG_GREEN%%WHITE%%BOLD%                              %RESET%
    echo   %BG_GREEN%%WHITE%%BOLD%     ✅  导出成功！            %RESET%
    echo   %BG_GREEN%%WHITE%%BOLD%                              %RESET%
    echo.
    echo %LINE%
    echo.
    echo   %GREEN%📄 文件: %WHITE%project-export.md%RESET%
    echo   %GREEN%📁 位置: %WHITE%%cd%\project-export.md%RESET%
    echo.

    :: 获取文件大小
    for %%F in (project-export.md) do (
        set /a "SIZE_KB=%%~zF / 1024"
    )
    echo   %GREEN%📊 大小: %WHITE%%SIZE_KB% KB%RESET%
    echo.
) else (
    echo %LINE%
    echo.
    echo   %BG_RED%%WHITE%%BOLD%                              %RESET%
    echo   %BG_RED%%WHITE%%BOLD%     ❌  导出失败！            %RESET%
    echo   %BG_RED%%WHITE%%BOLD%                              %RESET%
    echo.
    echo %LINE%
    echo.
    echo   %RED%错误码: %errorlevel%%RESET%
    echo   %YELLOW%请检查 export-project.js 脚本是否有语法错误%RESET%
    echo   %YELLOW%或项目目录是否存在%RESET%
    echo.
)

:: ========== 用户选择 ==========
echo %GRAY%─────────────────────────────────────────────%RESET%
echo.
echo   %WHITE%[1]%RESET% 用 VS Code 打开文件
echo   %WHITE%[2]%RESET% 用默认程序打开文件
echo   %WHITE%[3]%RESET% 打开文件所在目录
echo   %WHITE%[0]%RESET% 退出
echo.
set /p "choice=%CYAN%请选择操作 (0-3): %RESET%"

if "%choice%"=="1" (
    echo.
    echo %GREEN%正在用 VS Code 打开...%RESET%
    code project-export.md 2>nul || (
        echo %RED%未找到 VS Code，请检查是否已安装并加入 PATH%RESET%
    )
)
if "%choice%"=="2" (
    echo.
    echo %GREEN%正在用默认程序打开...%RESET%
    start "" "project-export.md"
)
if "%choice%"=="3" (
    echo.
    echo %GREEN%正在打开目录...%RESET%
    explorer .
)

echo.
echo %GRAY%感谢使用，再见！%RESET%
echo.
pause
