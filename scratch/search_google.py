import re

file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\content-scripts\content.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

for match in re.finditer(r'google\.com', content):
    start = max(0, match.start() - 100)
    end = min(len(content), match.end() + 100)
    print(f"Index: {match.start()}")
    print(f"Context: ...{content[start:end]}...\n" + "="*50)
