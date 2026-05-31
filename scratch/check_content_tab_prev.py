file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\content-scripts\content.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

if "tab-prev" in content:
    print("Found tab-prev in content.js!")
else:
    print("NOT found in content.js.")
