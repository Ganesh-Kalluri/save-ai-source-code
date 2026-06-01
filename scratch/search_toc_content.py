with open(r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\content-scripts\content.js", "r", encoding="utf-8") as f:
    content = f.read()

idx = 0
while True:
    idx = content.find("_toc_", idx)
    if idx == -1:
        break
    print(content[max(0, idx-100):idx+300])
    print("=" * 60)
    idx += 5
