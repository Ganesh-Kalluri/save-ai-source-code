file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\content-scripts\content.js"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

target = 'async function Ih(t){if(!await Kl.get("enableSuccessNotification"))return;'

for idx, line in enumerate(lines):
    if target in line:
        print(f"Found on line {idx+1}")
