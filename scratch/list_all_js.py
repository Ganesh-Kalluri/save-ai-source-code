import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"
for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".js"):
            print(f"JS File: {os.path.relpath(os.path.join(dirpath, filename), root_dir)}")
