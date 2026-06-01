import os

content_js_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\content-scripts\content.js"

if os.path.exists(content_js_path):
    with open(content_js_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Define target string with exact newlines
    target = """const c=o.contents.filter(f=>f.type==="thinking"&&!e?!1:(f.type==="markdown"||f.type==="text"||f.type==="thinking")&&f.content).map(f=>{const p=f.content.trim();return f.type==="thinking"?`Thinking\n\n${p}`:p}).filter(f=>f.length>0);"""
    
    # We replace \\n in the python string with literal newlines to match the file
    target = target.replace("\\n", "\n")

    replacement = 'const formatMarkdownLineBreaks=text=>text?text.split("\\n").map(l=>{const t=l.trimEnd();return t===""?"":t+"  "}).join("\\n"):"";const c=o.contents.filter(f=>f.type==="thinking"&&!e?!1:(f.type==="markdown"||f.type==="text"||f.type==="thinking")&&f.content).map(f=>{const p=f.content.trim();return f.type==="thinking"?`Thinking\\n\\n${formatMarkdownLineBreaks(p)}`:formatMarkdownLineBreaks(p)}).filter(f=>f.length>0);'

    if target in content:
        content = content.replace(target, replacement)
        with open(content_js_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Successfully patched content-scripts/content.js")
    else:
        print("Target not found in content-scripts/content.js")
else:
    print("content-scripts/content.js not found.")
