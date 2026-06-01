import os
import re

path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\chunks\sidepanel-8b8dlfXQ.js"

with open(path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# find where enableThinkingContent is used, or let's search for "os" function definition.
# Since it is minified, let's search for the text that might be inside it:
# e.g., "From: " or "you asked" or "response" or "---"
search_terms = ["> From:", "you asked", "response", "---"]
for term in search_terms:
    matches = [m.start() for m in re.finditer(re.escape(term), content)]
    for idx in matches:
        print(f"Found '{term}' at index {idx}:")
        print(content[max(0, idx-300):idx+500])
        print("=" * 60)
