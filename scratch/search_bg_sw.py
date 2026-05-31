file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\background.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for "SW" in any case in background.js
import re
for match in re.finditer(r'SW', content):
    start = max(0, match.start() - 100)
    end = min(len(content), match.end() + 100)
    print(f"Match: {match.group()} at {match.start()}")
    print(f"  Context: {content[start:end].encode('ascii', 'ignore').decode('ascii')}")
    print("---")
