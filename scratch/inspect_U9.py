with open(r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\content-scripts\content.js", "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("U9=")
if idx == -1:
    idx = content.find("U9 =")
if idx != -1:
    print(content[idx-100:idx+500])
