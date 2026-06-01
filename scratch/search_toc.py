import os
import re

path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\chunks\db-_VinwtYz.js"

with open(path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

matches = [m.start() for m in re.finditer(r"_toc_", content)]
for idx in matches:
    print(content[max(0, idx-100):idx+300])
    print("=" * 60)
