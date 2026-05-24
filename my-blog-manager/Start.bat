@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo 正在启动博客控制器...
echo 当前目录：%cd%
echo.

py -3.11 run_me.py

echo.
echo 程序已退出。如果上面有报错，请截图或复制给我。
pause