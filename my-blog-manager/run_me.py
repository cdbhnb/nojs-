import os
import sys
import subprocess
import importlib.util
import shutil


def find_executable(names, extra_paths=None):
    extra_paths = extra_paths or []
    for name in names:
        found = shutil.which(name)
        if found:
            return found
    for path in extra_paths:
        if os.path.exists(path):
            return path
    return None

# 1. 后端 Python 依赖清单
PYTHON_PACKAGES = {
    "webview": "pywebview",
    "fastapi": "fastapi",
    "uvicorn": "uvicorn",
    "multipart": "python-multipart",
    "requests": "requests",
    "yaml": "PyYAML",
    "markdown": "markdown",
    "markdownify": "markdownify",
    "httpx": "httpx",
}


def check_node_environment():
    """检查前端环境：是否存在 node_modules，不存在则自动安装"""
    print("🔍 正在检查前端依赖 (Node.js)...")

    npm_exe = find_executable(
        ["npm.cmd", "npm"],
        [
            r"C:\Program Files\nodejs\npm.cmd",
            r"C:\Program Files (x86)\nodejs\npm.cmd",
        ],
    )

    if not npm_exe:
        print("❌ 未找到 npm。请确认 Node.js 已安装，或将 C:\\Program Files\\nodejs 加入 PATH。")
        return False

    # 检查当前目录下是否有 node_modules 文件夹
    if not os.path.exists("node_modules"):
        print("📦 发现缺失前端依赖，正在尝试运行 npm install (请稍候，这可能需要几分钟)...")
        try:
            subprocess.check_call([npm_exe, "install"])
            print("✅ 前端依赖安装成功！")
        except Exception as e:
            print(f"❌ 前端安装失败！请确保你安装了 Node.js。错误: {e}")
            return False
    else:
        print("✅ 前端依赖已就绪。")
    return True


def check_python_environment():
    """检查后端 Python 环境"""
    print("🔍 正在检查后端依赖 (Python)...")
    python_exe = sys.executable
    for import_name, install_name in PYTHON_PACKAGES.items():
        if importlib.util.find_spec(import_name) is None:
            print(f"📦 正在自动安装 Python 库: {install_name}...")
            subprocess.check_call([python_exe, "-m", "pip", "install", install_name])
    print("✅ 后端依赖已就绪。")
    return True


if __name__ == "__main__":
    # 强制切换到脚本所在目录
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    print("🌟 --- 星辉云端控制台 · 自动部署系统 --- 🌟")

    # 先查前端，再查后端
    if check_node_environment() and check_python_environment():
        print("\n🚀 所有环境准备就绪，正在点火启动...")
        # 启动 launcher.py，并保留当前窗口输出，方便双击时查看错误。
        exit_code = subprocess.call([sys.executable, "launcher.py"])
        if exit_code != 0:
            print(f"\n❌ 控制台启动失败，退出码：{exit_code}")
            input("按回车键退出...")
    else:
        print("\n⚠️ 环境检查未通过，请根据报错信息手动处理。")
        input("按回车键退出...")
