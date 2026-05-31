import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"

# 1. content-scripts/content.js
file_path_content = os.path.join(root_dir, "content-scripts", "content.js")
with open(file_path_content, "r", encoding="utf-8") as f:
    content = f.read()

target_content = 'c=()=>{n=TM.runtime.connect({name:wM({endpointName:t,fingerprint:e})}),n.onMessage.addListener(l),n.onDisconnect.addListener(c),Py.toBackground(n,{type:"sync",pendingResponses:i.entries(),pendingDeliveries:[...new Set(r.map(({resolvedDestination:f})=>f))]})}'
replacement_content = 'c=()=>{if(!TM.runtime?.id)return;try{n=TM.runtime.connect({name:wM({endpointName:t,fingerprint:e})}),n.onMessage.addListener(l),n.onDisconnect.addListener(c),Py.toBackground(n,{type:"sync",pendingResponses:i.entries(),pendingDeliveries:[...new Set(r.map(({resolvedDestination:f})=>f))]})}catch(err){}}'

if target_content in content:
    content = content.replace(target_content, replacement_content)
    with open(file_path_content, "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully patched reconnection loop in content.js!")
else:
    print("Target NOT found in content.js")

# 2. chunks/index-CmBT__Kc.js
file_path_chunk = os.path.join(root_dir, "chunks", "index-CmBT__Kc.js")
with open(file_path_chunk, "r", encoding="utf-8") as f:
    chunk = f.read()

target_chunk = 'p=()=>{o=oy.runtime.connect({name:ty({endpointName:r,fingerprint:i})}),o.onMessage.addListener(g),o.onDisconnect.addListener(p),Wc.toBackground(o,{type:"sync",pendingResponses:c.entries(),pendingDeliveries:[...new Set(s.map(({resolvedDestination:f})=>f))]})}'
replacement_chunk = 'p=()=>{if(!oy.runtime?.id)return;try{o=oy.runtime.connect({name:ty({endpointName:r,fingerprint:i})}),o.onMessage.addListener(g),o.onDisconnect.addListener(p),Wc.toBackground(o,{type:"sync",pendingResponses:c.entries(),pendingDeliveries:[...new Set(s.map(({resolvedDestination:f})=>f))]})}catch(err){}}'

if target_chunk in chunk:
    chunk = chunk.replace(target_chunk, replacement_chunk)
    with open(file_path_chunk, "w", encoding="utf-8") as f:
        f.write(chunk)
    print("Successfully patched reconnection loop in index-CmBT__Kc.js!")
else:
    print("Target NOT found in index-CmBT__Kc.js")
