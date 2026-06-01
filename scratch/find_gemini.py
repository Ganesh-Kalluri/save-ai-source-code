import re

path = r'c:\Users\Kalluri Ganesh\Downloads\Telegram Desktop\save-ai-source-code-main\content-scripts\content.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find "class Yy" and get its content
m = re.search(r'class Yy', content)
if m:
    # Print the next 6000 characters from class Yy
    start = m.start()
    print(content[start:start+6000])
else:
    print("class Yy not found")
