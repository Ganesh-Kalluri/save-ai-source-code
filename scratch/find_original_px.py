file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\content-scripts\content.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for the assignment or function header of Px prior to math patch
# It was original Px, then: const _saveai_orig_Px = Px;
# Let's find where the original "function Px" is defined
# We can search for the original minified definition.
# Let's search for the first occurrence of "function Px"
idx = content.find('function Px')
while idx != -1:
    print(content[idx-50:idx+350])
    print("---")
    idx = content.find('function Px', idx+1)
