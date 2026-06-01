import os
import re

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main"

for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".js") or filename.endswith(".jsx") or filename.endswith(".html"):
            path = os.path.join(dirpath, filename)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                if "exportMessagesToWord" in content:
                    print(f"Found exportMessagesToWord in: {os.path.relpath(path, root_dir)}")
                if "exportMessagesToMarkdown" in content:
                    print(f"Found exportMessagesToMarkdown in: {os.path.relpath(path, root_dir)}")
            except Exception as e:
                pass
