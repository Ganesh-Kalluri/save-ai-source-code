import os
import re

path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\chunks\sidepanel-8b8dlfXQ.js"

with open(path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's find imports or variables that are assigned to os
# We can search for the definition of "os" or trace it
# Look at where "os" is declared or imported: e.g. "import { ... } from" or "const os"
idx = 0
while True:
    idx = content.find("os", idx)
    if idx == -1:
        break
    # print context if it's "const os =" or similar
    context = content[max(0, idx-50):idx+50]
    if "const os" in context or "os =" in context or "os(" in context or "import" in context:
        print(f"Context at {idx}: {context.strip()}")
    idx += 2
