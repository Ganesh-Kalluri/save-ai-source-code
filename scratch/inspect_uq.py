file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\content-scripts\content.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find('function uQ')
print(content[idx-100:idx+600])
