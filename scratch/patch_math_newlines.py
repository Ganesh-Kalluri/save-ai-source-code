import os
import shutil

dev_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main"
active_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"

# 1. Sync FileExportHelper.js
shutil.copy2(
    os.path.join(dev_dir, "src", "utils", "FileExportHelper.js"),
    os.path.join(active_dir, "src", "utils", "FileExportHelper.js")
)
print("Copied FileExportHelper.js from dev to active.")

# 2. Re-patch chunks/db-_VinwtYz.js and content-scripts/content.js in both dev and active directories
target_pattern = 'const formatMarkdownLineBreaks=text=>{if(!text)return\"\";const lines=text.split(\"\\n\"),result=[];let inCodeBlock=!1;for(let i=0;i<lines.length;i++){const line=lines[i],trimmed=line.trim();if(trimmed.startsWith(\"```\")){inCodeBlock=!inCodeBlock,result.push(line);continue}if(inCodeBlock){result.push(line);continue}if(trimmed.startsWith(\"|\")||trimmed.includes(\"|\")){result.push(line);continue}if(trimmed===\"\")result.push(\"\");else{if(result.length>0&&result[result.length-1]!==\"\")result.push(\"\");result.push(trimmed)}}return result.join(\"\\n\")};'
replacement_pattern = 'const formatMarkdownLineBreaks=text=>{if(!text)return\"\";text=text.replace(/([^\\n])\\s*\\$\\$(.*?)\\$\\$/g,((e,n,o)=>n+\"\\n$$\"+o+\"$$\")),text=text.replace(/\\$\\$(.*?)\\$\\$\\s*([^\\n])/g,((e,n,o)=>\"$$\"+n+\"$$\\n\"+o));const lines=text.split(\"\\n\"),result=[];let inCodeBlock=!1;for(let i=0;i<lines.length;i++){const line=lines[i],trimmed=line.trim();if(trimmed.startsWith(\"```\")){inCodeBlock=!inCodeBlock,result.push(line);continue}if(inCodeBlock){result.push(line);continue}if(trimmed.startsWith(\"|\")||trimmed.includes(\"|\")){result.push(line);continue}if(trimmed===\"\")result.push(\"\");else{if(result.length>0&&result[result.length-1]!==\"\")result.push(\"\");result.push(trimmed)}}return result.join(\"\\n\")};'

paths_to_patch = [
    os.path.join(dev_dir, "chunks", "db-_VinwtYz.js"),
    os.path.join(active_dir, "chunks", "db-_VinwtYz.js"),
    os.path.join(dev_dir, "content-scripts", "content.js"),
    os.path.join(active_dir, "content-scripts", "content.js")
]

for path in paths_to_patch:
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        if target_pattern in content:
            new_content = content.replace(target_pattern, replacement_pattern)
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Successfully patched {path}")
        else:
            print(f"Pattern not found in {path}.")
    else:
        print(f"Path does not exist: {path}")
