file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\content-scripts\content.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx_bg = content.find('function _saveai_orig_Px')
idx_a = content.find('function A(E)', idx_bg)
print(repr(content[idx_a:idx_a+400]))
