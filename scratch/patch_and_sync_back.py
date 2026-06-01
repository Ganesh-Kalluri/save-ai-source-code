import os
import shutil

dev_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main"
active_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"

# 1. Sync FileExportHelper.js
shutil.copy2(
    os.path.join(dev_dir, "src", "utils", "FileExportHelper.js"),
    os.path.join(active_dir, "src", "utils", "FileExportHelper.js")
)
print("Copied FileExportHelper.js from dev to active.")

# 2. Re-patch chunks/db-_VinwtYz.js and content-scripts/content.js in both dev and active directories
target_pattern = 'const formatMarkdownLineBreaks=text=>text?text.trim():\"\";'
replacement_pattern = 'const formatMarkdownLineBreaks=text=>text?text.split("\\n").map(l=>{const esc=l.replace(/^(\\s*\\d+)\\./,"$1\\\\.");const t=esc.trimEnd();return t===\"\"?\"\":t+\"  \"}).join(\"\\n\"):\"\";'

paths_to_patch = [
    os.path.join(dev_dir, "chunks", "db-_VinwtYz.js"),
    os.path.join(active_dir, "chunks", "db-_VinwtYz.js"),
    os.path.join(dev_dir, "content-scripts", "content.js"),
    os.path.join(active_dir, "content-scripts", "content.js")
]

for path in paths_to_patch:
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        if target_pattern in content:
            new_content = content.replace(target_pattern, replacement_pattern)
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Successfully patched {path}")
        else:
            print(f"Pattern not found in {path}.")
    else:
        print(f"Path does not exist: {path}")
