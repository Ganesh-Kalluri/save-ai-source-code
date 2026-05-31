file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\content-scripts\content.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re
for match in re.finditer(r'\b_saveai_orig_Px\b', content):
    start = max(0, match.start() - 100)
    end = min(len(content), match.end() + 100)
    print(f"Match: {match.group()} at {match.start()}")
    print(f"  Context: {content[start:end].encode('ascii', 'ignore').decode('ascii')}")
    print("---")
