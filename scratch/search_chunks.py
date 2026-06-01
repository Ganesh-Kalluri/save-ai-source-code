import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

path = r'c:\Users\Kalluri Ganesh\Downloads\Telegram Desktop\save-ai-source-code-main\chunks\db-_VinwtYz.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's search for function F_ and function cp
for func_name in ['F_', 'cp']:
    m = re.search(rf'function {func_name}\(', content)
    if m:
        print(f"--- function {func_name} ---")
        print(content[m.start():m.start()+2500])
    else:
        print(f"function {func_name} not found")
