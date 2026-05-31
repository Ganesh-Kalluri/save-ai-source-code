import re

file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\content-scripts\content.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for matches of "finger" case-insensitively and print 100 characters before and after
for match in re.finditer(r'\b[a-zA-Z]*finger[a-zA-Z]*\b', content, re.IGNORECASE):
    start = max(0, match.start() - 100)
    end = min(len(content), match.end() + 100)
    print(f"Match: '{match.group()}' at index {match.start()}")
    print(f"Context: ...{content[start:end]}...\n" + "="*50)
