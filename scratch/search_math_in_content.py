import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"
# Let's search in content-scripts/content.js for saveaiInlineMathNode
file_path = os.path.join(root_dir, "content-scripts", "content.js")
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find('saveaiInlineMathNode')
if idx != -1:
    print("Found in content.js!")
    print(content[idx-100:idx+600])
else:
    print("NOT found in content.js")
