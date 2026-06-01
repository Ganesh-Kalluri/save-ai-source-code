import os
import re

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main"

search_patterns = [
    r"\bvb\s*=",
    r"\bvb\s*\(",
    r"\bos\s*="
]

for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".js") and ("chunks" in dirpath or "content-scripts" in dirpath):
            path = os.path.join(dirpath, filename)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                for pattern in search_patterns:
                    for m in re.finditer(pattern, content):
                        print(f"Pattern '{pattern}' match in {os.path.relpath(path, root_dir)} at index {m.start()}:")
                        print(content[max(0, m.start()-100):m.start()+400])
                        print("-" * 60)
            except Exception as e:
                pass
