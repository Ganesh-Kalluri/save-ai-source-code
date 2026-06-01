import os
import re

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main"

for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".js") or filename.endswith(".jsx"):
            path = os.path.join(dirpath, filename)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                # Find where "contents:" is populated or assigned
                matches = [m.start() for m in re.finditer(r"\bcontents\s*:", content)]
                for idx in matches:
                    print(f"Found contents: in {os.path.relpath(path, root_dir)} at index {idx}:")
                    print(content[max(0, idx-100):idx+300])
                    print("=" * 60)
            except Exception as e:
                pass
