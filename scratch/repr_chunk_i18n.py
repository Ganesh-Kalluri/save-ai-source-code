file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\chunks\index-CmBT__Kc.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find('"sidebar.historyTitle"')
snippet = content[idx:idx+250]
# Use ascii encoding backslashreplace to show non-ascii safely in python output
print(snippet.encode('ascii', 'backslashreplace').decode('ascii'))
