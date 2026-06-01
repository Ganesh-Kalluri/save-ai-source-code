with open(r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\chunks\db-_VinwtYz.js", "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("function d_(")
if idx != -1:
    print("d_:")
    print(content[idx:idx+1000])

idx = content.find("async function E_(")
if idx == -1:
    idx = content.find("function E_(")
if idx != -1:
    print("E_:")
    print(content[idx:idx+1500])
