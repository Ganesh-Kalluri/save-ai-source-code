with open(r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\chunks\db-_VinwtYz.js", "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("vb=(A,e,r,t=!1)=>{")
if idx != -1:
    print(content[idx:idx+2500])
