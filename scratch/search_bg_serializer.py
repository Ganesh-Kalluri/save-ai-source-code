import os
import re

path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\background.js"

with open(path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's search for "you asked" or similar patterns in background.js
search_terms = ["you asked", "response", "formatMarkdownLineBreaks"]
for term in search_terms:
    matches = [m.start() for m in re.finditer(re.escape(term), content)]
    for idx in matches:
        print(f"Found '{term}' at index {idx}:")
        print(content[max(0, idx-150):idx+350])
        print("=" * 60)
