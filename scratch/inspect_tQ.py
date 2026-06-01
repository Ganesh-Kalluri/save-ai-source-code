with open(r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\content-scripts\content.js", "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("tQ(t,e,n){")
if idx != -1:
    print(content[idx:idx+1500])
