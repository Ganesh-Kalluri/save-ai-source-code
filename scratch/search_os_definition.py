import os
import re

path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\chunks\sidepanel-8b8dlfXQ.js"

with open(path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's find "os(e,r,o,a)" or "os=" or similar.
# Let's search for "os(" or "os="
matches = [m.start() for m in re.finditer(r"\bos\s*\(", content)]
for idx in matches:
    print(f"os( at index {idx}:")
    print(content[max(0, idx-100):idx+300])
    print("=" * 60)

matches2 = [m.start() for m in re.finditer(r"\bos\s*=", content)]
for idx in matches2:
    print(f"os= at index {idx}:")
    print(content[max(0, idx-100):idx+300])
    print("=" * 60)
