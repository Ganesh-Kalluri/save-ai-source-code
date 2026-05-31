import os
import re

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"
for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".js") and not dirpath.endswith(".git") and "node_modules" not in dirpath:
            full_path = os.path.join(dirpath, filename)
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            # Find occurrences of something.fingerprint where something could be a variable (like n.fingerprint or f.fingerprint)
            # but NOT including ?.fingerprint or custom checks
            for match in re.finditer(r'(?<!\?)\.fingerprint\b', content):
                start = max(0, match.start() - 100)
                end = min(len(content), match.end() + 100)
                print(f"File: {os.path.relpath(full_path, root_dir)}, Index: {match.start()}")
                print(f"Context: ...{content[start:end]}...\n" + "="*50)
