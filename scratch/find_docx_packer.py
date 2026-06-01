import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main"

for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".js"):
            path = os.path.join(dirpath, filename)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                # search for docx library markers or document generation
                if "Packer" in content or "asBlob" in content or "docx" in content.lower():
                    if "node_modules" not in path:
                        print(f"Found docx/packer marker in: {os.path.relpath(path, root_dir)}")
            except Exception as e:
                pass
