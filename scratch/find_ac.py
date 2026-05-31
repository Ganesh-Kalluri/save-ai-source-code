import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"
file_path = os.path.join(root_dir, "content-scripts", "content.js")
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find('class ac')
if idx != -1:
    print(content[idx-100:idx+400])
else:
    print("class ac not found")
