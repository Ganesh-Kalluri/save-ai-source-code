import os
import re

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"

# Let's search and replace in all JS files
for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".js") and not dirpath.endswith(".git") and "node_modules" not in dirpath:
            full_path = os.path.join(dirpath, filename)
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            # Find the exact pattern: "sidebar.historyTitle":{...}
            # We want to capture the translation object to duplicate it
            # Match "sidebar.historyTitle":{ ... } 
            # We can use regex to find `"sidebar.historyTitle":{` up to the closing `}`
            match = re.search(r'"sidebar\.historyTitle"\s*:\s*\{([^}]+)\}', content)
            if match:
                full_match = match.group(0) # "sidebar.historyTitle":{...}
                inner_content = match.group(1) # en:"History",...
                replacement = f'{full_match},"sidebar.history":{{{inner_content}}}'
                
                if replacement not in content:
                    content = content.replace(full_match, replacement)
                    print(f"Successfully patched i18n in {os.path.relpath(full_path, root_dir)}")
                    with open(full_path, "w", encoding="utf-8") as f:
                        f.write(content)
                else:
                    print(f"Already patched i18n in {os.path.relpath(full_path, root_dir)}")

print("Regex patch script finished!")
