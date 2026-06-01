import re

content_path = r"c:\Users\Kalluri Ganesh\Downloads\Telegram Desktop\save-ai-source-code-main\chunks\preview-BsmczefX.js"

with open(content_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's search for ".contents"
matches = [m.start() for m in re.finditer(r"\.contents", content)]
for i, idx in enumerate(matches):
    snippet = content[max(0, idx-400):idx+800]
    with open(f"c:\\Users\\Kalluri Ganesh\\Downloads\\Telegram Desktop\\save-ai-source-code-main\\scratch\\preview_contents_{i}.txt", "w", encoding="utf-8") as out:
        out.write(snippet)
print(f"Written {len(matches)} matches.")
