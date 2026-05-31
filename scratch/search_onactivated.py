import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\src"
for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        full_path = os.path.join(dirpath, filename)
        try:
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            if "onActivated" in content or "tab-prev" in content or "onUpdated" in content:
                print(f"FOUND IN: {os.path.relpath(full_path, root_dir)}")
        except Exception as e:
            pass
