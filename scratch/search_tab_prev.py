import os
import re

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"
for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith((".js", ".json", ".html")) and not dirpath.endswith(".git") and "node_modules" not in dirpath:
            full_path = os.path.join(dirpath, filename)
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            if "tab-prev" in content:
                print(f"File: {os.path.relpath(full_path, root_dir)}")
                # find indices of tab-prev
                for match in re.finditer(r'tab-prev', content):
                    start = max(0, match.start() - 100)
                    end = min(len(content), match.end() + 100)
                    print(f"  Context: ...{content[start:end]}...")
