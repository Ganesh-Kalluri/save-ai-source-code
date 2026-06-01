import os
import re

path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\chunks\db-_VinwtYz.js"

with open(path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's search for where the heading text is processed.
# In j_, we saw:
# const v=d_(B,p.style,e),w=await E_(v,p.style,e,{sequenceIdOffset:a});
# Let's find "function d_(" or "function E_(" or search for "Heading" handling.
matches = [m.start() for m in re.finditer(r"Heading", content)]
for idx in matches[:10]:
    print(content[max(0, idx-100):idx+300])
    print("-" * 50)
