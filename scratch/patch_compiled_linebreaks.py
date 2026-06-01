import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main"

db_chunk_path = os.path.join(root_dir, "chunks", "db-_VinwtYz.js")
content_js_path = os.path.join(root_dir, "content-scripts", "content.js")

target_bb_pattern = 'const o=i.contents.filter(d=>d.type==="thinking"&&!e?!1:(d.type==="markdown"||d.type==="text"||d.type==="thinking")&&d.content).map(d=>{const c=d.content.trim();return d.type==="thinking"?`Thinking\n\n${c}`:c}).filter(d=>d.length>0);'

replacement_bb = 'const formatMarkdownLineBreaks=text=>text?text.split("\\n").map(l=>{const t=l.trimEnd();return t===""?"":t+"  "}).join("\\n"):"";const o=i.contents.filter(d=>d.type==="thinking"&&!e?!1:(d.type==="markdown"||d.type==="text"||d.type==="thinking")&&d.content).map(d=>{const c=d.content.trim();return d.type==="thinking"?`Thinking\\n\\n${formatMarkdownLineBreaks(c)}`:formatMarkdownLineBreaks(c)}).filter(d=>d.length>0);'

target_up_pattern = 'const p=o.contents.filter(m=>m.type==="thinking"&&!e?!1:(m.type==="markdown"||m.type==="text"||m.type==="thinking")&&m.content).map(m=>{const x=m.content.trim();return m.type==="thinking"?`Thinking\n\n${x}`:x}).filter(m=>m.length>0);'

replacement_up = 'const formatMarkdownLineBreaks=text=>text?text.split("\\n").map(l=>{const t=l.trimEnd();return t===""?"":t+"  "}).join("\\n"):"";const p=o.contents.filter(m=>m.type==="thinking"&&!e?!1:(m.type==="markdown"||m.type==="text"||m.type==="thinking")&&m.content).map(m=>{const x=m.content.trim();return m.type==="thinking"?`Thinking\\n\\n${formatMarkdownLineBreaks(x)}`:formatMarkdownLineBreaks(x)}).filter(m=>m.length>0);'


# Modify db-_VinwtYz.js
if os.path.exists(db_chunk_path):
    with open(db_chunk_path, "r", encoding="utf-8") as f:
        content = f.read()
    if target_bb_pattern in content:
        content = content.replace(target_bb_pattern, replacement_bb)
        with open(db_chunk_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Successfully patched chunks/db-_VinwtYz.js")
    else:
        # check if it is already patched or slightly different
        print("Target pattern not found in chunks/db-_VinwtYz.js or already patched.")
else:
    print("chunks/db-_VinwtYz.js not found.")


# Modify content-scripts/content.js
if os.path.exists(content_js_path):
    with open(content_js_path, "r", encoding="utf-8") as f:
        content = f.read()
    if target_up_pattern in content:
        content = content.replace(target_up_pattern, replacement_up)
        with open(content_js_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Successfully patched content-scripts/content.js")
    else:
        print("Target pattern not found in content-scripts/content.js or already patched.")
else:
    print("content-scripts/content.js not found.")
