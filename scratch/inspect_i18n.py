file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\src\background\i18n.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find('copySuccess')
snippet = content[idx-100:idx+400]
print(snippet.encode('ascii', 'ignore').decode('ascii'))
