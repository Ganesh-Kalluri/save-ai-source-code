import os
import re

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"
# Let's search for "sidebar." keys in chunks/index-CmBT__Kc.js
file_path = os.path.join(root_dir, "chunks", "index-CmBT__Kc.js")
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's find matches for "sidebar.something"
for match in re.finditer(r'"sidebar\.[a-zA-Z]+"', content):
    print(match.group())
