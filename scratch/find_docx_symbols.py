import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main"

search_terms = ["saveaiMathXmlNode", "saveaiInlineMathNode", "Packer", "docx", "XmlComponent", "Ht.CENTER"]

for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".js") or filename.endswith(".jsx"):
            path = os.path.join(dirpath, filename)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                for term in search_terms:
                    if term in content:
                        print(f"Found '{term}' in: {os.path.relpath(path, root_dir)}")
            except Exception as e:
                pass
