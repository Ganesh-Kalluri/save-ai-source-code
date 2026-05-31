import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"

# 1. content-scripts/content.js
file_path_content = os.path.join(root_dir, "content-scripts", "content.js")
with open(file_path_content, "r", encoding="utf-8") as f:
    content = f.read()
idx_content = content.find('c=()=>{n=TM.runtime.connect')
print("Content JS Context:")
print(content[idx_content-100:idx_content+400])
print("="*50)

# 2. chunks/index-CmBT__Kc.js
file_path_chunk = os.path.join(root_dir, "chunks", "index-CmBT__Kc.js")
with open(file_path_chunk, "r", encoding="utf-8") as f:
    chunk = f.read()
idx_chunk = chunk.find('p=()=>{o=oy.runtime.connect')
print("Chunk JS Context:")
print(chunk[idx_chunk-100:idx_chunk+400])
