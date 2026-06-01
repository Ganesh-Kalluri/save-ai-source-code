with open(r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\chunks\preview-BsmczefX.js", "r", encoding="utf-8") as f:
    content = f.read()

if "exportMessagesToMarkdown" in content:
    print("Found exportMessagesToMarkdown in chunks/preview-BsmczefX.js")
if "serializeMessagesToMarkdown" in content:
    print("Found serializeMessagesToMarkdown in chunks/preview-BsmczefX.js")
