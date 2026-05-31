import os

file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\background.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = 'xe.runtime.setUninstallURL("https://ai.feishu.cn/share/base/form/shrcnI6QVYS2Is4EnKLskQyMtTc"),xe.runtime.onInstalled.addListener(o=>{bo(),o.reason==="install"?(Cn(),xe.tabs.create({active:!0,url:Aa()}),e0()):o.reason==="update"&&(Cn(),Hc())})'
replacement = '/* xe.runtime.setUninstallURL("https://ai.feishu.cn/share/base/form/shrcnI6QVYS2Is4EnKLskQyMtTc"), */ xe.runtime.onInstalled.addListener(o=>{bo(),o.reason==="install"?(Cn(),e0()):o.reason==="update"&&(Cn(),Hc())})'

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully removed redirects from background.js!")
else:
    print("Target NOT found in background.js!")
