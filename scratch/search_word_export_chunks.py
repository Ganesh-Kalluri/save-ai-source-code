import os
import re

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main"

for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".js") and "chunks" in dirpath:
            path = os.path.join(dirpath, filename)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                matches = [m.start() for m in re.finditer("exportMessagesToWord", content)]
                for idx in matches:
                    print(f"exportMessagesToWord in {os.path.relpath(path, root_dir)} at index {idx}:")
                    print(content[max(0, idx-200):idx+800])
                    print("=" * 60)
            except Exception as e:
                pass
