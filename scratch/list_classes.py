import re

file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\content-scripts\content.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for "class " in content.js and print their names
# Since it's minified, let's find class declarations
classes = re.findall(r'\bclass\s+(\w+)', content)
print("Classes found:", classes)
