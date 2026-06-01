import os
import re

content_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\content-scripts\content.js"

with open(content_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's search for "function UQ" in content.js
matches = [m.start() for m in re.finditer(r"\bUQ\b", content)]
for idx in matches:
    print(f"UQ at index {idx}:")
    print(content[max(0, idx-200):idx+800])
    print("=" * 60)
