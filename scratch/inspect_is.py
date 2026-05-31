file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\background.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's find "is=" or "const is=" or "function is" or "is("
import re
for match in re.finditer(r'\bis\b\s*=', content):
    start = max(0, match.start() - 100)
    end = min(len(content), match.end() + 200)
    print(f"Match is= Context: ...{content[start:end]}...\n" + "="*50)

for match in re.finditer(r'function\s+is\b', content):
    start = max(0, match.start() - 100)
    end = min(len(content), match.end() + 200)
    print(f"Function is Context: ...{content[start:end]}...\n" + "="*50)
