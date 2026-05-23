@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo [调试] 脚本所在目录：%~dp0
echo [调试] 开始检测 Python 环境...

py -3.11 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [状态] 正在调用 Python 3.11 环境...
    py -3.11 run_me.py
    if %errorlevel% neq 0 goto run_failed
    goto end
)

py -3.10 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [状态] 未找到 Python 3.11，正在调用 Python 3.10 环境...
    py -3.10 run_me.py
    if %errorlevel% neq 0 goto run_failed
    goto end
)

py -3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [状态] 未找到指定小版本，正在调用 py -3...
    py -3 run_me.py
    if %errorlevel% neq 0 goto run_failed
    goto end
)

python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [状态] 正在调用默认 Python 环境...
    python run_me.py
    if %errorlevel% neq 0 goto run_failed
    goto end
)

echo ❌ 错误：未找到可用 Python 环境。
echo 🔍 你可以手动测试：
echo    py -3.11 run_me.py
echo.
echo 如果手动可用但双击不可用，请重启电脑或重新打开 Codex/终端刷新 PATH。
pause
exit /b 1

:run_failed
echo ❌ 错误：run_me.py 执行失败，请查看上方报错。
pause
exit /b 1

:end
echo ✅ 程序执行完成
exit /b 0
