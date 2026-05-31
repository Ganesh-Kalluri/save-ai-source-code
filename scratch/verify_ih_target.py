file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\content-scripts\content.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = 'async function Ih(t){if(!await Kl.get("enableSuccessNotification"))return;'

if target in content:
    print("Found exact target!")
else:
    print("Target NOT found!")
