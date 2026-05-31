file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\background.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for "setUninstallURL" but start looking from the end of the file or after the polyfill definition
idx = content.find('xe.runtime.setUninstallURL')
print(content[idx-100:idx+400])
