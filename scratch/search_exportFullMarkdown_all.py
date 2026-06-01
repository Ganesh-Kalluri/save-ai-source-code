with open(r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\content-scripts\content.js", "r", encoding="utf-8") as f:
    content = f.read()

idx = 0
while True:
    idx = content.find("exportFullMarkdown", idx)
    if idx == -1:
        break
    print(f"Match found at index {idx}:")
    print(content[max(0, idx-100):idx+300])
    print("-" * 50)
    idx += 18
