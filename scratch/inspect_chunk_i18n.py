file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\chunks\index-CmBT__Kc.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find('"sidebar.historyTitle"')
if idx != -1:
    snippet = content[idx-100:idx+400]
    print(snippet.encode('ascii', 'ignore').decode('ascii'))
else:
    print("Not found in chunks/index-CmBT__Kc.js")
