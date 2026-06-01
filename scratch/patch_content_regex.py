import os
import re

content_js_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\content-scripts\content.js"

if os.path.exists(content_js_path):
    with open(content_js_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Let's search for the pattern in up
    # We want to match:
    # const p=o.contents.filter(m=>m.type==="thinking"&&!e?!1:(m.type==="markdown"||m.type==="text"||m.type==="thinking")&&m.content).map(m=>{const x=m.content.trim();return m.type==="thinking"?`Thinking\n\n${x}`:x}).filter(m=>m.length>0);
    # but with potential literal newlines
    
    pattern = r'const p=o\.contents\.filter\(m=>m\.type==="thinking"&&!e\?!1:\(m\.type==="markdown"\|\|m\.type==="text"\|\|m\.type==="thinking"\)&&m\.content\)\.map\(m=>\{const x=m\.content\.trim\(\);return m\.type==="thinking"\?`Thinking\s*\n\s*\n\s*\${x}`:x\}\)\.filter\(m=>m\.length>0\);'
    
    match = re.search(pattern, content)
    if match:
        print("Found match using regex!")
        matched_str = match.group(0)
        
        replacement = 'const formatMarkdownLineBreaks=text=>text?text.split("\\n").map(l=>{const t=l.trimEnd();return t===""?"":t+"  "}).join("\\n"):"";const p=o.contents.filter(m=>m.type==="thinking"&&!e?!1:(m.type==="markdown"||m.type==="text"||m.type==="thinking")&&m.content).map(m=>{const x=m.content.trim();return m.type==="thinking"?`Thinking\n\n${formatMarkdownLineBreaks(x)}`:formatMarkdownLineBreaks(x)}).filter(m=>m.length>0);'
        
        content = content.replace(matched_str, replacement)
        with open(content_js_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Successfully patched content-scripts/content.js using regex")
    else:
        print("Regex match not found in content-scripts/content.js")
else:
    print("content-scripts/content.js not found.")
