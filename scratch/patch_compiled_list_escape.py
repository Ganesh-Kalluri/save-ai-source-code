import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main"

db_chunk_path = os.path.join(root_dir, "chunks", "db-_VinwtYz.js")
content_js_path = os.path.join(root_dir, "content-scripts", "content.js")

target_func = 'const formatMarkdownLineBreaks=text=>text?text.split("\\n").map(l=>{const t=l.trimEnd();return t===""?"":t+"  "}).join("\\n"):"";'
replacement_func = 'const formatMarkdownLineBreaks=text=>text?text.split("\\n").map(l=>{const esc=l.replace(/^(\\s*\\d+)\\./,"$1\\\\.");const t=esc.trimEnd();return t===""?"":t+"  "}).join("\\n"):"";'

# Patch db-_VinwtYz.js
if os.path.exists(db_chunk_path):
    with open(db_chunk_path, "r", encoding="utf-8") as f:
        content = f.read()
    if target_func in content:
        content = content.replace(target_func, replacement_func)
        with open(db_chunk_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Successfully updated line-breaker in chunks/db-_VinwtYz.js")
    else:
        print("Target function not found in chunks/db-_VinwtYz.js (already updated or different)")
else:
    print("chunks/db-_VinwtYz.js not found.")

# Patch content-scripts/content.js
if os.path.exists(content_js_path):
    with open(content_js_path, "r", encoding="utf-8") as f:
        content = f.read()
    if target_func in content:
        content = content.replace(target_func, replacement_func)
        with open(content_js_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Successfully updated line-breaker in content-scripts/content.js")
    else:
        print("Target function not found in content-scripts/content.js (already updated or different)")
else:
    print("content-scripts/content.js not found.")
