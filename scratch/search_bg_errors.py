file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\background.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# find all throw statements or Error instantiations in background.js
import re
for match in re.finditer(r'\bthrow\b|\bnew\s+Error\b', content):
    start = max(0, match.start() - 100)
    end = min(len(content), match.end() + 200)
    print(f"Match: {match.group()} at {match.start()}")
    print(f"  Context: {content[start:end].encode('ascii', 'ignore').decode('ascii')}")
    print("---")
