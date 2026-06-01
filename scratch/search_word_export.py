import os
import re

content_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\content-scripts\content.js"

with open(content_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's search for docx build functions or export functions
# Word export is exportMessagesToWord, let's find references to it
matches = [m.start() for m in re.finditer("exportMessagesToWord", content)]
for idx in matches:
    print(f"exportMessagesToWord at index {idx}:")
    print(content[max(0, idx-200):idx+800])
    print("=" * 60)
