import os
import re

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"
target = "chatDetails"
for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".js") and not dirpath.endswith(".git") and "node_modules" not in dirpath:
            full_path = os.path.join(dirpath, filename)
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            if target in content:
                print(f"FOUND IN: {os.path.relpath(full_path, root_dir)}")
                for match in re.finditer(target, content):
                    start = max(0, match.start() - 100)
                    end = min(len(content), match.end() + 100)
                    print(f"  Context: {content[start:end].encode('ascii', 'ignore').decode('ascii')}")
