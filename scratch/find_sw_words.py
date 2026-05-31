file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\background.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = set(re.findall(r'\b[a-zA-Z]*sw[a-zA-Z]*\b', content, re.IGNORECASE))
print("Matching words containing 'sw':", sorted(list(matches)))
