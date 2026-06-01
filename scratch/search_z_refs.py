import os
import re

path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\chunks\db-_VinwtYz.js"

with open(path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's search for "z_" to see where it comes from
matches = [m.start() for m in re.finditer(r"\bz_\b", content)]
for idx in matches:
    print(f"z_ at index {idx}:")
    print(content[max(0, idx-100):idx+300])
    print("=" * 60)
