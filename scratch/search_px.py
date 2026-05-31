import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"
file_path = os.path.join(root_dir, "content-scripts", "content.js")
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for all definitions of function Px or variables assigned to Px
import re
for match in re.finditer(r'\bPx\b', content):
    start = max(0, match.start() - 100)
    end = min(len(content), match.end() + 100)
    print(f"Match: {match.group()} at {match.start()}")
    print(f"  Context: {content[start:end].encode('ascii', 'ignore').decode('ascii')}")
    print("---")
